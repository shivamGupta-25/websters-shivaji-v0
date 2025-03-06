"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Email validation schema
const emailSchema = z.string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/,
        "Please use valid EMail ID"
    )
    .refine(
        (email) => {
            const localPart = email.split('@')[0].toLowerCase();
            const invalidPrefixes = new Set([
                'test', 'example', 'sample', 'demo', 'user', 
                'admin', 'info', 'mail', 'email', 'no-reply', 
                'noreply', 'nobody', 'fake', 'xyz'
            ]);
            
            return !invalidPrefixes.has(localPart) && 
                   !localPart.startsWith('test.') && 
                   !localPart.startsWith('test_') && 
                   !localPart.startsWith('test-') &&
                   !localPart.startsWith('example.') && 
                   !localPart.startsWith('example_') && 
                   !localPart.startsWith('example-');
        },
        "Please use your official institutional email address"
    );

const formSchema = z.object({
    email: emailSchema,
    name: z.string().min(2, "Name is required"),
    rollNo: z.string().min(2, "Roll No. is required"),
    course: z.string().min(2, "Course is required"),
    year: z.enum(["1st Year", "2nd Year", "3rd Year"], {
        required_error: "Please select your year",
    }),
    phone: z.string()
        .min(1, "Phone number is required")
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    query: z.string().optional(),
});

// Form field configuration
const formFields = [
    { name: "email", placeholder: "Email", type: "email" },
    { name: "name", placeholder: "Full Name", type: "text" },
    { name: "rollNo", placeholder: "Roll No.", type: "text" },
    { name: "course", placeholder: "Course", type: "text" },
];

// Error messages
const ERROR_MESSAGES = {
    CONNECTION_ERROR: "Connection error. Please check your internet connection and try again.",
    SERVER_ERROR: "Server error. Our team has been notified. Please try again later.",
    DUPLICATE_EMAIL: "You have already registered with this email address.",
    DUPLICATE_PHONE: "This phone number is already registered.",
    DEFAULT: "Registration failed. Please try again or contact support."
};

// Toast configuration
const TOAST_OPTIONS = {
    duration: 3000,
    success: {
        style: { background: '#10B981', color: 'white' },
    },
    error: {
        duration: 4000,
        style: { background: '#EF4444', color: 'white' },
    },
    loading: {
        duration: Infinity,
        style: { background: '#3B82F6', color: 'white' },
    }
};

export default function RegistrationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toastId, setToastId] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [networkStatus, setNetworkStatus] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isValid, isDirty }
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { query: "" },
        mode: "onChange"
    });

    // Update network status
    useEffect(() => {
        setNetworkStatus(navigator.onLine);
        
        const handleOnline = () => setNetworkStatus(true);
        const handleOffline = () => setNetworkStatus(false);
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Clean up toast on unmount
    useEffect(() => {
        return () => {
            if (toastId) toast.dismiss(toastId);
        };
    }, [toastId]);

    // Handle form submission
    const handleRegistration = useCallback(async (data) => {
        if (isSubmitting || !networkStatus) {
            if (!networkStatus) toast.error(ERROR_MESSAGES.CONNECTION_ERROR);
            return;
        }
        
        setServerError(null);
        setIsSubmitting(true);
        
        // Show loading toast
        const id = toast.loading("Submitting your registration...");
        setToastId(id);
        
        try {
            // Use AbortController for timeout control
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            try {
                const response = await fetch('/api/workshopregistration', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        college: "Shivaji College",
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const result = await response.json();
                
                if (!response.ok) {
                    let errorMessage = result.error || ERROR_MESSAGES.DEFAULT;
                    
                    if (errorMessage.includes("already registered with this email")) {
                        errorMessage = ERROR_MESSAGES.DUPLICATE_EMAIL;
                    } else if (errorMessage.includes("phone number is already registered")) {
                        errorMessage = ERROR_MESSAGES.DUPLICATE_PHONE;
                    } else if (response.status >= 500) {
                        errorMessage = ERROR_MESSAGES.SERVER_ERROR;
                    }
                    
                    setServerError(errorMessage);
                    toast.error(errorMessage, { id });
                    return;
                }

                // Handle success
                toast.success("Registration successful! Redirecting...", { id });
                reset();
                
                setTimeout(() => router.push('/formsubmitted'), 100);
            } catch (fetchError) {
                clearTimeout(timeoutId);
                const errorMessage = fetchError.name === 'AbortError' 
                    ? "Request timed out. Server might be busy, please try again." 
                    : ERROR_MESSAGES.CONNECTION_ERROR;
                
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessage = error.message || ERROR_MESSAGES.DEFAULT;
            setServerError(errorMessage);
            
            if (toastId) {
                toast.error(errorMessage, { id: toastId });
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [isSubmitting, networkStatus, reset, router, toastId]);

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" toastOptions={TOAST_OPTIONS} />
            
            <div className="max-w-lg mx-auto">
                {!networkStatus && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>
                            You appear to be offline. Please check your internet connection and try again.
                        </AlertDescription>
                    </Alert>
                )}
                
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-center mb-8">Event Registration</h1>
                    
                    {serverError && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">
                        <div className="flex item-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm font-bold text-gray-700 text-lg">
                            Workshop
                        </div>

                        {formFields.map(field => (
                            <div key={field.name}>
                                <Input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name)}
                                    className={`block w-full ${errors[field.name] ? 'border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                    aria-invalid={errors[field.name] ? "true" : "false"}
                                />
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600" role="alert">{errors[field.name].message}</p>
                                )}
                            </div>
                        ))}

                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700">
                            Shivaji College
                        </div>

                        <div>
                            <Select 
                                onValueChange={(value) => setValue("year", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className={errors.year ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["1st Year", "2nd Year", "3rd Year"].map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600" role="alert">{errors.year.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                {...register("phone")}
                                className={`block w-full ${errors.phone ? 'border-red-500' : ''}`}
                                disabled={isSubmitting}
                                aria-invalid={errors.phone ? "true" : "false"}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Textarea
                                placeholder="Your Query (Optional)"
                                {...register("query")}
                                className="block w-full"
                                disabled={isSubmitting}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || (!isDirty && !isValid) || !networkStatus}
                        >
                            {isSubmitting ? 'Processing...' : 'Register'}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}