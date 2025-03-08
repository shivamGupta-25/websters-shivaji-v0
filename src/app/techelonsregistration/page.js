"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { EVENTS, baseFormSchema, teamMemberSchema } from "@/lib/validationSchema";

export default function RegistrationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [teamSize, setTeamSize] = useState(1);
  const [requiredTeamSize, setRequiredTeamSize] = useState({ min: 1, max: 1 });

  const getFormSchema = () => {
    const schema = { ...baseFormSchema };
    if (selectedEvent?.teamSize.max > 1) {
      schema.teamMembers = teamMemberSchema.array()
        .min(selectedEvent.teamSize.min - 1, `At least ${selectedEvent.teamSize.min - 1} team members are required`)
        .max(selectedEvent.teamSize.max - 1, `Maximum ${selectedEvent.teamSize.max - 1} team members allowed`);
    }
    return schema;
  };

  const { register, handleSubmit, setValue, watch, reset, formState: { errors }, unregister } = useForm({
    resolver: zodResolver(getFormSchema())
  });

  const selectedCollege = watch("college");
  const watchedEvent = watch("event");

  useEffect(() => {
    if (watchedEvent) {
      const event = EVENTS.find(e => e.id === watchedEvent);
      setSelectedEvent(event);
      setRequiredTeamSize(event.teamSize);
      setTeamSize(Math.max(1, event.teamSize.min - 1));

      // Event selection toast notification
      toast.success(
        `You've selected: ${event.name}`,
        { 
          icon: '🎯',
          duration: 3000,
          style: {
            borderLeft: '4px solid #10B981',
            padding: '16px'
          }
        }
      );

      // Team size requirements notification if applicable
      if (event.teamSize.max > 1) {
        setTimeout(() => {
          toast(
            `${event.name} requires ${event.teamSize.min}-${event.teamSize.max} team members.`,
            { 
              duration: 4000,
              icon: '👥',
              style: {
                borderLeft: '4px solid #3B82F6',
                padding: '16px'
              }
            }
          );
        }, 500); // Slight delay between toasts
      }
      
      // Show any specific event instructions if available
      if (event.instructions) {
        setTimeout(() => {
          toast.info(
            event.instructions,
            { 
              duration: 5000,
              icon: 'ℹ️',
              style: {
                borderLeft: '4px solid #60A5FA',
                padding: '16px'
              }
            }
          );
        }, 1000);
      }
    }
  }, [watchedEvent]);

  const handleRemoveMember = () => {
    const newSize = Math.max(requiredTeamSize.min - 1, teamSize - 1);
    setTeamSize(newSize);

    // Unregister the removed team member's fields
    const removedIndex = teamSize - 1;
    unregister(`teamMembers.${removedIndex}`);

    // Reset the form values for the remaining fields
    const currentValues = watch();
    const updatedTeamMembers = currentValues.teamMembers?.slice(0, newSize) || [];
    setValue('teamMembers', updatedTeamMembers);

    toast.success(`Team member removed. Total members: ${newSize}`, { 
      duration: 2000,
      icon: '👤'
    });
  };

  const handleAddMember = () => {
    const newSize = Math.min(requiredTeamSize.max - 1, teamSize + 1);
    setTeamSize(newSize);
    
    toast.success(`Team member added. Total members: ${newSize}`, { 
      duration: 2000,
      icon: '➕'
    });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Show loading toast
      const loadingToast = toast.loading(
        `Submitting your registration for ${selectedEvent?.name || 'Techelons-25'}...`
      );
      
      const formData = new FormData();

      // Append main form data
      Object.keys(data).forEach(key => {
        if (key === 'collegeId' && data[key]?.[0]) {
          formData.append('collegeId', data[key][0]);
        } else if (key === 'teamMembers' && data[key]) {
          data[key].slice(0, teamSize).forEach((member, index) => {
            formData.append(`teamMember_${index}`, JSON.stringify({
              name: member.name,
              email: member.email,
              phone: member.phone,
              rollNo: member.rollNo,
              college: member.college,
              otherCollege: member.otherCollege
            }));

            if (member.collegeId?.[0]) {
              formData.append(`teamMember_${index}_collegeId`, member.collegeId[0]);
            }
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      const response = await fetch('/api/techelonsregistration', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success(
        `Registration Successful! Welcome to ${selectedEvent?.name || 'Techelons-25'}`, 
        { 
          duration: 5000,
          icon: '🎉'
        }
      );
      
      // Show confirmation details
      reset();
      setTimeout(() => {
        router.push('/formsubmitted');
      }, 100);
    } catch (error) {
      // Show specific error message
      const errorMessage = error.message || 'Registration failed. Please try again.';
      
      toast.error(errorMessage, { 
        duration: 4000,
        icon: '❌'
      });
      
      // If the error is related to a specific field, highlight it
      if (errorMessage.toLowerCase().includes('email')) {
        toast('Check your email address and try again', { icon: '📧' });
      } else if (errorMessage.toLowerCase().includes('file') || errorMessage.toLowerCase().includes('id')) {
        toast('There may be an issue with your uploaded ID', { icon: '📁' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field validation feedback notifications
  const showFieldErrorToasts = () => {
    if (Object.keys(errors).length > 0) {
      // Get the first error for notification
      const firstErrorField = Object.keys(errors)[0];
      const firstErrorMessage = errors[firstErrorField]?.message || 'Please check form fields';
      
      toast.error(firstErrorMessage, {
        duration: 3000,
        icon: '⚠️'
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          // Custom styling for all toasts
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
          // Custom success styling
          success: {
            style: {
              background: '#10B981',
            },
          },
          // Custom error styling
          error: {
            style: {
              background: '#EF4444',
            },
          },
          // Custom info styling
          info: {
            style: {
              background: '#3B82F6',
            },
          },
        }}
      />
      <div className="w-full max-w-2xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2 px-4 sm:px-6">
            <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">Techelons-25</CardTitle>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Registration</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit, showFieldErrorToasts)} className="space-y-4 sm:space-y-6">
              {/* Event Selection */}
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-sm sm:text-base">Event</Label>
                <Select 
                  onValueChange={(value) => {
                    setValue("event", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Event" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENTS.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.event && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.event.message}</p>
                )}
              </div>

              {selectedEvent && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        You've selected: <span className="font-medium">{selectedEvent.name}</span>
                      </p>
                      {selectedEvent.description && (
                        <p className="mt-1 text-xs text-blue-600">{selectedEvent.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Full Name</Label>
                  <Input placeholder="Full Name" {...register("name")} className="w-full" />
                  {errors.name && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    {...register("email")} 
                    className="w-full" 
                    onBlur={(e) => {
                      if (e.target.value && !e.target.value.includes('@')) {
                        toast.error('Please enter a valid email address', { 
                          duration: 2000,
                          icon: '📧'
                        });
                      }
                    }}
                  />
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Phone Number</Label>
                  <Input 
                    type="tel" 
                    placeholder="Phone Number" 
                    {...register("phone")} 
                    className="w-full"
                    onBlur={(e) => {
                      if (e.target.value && (e.target.value.length < 10 || isNaN(e.target.value))) {
                        toast.error('Please enter a valid phone number', { 
                          duration: 2000,
                          icon: '📱'
                        });
                      }
                    }}
                  />
                  {errors.phone && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Roll Number</Label>
                  <Input placeholder="Roll Number" {...register("rollNo")} className="w-full" />
                  {errors.rollNo && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.rollNo.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Course</Label>
                  <Input placeholder="Course" {...register("course")} className="w-full" />
                  {errors.course && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.course.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Year</Label>
                  <Select onValueChange={(value) => setValue("year", value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.year.message}</p>
                  )}
                </div>
              </div>

              {/* College Information */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">College</Label>
                  <Select onValueChange={(value) => {
                    setValue("college", value);
                    if (value === "Shivaji College") {
                      toast('Shivaji College student!', {
                        icon: '🏫',
                        duration: 2000
                      });
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select College" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shivaji College">Shivaji College</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.college && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.college.message}</p>
                  )}
                </div>

                {selectedCollege === "Other" && (
                  <div className="space-y-1 sm:space-y-2">
                    <Label className="text-sm sm:text-base">College Name</Label>
                    <Input
                      placeholder="Enter College Name"
                      {...register("otherCollege")}
                      className="w-full"
                    />
                    {errors.otherCollege && (
                      <p className="text-xs sm:text-sm text-red-600">{errors.otherCollege.message}</p>
                    )}
                  </div>
                )}

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">College ID</Label>
                  <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    {...register("collegeId")}
                    className="w-full"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('File size should be less than 5MB', { 
                            duration: 3000,
                            icon: '📁'
                          });
                        } else {
                          toast.success('ID uploaded successfully', { 
                            duration: 2000,
                            icon: '✅'
                          });
                        }
                      }
                    }}
                  />
                  {errors.collegeId && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.collegeId.message}</p>
                  )}
                </div>
              </div>

              {/* Team Members Section */}
              {selectedEvent?.teamSize.max > 1 && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <Label className="text-base sm:text-lg font-medium mb-2 sm:mb-0">Team Members</Label>
                    <div className="space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto flex flex-col sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveMember}
                        disabled={teamSize <= requiredTeamSize.min - 1}
                        className="w-full sm:w-auto text-sm"
                      >
                        Remove Member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddMember}
                        disabled={teamSize >= requiredTeamSize.max - 1}
                        className="w-full sm:w-auto text-sm"
                      >
                        Add Member
                      </Button>
                    </div>
                  </div>

                  {Array.from({ length: teamSize }).map((_, index) => (
                    <Card key={index} className="p-2 sm:p-4">
                      <CardHeader className="px-2 sm:px-4 py-2 sm:py-3">
                        <CardTitle className="text-base sm:text-lg">Team Member {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-2 sm:px-4 py-2 space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">Name</Label>
                            <Input
                              placeholder="Name"
                              {...register(`teamMembers.${index}.name`)}
                              className="w-full"
                            />
                            {errors.teamMembers?.[index]?.name && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].name.message}</p>
                            )}
                          </div>
                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">Email</Label>
                            <Input
                              type="email"
                              placeholder="Email"
                              {...register(`teamMembers.${index}.email`)}
                              className="w-full"
                              onBlur={(e) => {
                                if (e.target.value && !e.target.value.includes('@')) {
                                  toast.error(`Team member ${index + 1}: Invalid email`, { 
                                    duration: 2000,
                                    icon: '📧'
                                  });
                                }
                              }}
                            />
                            {errors.teamMembers?.[index]?.email && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].email.message}</p>
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">Phone Number</Label>
                            <Input
                              type="tel"
                              placeholder="Phone Number"
                              {...register(`teamMembers.${index}.phone`)}
                              className="w-full"
                            />
                            {errors.teamMembers?.[index]?.phone && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].phone.message}</p>
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">Roll Number</Label>
                            <Input
                              placeholder="Roll Number"
                              {...register(`teamMembers.${index}.rollNo`)}
                              className="w-full"
                            />
                            {errors.teamMembers?.[index]?.rollNo && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].rollNo.message}</p>
                            )}
                          </div>

                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">College</Label>
                            <Select onValueChange={(value) => setValue(`teamMembers.${index}.college`, value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select College" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Shivaji College">Shivaji College</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {errors.teamMembers?.[index]?.college && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].college.message}</p>
                            )}
                          </div>

                          {watch(`teamMembers.${index}.college`) === "Other" && (
                            <div className="space-y-1 sm:space-y-2">
                              <Label className="text-sm sm:text-base">College Name</Label>
                              <Input
                                placeholder="Enter College Name"
                                {...register(`teamMembers.${index}.otherCollege`)}
                                className="w-full"
                              />
                              {errors.teamMembers?.[index]?.otherCollege && (
                                <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].otherCollege.message}</p>
                              )}
                            </div>
                          )}

                          <div className="space-y-1 sm:space-y-2">
                            <Label className="text-sm sm:text-base">College ID</Label>
                            <Input
                              type="file"
                              accept=".jpg,.jpeg,.png,.pdf"
                              {...register(`teamMembers.${index}.collegeId`)}
                              className="w-full"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  const file = e.target.files[0];
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error(`Team member ${index + 1}: File too large`, { 
                                      duration: 3000,
                                      icon: '📁'
                                    });
                                  }
                                }
                              }}
                            />
                            {errors.teamMembers?.[index]?.collegeId && (
                              <p className="text-xs sm:text-sm text-red-600">{errors.teamMembers[index].collegeId.message}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Query/Comments Section */}
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-sm sm:text-base">Any queries or comments?</Label>
                <Textarea
                  placeholder="Your queries or comments (optional)"
                  {...register("query")}
                  className="w-full min-h-24"
                />
                {errors.query && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.query.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-2 text-sm sm:text-base mt-4"
                disabled={isSubmitting}
                onClick={() => {
                  if (!watchedEvent) {
                    toast.error('Please select an event', { 
                      duration: 3000,
                      icon: '🎯'
                    });
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}