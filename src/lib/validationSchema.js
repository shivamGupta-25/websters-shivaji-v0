import { z } from "zod";

export const EVENTS = [
    {
        id: "Seminar",
        name: "AI and Cyber Security (Seminar)",
        teamSize: { min: 1, max: 1 }
    },
    {
        id: "debug-code",
        name: "Debug the Code",
        teamSize: { min: 1, max: 1 }
    },
    {
        id: "ai-artistry",
        name: "AI Artistry",
        teamSize: { min: 2, max: 2 }
    },
    {
        id: "gaming",
        name: "E-Lafda (Tekken)",
        teamSize: { min: 1, max: 4 }
    },
    {
        id: "data-diviation",
        name: "Data Diviation",
        teamSize: { min: 1, max: 1 }
    },
    {
        id: "poster-making",
        name: "Digital Poster Making",
        teamSize: { min: 1, max: 1 }
    },
    {
        id: "reel-comp",
        name: "Tech Reel War",
        teamSize: { min: 1, max: 1 }
    },
];


export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fileSchema = z.any()
    .refine((file) => file && file?.length > 0, "College ID is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
        "Only .jpg, .jpeg, .png and .pdf files are accepted"
    );

export const teamMemberSchema = z.object({
    name: z.string().min(2, "Name is required").max(50),
    email: z.string().email("Invalid email address"),
    phone: z.string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    rollNo: z.string().min(2, "Roll No. is required").max(20),
    college: z.enum(["Shivaji College", "Other"]),
    otherCollege: z.string().min(2, "College name is required")
        .max(100)
        .optional()
        .nullable(),
    collegeId: fileSchema
});

export const baseFormSchema = z.object({
    event: z.string().min(1, "Event selection is required"),
    email: z.string().email("Invalid email address"),
    name: z.string().min(2, "Name is required").max(50),
    rollNo: z.string().min(2, "Roll No. is required").max(20),
    course: z.string().min(2, "Course is required").max(50),
    college: z.enum(["Shivaji College", "Other"]),
    otherCollege: z.string().min(2, "College name is required")
        .max(100)
        .optional()
        .nullable(),
    collegeId: fileSchema,
    year: z.enum(["1st Year", "2nd Year", "3rd Year"]),
    phone: z.string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    query: z.string().max(500).optional().nullable(),
    teamMembers: z.array(teamMemberSchema).optional()
});