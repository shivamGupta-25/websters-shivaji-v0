import { z } from "zod";

// Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

// Events data
export const EVENTS = [
    { id: "Seminar", name: "AI and Cyber Security (Seminar)", teamSize: { min: 1, max: 1 } },
    { id: "debug-code", name: "Debug the Code", teamSize: { min: 1, max: 1 } },
    { id: "ai-artistry", name: "AI Artistry", teamSize: { min: 2, max: 2 } },
    { id: "gaming", name: "E-Lafda (Tekken)", teamSize: { min: 1, max: 4 } },
    { id: "data-diviation", name: "Data Diviation", teamSize: { min: 1, max: 1 } },
    { id: "poster-making", name: "Digital Poster Making", teamSize: { min: 1, max: 1 } },
    { id: "reel-comp", name: "Tech Reel War", teamSize: { min: 1, max: 1 } }
];

// Reusable schemas
const fileSchema = z.any()
    .refine((file) => file && file?.length > 0, "College ID is required")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
        "Only .jpg, .jpeg, .png and .pdf files are accepted"
    );

const nameSchema = z.string().min(2, "Name is required").max(50);
const emailSchema = z.string().email("Invalid email address");
const phoneSchema = z.string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number");
const rollNoSchema = z.string().min(2, "Roll No. is required").max(20);
const collegeSelectSchema = z.enum(["Shivaji College", "Other"]);
const otherCollegeSchema = z.string()
    .min(2, "College name is required")
    .max(100)
    .optional()
    .nullable();

// Person schema (common fields between main registrant and team members)
const personSchema = z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    rollNo: rollNoSchema,
    college: collegeSelectSchema,
    otherCollege: otherCollegeSchema,
    collegeId: fileSchema
});

// Team member schema (reusing person schema)
export const teamMemberSchema = personSchema;

// Main form schema
export const baseFormSchema = personSchema.extend({
    event: z.string().min(1, "Event selection is required"),
    course: z.string().min(2, "Course is required").max(50),
    year: z.enum(["1st Year", "2nd Year", "3rd Year"]),
    query: z.string().max(500).optional().nullable(),
    teamMembers: z.array(teamMemberSchema).optional()
});

// Helper function to get team size requirements for a specific event
export const getTeamSizeRequirements = (eventId) => {
    const event = EVENTS.find(e => e.id === eventId);
    return event ? event.teamSize : { min: 1, max: 1 };
};

// Dynamic schema generator based on selected event
export const getEventSpecificSchema = (eventId) => {
    const { min, max } = getTeamSizeRequirements(eventId);
    
    if (min <= 1 && max <= 1) {
        // Single participant events don't need team members
        return baseFormSchema.omit({ teamMembers: true });
    }
    
    // Team events require validation of team size
    return baseFormSchema.extend({
        teamMembers: z.array(teamMemberSchema)
            .min(min - 1, `This event requires at least ${min} participants (including you)`)
            .max(max - 1, `This event allows maximum ${max} participants (including you)`)
    });
};