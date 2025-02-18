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
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
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

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      toast.success("Registration Successful!");
      reset();
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
    <main className="min-h-screen bg-gray-100 py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl mx-auto">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-2 px-4 sm:px-6">
            <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center">Techelons-25</CardTitle>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-center">Registration</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              {/* Event Selection */}
              <div className="space-y-1 sm:space-y-2">
                <Label className="text-sm sm:text-base">Event</Label>
                <Select onValueChange={(value) => setValue("event", value)}>
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
                  <Input type="email" placeholder="Email" {...register("email")} className="w-full" />
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label className="text-sm sm:text-base">Phone Number</Label>
                  <Input type="tel" placeholder="Phone Number" {...register("phone")} className="w-full" />
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
                  <Select onValueChange={(value) => setValue("college", value)}>
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
                        onClick={() => setTeamSize(Math.min(requiredTeamSize.max - 1, teamSize + 1))}
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