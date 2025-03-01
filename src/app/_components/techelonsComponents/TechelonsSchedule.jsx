import React, { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, MapPinIcon, ClockIcon, CalendarIcon, FilterIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const EventSchedule = () => {
    const [filter, setFilter] = useState("all");

    // Memoize schedule data
    const scheduleData = useMemo(() => [
        {
            day: "Day 1",
            date: "February 10",
            value: "day1",
            events: [
                {
                    time: "09:00 AM",
                    title: "Opening Ceremony",
                    location: "Main Auditorium",
                    category: "Ceremony",
                    description: "Welcome address and event introduction",
                    featured: true
                },
                {
                    time: "11:00 AM",
                    title: "Hackathon Kickoff",
                    location: "CS Block",
                    category: "Competition",
                    description: "Theme announcement and team formation",
                    featured: false
                },
                {
                    time: "02:00 PM",
                    title: "AI Workshop",
                    location: "Lab 101",
                    category: "Workshop",
                    description: "Hands-on machine learning project with industry experts",
                    featured: true
                },
            ]
        },
        {
            day: "Day 2",
            date: "February 11",
            value: "day2",
            events: [
                {
                    time: "10:00 AM",
                    title: "Coding Competition",
                    location: "CS Block",
                    category: "Competition",
                    description: "Algorithmic problem-solving challenge with prizes",
                    featured: true
                },
                {
                    time: "01:00 PM",
                    title: "Tech Talks",
                    location: "Seminar Hall",
                    category: "Presentation",
                    description: "Industry experts share insights on emerging technologies",
                    featured: false
                },
                {
                    time: "05:00 PM",
                    title: "Award Ceremony",
                    location: "Main Auditorium",
                    category: "Ceremony",
                    description: "Recognition of winners and closing remarks",
                    featured: true
                },
            ]
        }
    ], []);

    // Get unique categories for filtering
    const categories = useMemo(() => {
        const allCategories = scheduleData.flatMap(day =>
            day.events.map(event => event.category)
        );
        return ["all", ...new Set(allCategories)];
    }, [scheduleData]);

    // Category styling
    const categoryStyles = useMemo(() => ({
        Ceremony: {
            color: "bg-purple-500 text-white hover:bg-purple-600",
            icon: "🏆"
        },
        Competition: {
            color: "bg-blue-500 text-white hover:bg-blue-600",
            icon: "🚀"
        },
        Workshop: {
            color: "bg-emerald-500 text-white hover:bg-emerald-600",
            icon: "🔧"
        },
        Presentation: {
            color: "bg-amber-500 text-white hover:bg-amber-600",
            icon: "🎤"
        },
        default: {
            color: "bg-gray-500 text-white hover:bg-gray-600",
            icon: "📅"
        }
    }), []);

    const getCategoryStyle = (category) =>
        categoryStyles[category] || categoryStyles.default;

    // Handle registration
    const handleRegister = () => {
        window.open("/registrationclosed", "_self");
    };

    // Event card component with motion effects
    const EventCard = ({ event, index }) => {
        const { color, icon } = getCategoryStyle(event.category);

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
            >
                <Card
                    className={`p-3 sm:p-4 md:p-5 border ${event.featured
                            ? 'border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-900'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                        } hover:shadow-lg transition-all duration-200 rounded-xl`}
                >
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {/* Mobile view: Time and Category at top */}
                        <div className="flex items-center justify-between sm:hidden">
                            <div className="flex items-center gap-1">
                                <ClockIcon className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {event.time}
                                </span>
                            </div>
                            <Badge className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${color}`}>
                                {icon} {event.category}
                            </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                            {/* Desktop view: Time and location sidebar */}
                            <div className="hidden sm:flex sm:w-24 md:w-28 flex-shrink-0 flex-col gap-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                        <ClockIcon className="h-2.5 w-2.5 md:h-3 md:w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {event.time}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                        <MapPinIcon className="h-2.5 w-2.5 md:h-3 md:w-3 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                                        {event.location}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                        {event.title}
                                    </h3>
                                    {/* Desktop view: Category badge */}
                                    <Badge className={`ml-2 hidden sm:inline-flex text-xs font-medium px-1.5 py-0.5 rounded-full ${color}`}>
                                        {icon} {event.category}
                                    </Badge>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                    {event.description}
                                </p>

                                {/* Mobile view: Location at bottom */}
                                <div className="flex items-center gap-1 mt-1.5 sm:hidden">
                                    <MapPinIcon className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                        {event.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        );
    };

    // Filter events based on category
    const getFilteredEvents = (day) => {
        if (filter === "all") return day.events;
        return day.events.filter(event => event.category === filter);
    };

    return (
        <section className="py-6 sm:py-8 md:py-12 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <div className="container mx-auto px-3 sm:px-6 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
                {/* Header Section */}
                <div className="text-center mb-6 sm:mb-8 md:mb-10">
                    <div className="flex justify-center">
                        <div className="flex items-center mb-2 px-3 py-2 sm:px-4 sm:py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 rounded-full text-sm md:text-md font-semibold">
                            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                            February 10-11, 2025
                        </div>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white">
                        Event Schedule
                    </h2>
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xs sm:max-w-sm md:max-w-md mx-auto">
                        Plan your visit with our comprehensive event schedule
                    </p>
                </div>

                {/* Tabs Component */}
                <Tabs defaultValue="day1" className="w-full">
                    {/* Tab Navigation and Filters */}
                    <div className="flex flex-col items-center space-y-3 sm:space-y-4 mb-4 sm:mb-6 md:mb-8">
                        {/* Day Tabs */}
                        <div className="w-full flex justify-center">
                            <TabsList className="flex w-full max-w-xs sm:max-w-sm md:max-w-md py-6 md:py-8 px-0.5 md:px-1.5 text-slate-700 dark:text-slate-300 font-medium justify-center bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-full shadow-md overflow-hidden">
                                {scheduleData.map((day) => (
                                    <TabsTrigger
                                        key={day.value}
                                        value={day.value}
                                        className="flex-1 py-2 sm:py-3 md:py-1 px-1 sm:px-2 md:px-4 text-xs sm:text-sm md:text-base font-medium rounded-full transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-900 data-[state=active]:to-slate-700 data-[state=active]:text-white dark:data-[state=active]:from-slate-200 dark:data-[state=active]:to-white dark:data-[state=active]:text-slate-900"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="font-semibold text-xl">{day.day}</span>
                                            <span className="text-xs opacity-70 mt-0.5 hidden sm:block">{day.date}</span>
                                        </div>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-lg px-2 mt-2 sm:mt-4">
                            <div className="flex items-center gap-1 mb-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                                <FilterIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Filter by category
                            </div>
                            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 w-full">
                                {categories.map((category) => {
                                    const { color, icon } = category !== "all"
                                        ? getCategoryStyle(category)
                                        : { color: "", icon: "" };

                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setFilter(category)}
                                            className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full transition-all ${filter === category
                                                    ? (category === "all"
                                                        ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                                                        : color)
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                                }`}
                                        >
                                            {category === "all" ? "All Events" : `${icon} ${category}`}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Tab Contents */}
                    {scheduleData.map((day) => {
                        const filteredEvents = getFilteredEvents(day);
                        return (
                            <TabsContent
                                key={day.value}
                                value={day.value}
                                className="focus-visible:outline-none focus-visible:ring-0"
                            >
                                {filteredEvents.length === 0 ? (
                                    <div className="text-center py-6 sm:py-8 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
                                        No events found for this category on {day.day}.
                                    </div>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3 md:space-y-4">
                                        {filteredEvents.map((event, idx) => (
                                            <EventCard
                                                key={`${day.value}-event-${idx}`}
                                                event={event}
                                                index={idx}
                                            />
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        );
                    })}
                </Tabs>

                {/* Registration Section */}
                <div className="mt-8 sm:mt-10 md:mt-12 text-center">
                    <Button
                        onClick={handleRegister}
                        className="group w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 text-base sm:text-lg md:text-xl font-bold shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Register Now
                        <ArrowRightIcon className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-sm sm:text-base md:text-lg text-slate-500 dark:text-slate-400 mt-3 sm:mt-4 md:mt-6">
                        Limited spots available — Register today!
                    </p>
                </div>
            </div>
        </section>
    );
};

export default EventSchedule;