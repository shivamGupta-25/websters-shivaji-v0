"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useRouter } from 'next/navigation';

// Email validation
const emailSchema = z.string()
    .email("Invalid email address")
    .regex(
        /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/,
        "Please use valid EMail ID"
    )
    .refine(
        (email) => {
            const localPart = email.split('@')[0].toLowerCase();
            const invalidPrefixes = ['test', 'example', 'sample', 'demo', 'user', 'admin', 'info', 'mail', 'email', 'no-reply', 'noreply', 'nobody', 'fake', 'xyz'];
            return !invalidPrefixes.some(prefix =>
                localPart === prefix ||
                localPart.startsWith(`${prefix}.`) ||
                localPart.startsWith(`${prefix}_`) ||
                localPart.startsWith(`${prefix}-`)
            );
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
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"),
    query: z.string().optional(),
});

export default function RegistrationPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: ""
        }
    });

    const handleRegistration = async (data) => {
        try {
            setIsSubmitting(true);
            const response = await fetch('/api/workshopregistration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    eventCategory: "Workshop",
                    college: "Shivaji College",
                    event: "Workshop"
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Registration failed');

            toast.success("Registration Successful!");
            reset();
            setValue("year", undefined);
            setTimeout(() => {
                router.push('/formsubmitted')
            }, 200);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">
                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                    <h1 className="text-3xl font-bold text-center mb-8">Event Registration</h1>

                    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">
                        <div className="relative">
                            <div className="flex item-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm font-bold text-gray-700 text-lg">
                                Workshop
                            </div>
                        </div>

                        {[
                            { name: "email", placeholder: "Email", type: "email" },
                            { name: "name", placeholder: "Full Name", type: "text" },
                            { name: "rollNo", placeholder: "Roll No.", type: "text" },
                            { name: "course", placeholder: "Course", type: "text" },
                        ].map(field => (
                            <div key={field.name}>
                                <Input
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    {...register(field.name)}
                                    className="block w-full"
                                />
                                {errors[field.name] && (
                                    <p className="mt-1 text-sm text-red-600">{errors[field.name].message}</p>
                                )}
                            </div>
                        ))}

                        <div className="relative">
                            <div className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700">
                                Shivaji College
                            </div>
                        </div>

                        <div>
                            <Select onValueChange={(value) => setValue("year", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["1st Year", "2nd Year", "3rd Year"].map(year => (
                                        <SelectItem key={year} value={year}>{year}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="tel"
                                placeholder="Phone Number"
                                {...register("phone")}
                                className="block w-full"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Textarea
                                placeholder="Your Query (Optional)"
                                {...register("query")}
                                className="block w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Register'}
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
}