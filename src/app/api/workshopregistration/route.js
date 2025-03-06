import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

// Scopes and environment variables
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_SHEET_ID_WORKSHOP = process.env.GOOGLE_SHEET_ID_WORKSHOP;

// Error types
const ERROR_TYPES = {
    MISSING_CREDENTIALS: 'MISSING_CREDENTIALS',
    MISSING_SHEET_ID: 'MISSING_SHEET_ID',
    AUTH_FAILED: 'AUTH_FAILED',
    MISSING_FIELDS: 'MISSING_FIELDS',
    DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
    DUPLICATE_PHONE: 'DUPLICATE_PHONE',
    SHEETS_API_ERROR: 'SHEETS_API_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    INVALID_JSON: 'INVALID_JSON'
};

// Cache for recent registrations
const registrationCache = {
    emails: new Set(),
    phones: new Set(),
    lastRefreshed: Date.now(),
    TTL: 5 * 60 * 1000, // 5 minutes
    
    needsRefresh() {
        return Date.now() - this.lastRefreshed > this.TTL;
    },
    
    reset() {
        this.emails.clear();
        this.phones.clear();
        this.lastRefreshed = Date.now();
    },
    
    add(email, phone) {
        this.emails.add(email);
        this.phones.add(phone);
    }
};

// Auth client
let authClient = null;
let authPromise = null;

const getAuthToken = async () => {
    // Return existing promise if authentication is in progress
    if (authPromise) return authPromise;
    
    // Check for required environment variables
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        const error = new Error('Missing Google credentials');
        error.type = ERROR_TYPES.MISSING_CREDENTIALS;
        throw error;
    }

    // Return existing client if still valid
    if (authClient && authClient.credentials && authClient.credentials.expiry_date > Date.now()) {
        return authClient;
    }

    // Create new auth promise
    authPromise = (async () => {
        try {
            const client = new JWT({
                email: GOOGLE_CLIENT_EMAIL,
                key: GOOGLE_PRIVATE_KEY,
                scopes: SCOPES,
            });

            await client.authorize();
            authClient = client;
            return client;
        } catch (error) {
            console.error('Auth error:', error.message);
            const authError = new Error('Authentication failed');
            authError.type = ERROR_TYPES.AUTH_FAILED;
            authError.cause = error;
            throw authError;
        } finally {
            authPromise = null;
        }
    })();

    return authPromise;
};

const checkDuplicateRegistration = async (sheets, data) => {
    // Check local cache first
    if (registrationCache.emails.has(data.email)) {
        const error = new Error('You have already registered with this email');
        error.type = ERROR_TYPES.DUPLICATE_EMAIL;
        return error;
    }
    
    if (registrationCache.phones.has(data.phone)) {
        const error = new Error('This phone number is already registered');
        error.type = ERROR_TYPES.DUPLICATE_PHONE;
        return error;
    }
    
    // Refresh cache if needed
    if (registrationCache.needsRefresh() || registrationCache.emails.size === 0) {
        try {
            registrationCache.reset();
            
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: GOOGLE_SHEET_ID_WORKSHOP,
                range: 'Sheet1!B:G', // Only get email and phone columns
                valueRenderOption: 'UNFORMATTED_VALUE',
            });

            const rows = response.data.values || [];
            if (rows.length === 0) return null;
            
            // Fill cache and check for duplicates
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i] || !rows[i][0]) continue;
                
                const rowEmail = rows[i][0];
                const rowPhone = rows[i][5];
                
                if (rowEmail) registrationCache.emails.add(rowEmail);
                if (rowPhone) registrationCache.phones.add(rowPhone);
                
                if (rowEmail === data.email) {
                    const error = new Error('You have already registered with this email');
                    error.type = ERROR_TYPES.DUPLICATE_EMAIL;
                    return error;
                }
                
                if (rowPhone && rowPhone === data.phone) {
                    const error = new Error('This phone number is already registered');
                    error.type = ERROR_TYPES.DUPLICATE_PHONE;
                    return error;
                }
            }
        } catch (error) {
            console.error('Duplicate check error:', error.message);
            const apiError = new Error('Failed to check registration status');
            apiError.type = ERROR_TYPES.SHEETS_API_ERROR;
            apiError.cause = error;
            throw apiError;
        }
    }

    return null;
};

const validateRequestData = (data) => {
    const requiredFields = ['email', 'name', 'rollNo', 'course', 'year', 'phone'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        const error = new Error(`Missing required fields: ${missingFields.join(', ')}`);
        error.type = ERROR_TYPES.MISSING_FIELDS;
        error.fields = missingFields;
        return error;
    }
    
    return null;
};

export async function POST(req) {
    try {
        // Check for sheet ID
        if (!GOOGLE_SHEET_ID_WORKSHOP) {
            throw {
                message: 'Missing Google Sheet ID', 
                type: ERROR_TYPES.MISSING_SHEET_ID
            };
        }

        // Parse request body
        let data;
        try {
            data = await req.json();
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid request body', type: ERROR_TYPES.INVALID_JSON },
                { status: 400 }
            );
        }
        
        // Validate required fields
        const validationError = validateRequestData(data);
        if (validationError) {
            return NextResponse.json(
                { 
                    error: validationError.message, 
                    type: validationError.type,
                    fields: validationError.fields 
                },
                { status: 400 }
            );
        }

        // Get auth token
        const client = await getAuthToken();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Check for duplicates
        const duplicateError = await checkDuplicateRegistration(sheets, data);
        if (duplicateError) {
            return NextResponse.json(
                { error: duplicateError.message, type: duplicateError.type },
                { status: 400 }
            );
        }

        // Prepare row data and save to spreadsheet
        const timestamp = new Date().toISOString();
        const rowData = [
            timestamp,
            data.email,
            data.name,
            data.rollNo,
            data.course,
            data.college || "Shivaji College",
            data.phone,
            "Workshop",
            "Workshop",
            data.year,
            data.query || ''
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID_WORKSHOP,
            range: 'Sheet1!A:K',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: { values: [rowData] },
        });
        
        // Update cache
        registrationCache.add(data.email, data.phone);

        return NextResponse.json({ 
            success: true,
            message: "Registration successful",
            timestamp
        }, { status: 200 });
    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            type: error.type || ERROR_TYPES.UNKNOWN_ERROR,
            cause: error.cause?.message
        });
        
        // Map error types to status codes
        let statusCode = 500;
        switch(error.type) {
            case ERROR_TYPES.MISSING_CREDENTIALS:
            case ERROR_TYPES.MISSING_SHEET_ID:
                statusCode = 503;
                break;
            case ERROR_TYPES.AUTH_FAILED:
                statusCode = 401;
                break;
            case ERROR_TYPES.MISSING_FIELDS:
            case ERROR_TYPES.INVALID_JSON:
                statusCode = 400;
                break;
            case ERROR_TYPES.DUPLICATE_EMAIL:
            case ERROR_TYPES.DUPLICATE_PHONE:
                statusCode = 409;
                break;
            default:
                statusCode = 500;
        }
        
        return NextResponse.json(
            { 
                error: error.message || 'Registration failed',
                type: error.type || ERROR_TYPES.UNKNOWN_ERROR,
                details: process.env.NODE_ENV === 'development' ? error.cause?.message : undefined
            },
            { status: statusCode }
        );
    }
}