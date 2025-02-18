import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_SHEET_ID_WORKSHOP = process.env.GOOGLE_SHEET_ID_WORKSHOP;

const getAuthToken = async () => {
    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
        throw new Error('Missing Google credentials');
    }

    try {
        const client = new JWT({
            email: GOOGLE_CLIENT_EMAIL,
            key: GOOGLE_PRIVATE_KEY,
            scopes: SCOPES,
        });
        
        await client.authorize();
        return client;
    } catch (error) {
        console.error('Auth error:', {
            message: error.message,
            stack: error.stack,
        });
        throw new Error('Authentication failed');
    }
};

const checkDuplicateRegistration = async (sheets, data) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: GOOGLE_SHEET_ID_WORKSHOP,
            range: 'Sheet1!B:G', // Only get email and phone columns
        });

        const rows = response.data.values || [];
        const emailColumn = 0; // Column B
        const phoneColumn = 5; // Column G

        const isDuplicate = rows.some(row => 
            row[emailColumn] === data.email || row[phoneColumn] === data.phone
        );

        if (!isDuplicate) return null;

        return rows.some(row => row[emailColumn] === data.email)
            ? 'You have already registered with this email'
            : 'This phone number is already registered';

    } catch (error) {
        throw new Error('Failed to check registration status');
    }
};

const appendRegistration = async (sheets, data) => {
    const rowData = [
        new Date().toISOString(),
        data.email,
        data.name,
        data.rollNo,
        data.course,
        "Shivaji College",
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
};

export async function POST(req) {
    try {
        if (!GOOGLE_SHEET_ID_WORKSHOP) {
            throw new Error('Missing Google Sheet ID');
        }

        const data = await req.json();
        const client = await getAuthToken();
        const sheets = google.sheets({ version: 'v4', auth: client });

        // Check for duplicates
        const duplicateMessage = await checkDuplicateRegistration(sheets, data);
        if (duplicateMessage) {
            return NextResponse.json({ error: duplicateMessage }, { status: 400 });
        }

        // Append new registration
        await appendRegistration(sheets, data);
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}