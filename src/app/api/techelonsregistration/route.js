import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import { EVENTS } from '@/lib/validationSchema';

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file'
];

const SHEET_RANGE = 'Sheet1!A:Z';

// Create a singleton instance of GoogleClient
let googleClientInstance = null;

class GoogleClient {
    constructor() {
        this.auth = null;
        this.drive = null;
        this.sheets = null;
        this.initialized = false;
    }

    static getInstance() {
        if (!googleClientInstance) {
            googleClientInstance = new GoogleClient();
        }
        return googleClientInstance;
    }

    async initialize() {
        if (this.initialized) return;
        
        try {
            this.auth = new JWT({
                email: process.env.GOOGLE_CLIENT_EMAIL,
                key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                scopes: SCOPES,
            });

            await this.auth.authorize();
            this.drive = google.drive({ version: 'v3', auth: this.auth });
            this.sheets = google.sheets({ version: 'v4', auth: this.auth });

            await this.ensureSheetExists();
            this.initialized = true;
        } catch (error) {
            console.error('Initialization error:', error);
            throw new Error('Failed to initialize Google client');
        }
    }

    async ensureSheetExists() {
        try {
            await this.sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID_TECHELONS,
                range: 'Sheet1!A1'
            });
        } catch (error) {
            if (error.code === 404) {
                await this.sheets.spreadsheets.batchUpdate({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID_TECHELONS,
                    requestBody: {
                        requests: [{
                            addSheet: {
                                properties: {
                                    title: 'Sheet1'
                                }
                            }
                        }]
                    }
                });
                
                // Add headers
                await this.sheets.spreadsheets.values.update({
                    spreadsheetId: process.env.GOOGLE_SHEET_ID_TECHELONS,
                    range: 'Sheet1!A1',
                    valueInputOption: 'RAW',
                    requestBody: {
                        values: [[
                            'Timestamp',
                            'Email',
                            'Name',
                            'Roll No',
                            'Course',
                            'College',
                            'Phone',
                            'Event',
                            'Year',
                            'Query',
                            'College ID URL',
                            'Team Member 1 Name',
                            'Team Member 1 Email',
                            'Team Member 1 Phone',
                            'Team Member 1 Roll No',
                            'Team Member 1 College',
                            'Team Member 1 College ID URL',
                            'Team Member 2 Name',
                            'Team Member 2 Email',
                            'Team Member 2 Phone',
                            'Team Member 2 Roll No',
                            'Team Member 2 College',
                            'Team Member 2 College ID URL',
                            'Team Member 3 Name',
                            'Team Member 3 Email',
                            'Team Member 3 Phone',
                            'Team Member 3 Roll No',
                            'Team Member 3 College',
                            'Team Member 3 College ID URL'
                        ]]
                    }
                });
            } else {
                throw error;
            }
        }
    }

    bufferToStream(buffer) {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
    }

    generateFileName(file, prefix, userData) {
        const event = EVENTS.find(e => e.id === userData.event)?.name || 'Unknown Event';
        const college = userData.college === 'Other' ? userData.otherCollege : userData.college;
        const timestamp = new Date().toISOString().split('T')[0];
        const originalExt = file.name.split('.').pop();
        
        return `${event}_${prefix}_${userData.name}_${college}_${timestamp}.${originalExt}`
            .replace(/[^a-zA-Z0-9.-_]/g, '_');
    }

    async uploadToDrive(file, prefix, userData) {
        if (!file) return null;
        
        try {
            const fileArrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(fileArrayBuffer);
            
            const filename = this.generateFileName(file, prefix, userData);

            const driveResponse = await this.drive.files.create({
                requestBody: {
                    name: filename,
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
                },
                media: {
                    mimeType: file.type,
                    body: this.bufferToStream(buffer)
                },
                fields: 'id'
            });

            return `https://drive.google.com/file/d/${driveResponse.data.id}/view`;
        } catch (error) {
            console.error('File upload error:', error);
            throw new Error('Failed to upload file to Drive');
        }
    }

    async appendToSheet(rowData) {
        try {
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: process.env.GOOGLE_SHEET_ID_TECHELONS,
                range: SHEET_RANGE,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: { values: [rowData] },
            });
        } catch (error) {
            console.error('Sheet append error:', error);
            throw new Error('Failed to append data to sheet');
        }
    }

    async checkDuplicateRegistration(email, phone, event) {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID_TECHELONS,
                range: SHEET_RANGE,
            });

            const rows = response.data.values || [];
            
            // Skip the header row if it exists
            const dataRows = rows.length > 0 ? rows.slice(1) : [];
            
            // Check for duplicates using more efficient filtering
            return dataRows.some(row => {
                // Ensure row has enough elements
                if (row.length < 8) return false;
                
                const emailMatch = row[1] === email;
                const phoneMatch = row[6] === phone;
                const eventMatch = row[7] === event;
                return (emailMatch || phoneMatch) && eventMatch;
            });
        } catch (error) {
            console.error('Duplicate check error:', error);
            throw new Error('Failed to check for duplicate registration');
        }
    }
}

export async function POST(req) {
    const googleClient = GoogleClient.getInstance();

    try {
        await googleClient.initialize();
        const formData = await req.formData();

        const userData = {
            name: formData.get('name'),
            college: formData.get('college'),
            otherCollege: formData.get('otherCollege'),
            event: formData.get('event')
        };

        // Check for duplicate registration
        const isDuplicate = await googleClient.checkDuplicateRegistration(
            formData.get('email'),
            formData.get('phone'),
            formData.get('event')
        );

        if (isDuplicate) {
            return NextResponse.json(
                { error: 'You have already registered for this event' },
                { status: 400 }
            );
        }

        // Upload files and prepare team member data in parallel
        const uploadPromises = [];
        const teamMembers = [];
        
        // Main participant's college ID upload
        const mainCollegeIdPromise = googleClient.uploadToDrive(
            formData.get('collegeId'),
            'Main_Participant',
            userData
        );
        uploadPromises.push(mainCollegeIdPromise);
        
        // Process team members in parallel
        let memberIndex = 0;
        while (formData.get(`teamMember_${memberIndex}`)) {
            const memberData = JSON.parse(formData.get(`teamMember_${memberIndex}`));
            const memberFileKey = `teamMember_${memberIndex}_collegeId`;
            const memberFile = formData.get(memberFileKey);
            
            const memberUserData = {
                ...userData,
                name: memberData.name,
                college: memberData.college,
                otherCollege: memberData.otherCollege
            };

            const uploadPromise = googleClient.uploadToDrive(
                memberFile,
                `Team_Member_${memberIndex + 1}`,
                memberUserData
            ).then(url => {
                teamMembers[memberIndex] = {
                    ...memberData,
                    collegeIdUrl: url
                };
            });
            
            uploadPromises.push(uploadPromise);
            memberIndex++;
        }

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
        const mainCollegeIdUrl = await mainCollegeIdPromise;

        // Sort team members to ensure correct order
        teamMembers.sort((a, b) => {
            const indexA = parseInt(Object.keys(a).find(key => key.startsWith('teamMember_')).split('_')[1]);
            const indexB = parseInt(Object.keys(b).find(key => key.startsWith('teamMember_')).split('_')[1]);
            return indexA - indexB;
        });

        // Prepare row data
        const rowData = [
            new Date().toISOString(),
            formData.get('email'),
            formData.get('name'),
            formData.get('rollNo'),
            formData.get('course'),
            formData.get('college') === 'Other' ? formData.get('otherCollege') : formData.get('college'),
            formData.get('phone'),
            formData.get('event'),
            formData.get('year'),
            formData.get('query') || '',
            mainCollegeIdUrl,
            ...teamMembers.flatMap(member => [
                member.name,
                member.email,
                member.phone,
                member.rollNo,
                member.college === 'Other' ? member.otherCollege : member.college,
                member.collegeIdUrl
            ])
        ];

        await googleClient.appendToSheet(rowData);

        return NextResponse.json(
            { success: true, message: 'Registration successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: 500 }
        );
    }
}