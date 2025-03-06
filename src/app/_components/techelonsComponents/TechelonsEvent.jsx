"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Calendar, MapPin, Clock, DollarSign, Info, ClipboardCheck, Trophy } from 'lucide-react'

// Animation variants
const animations = {
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 0.61, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        }
    },
    cardAnimation: (index) => ({
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: {
            duration: 0.5,
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
        },
        whileHover: {
            y: -5,
            transition: { duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }
        }
    })
}

// EventCard component
const EventCard = ({ event, index, openEventDetails }) => {
    return (
        <motion.div
            {...animations.cardAnimation(index)}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
            <div className="relative overflow-hidden bg-gray-200">
                <img
                    src={event.img || "/placeholder.svg"}
                    alt={event.title}
                    className="object-contain transition-transform duration-300 hover:scale-105"
                    loading={index < 3 ? "eager" : "lazy"}
                />
            </div>
            <div className="p-4 sm:p-5">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{event.desc}</p>
                <EventInfo event={event} />
                <button
                    className="mt-4 w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm sm:text-base"
                    onClick={() => openEventDetails(event)}
                >
                    View Details
                </button>
            </div>
        </motion.div>
    )
}

// Event info component (reused in card and dialog)
const EventInfo = ({ event, className = "" }) => {
    return (
        <div className={`space-y-1.5 text-xs sm:text-sm text-gray-500 ${className}`}>
            <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {event.date}
            </div>
            <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {event.venue}
            </div>
            <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {event.time}
            </div>
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="bi bi-currency-rupee h-4 w-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 16 16" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.05} d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
                </svg>
                {event.price}
            </div>
        </div>
    )
}

// Prize display component
const PrizeDisplay = ({ prizes }) => {
    return (
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-100">
            {prizes.split('|').map((prize, idx) => {
                const [rank, amount] = prize.trim().split(':');
                return (
                    <div key={idx} className={`flex items-center justify-between p-1.5 sm:p-2 ${idx > 0 ? 'border-t border-yellow-100 mt-2 pt-2' : ''}`}>
                        <div className="flex items-center">
                            {idx === 0 && (
                                <span className="mr-2 text-yellow-500">
                                    <Trophy className="h-5 w-5 sm:h-6 sm:w-6" />
                                </span>
                            )}
                            <span className="font-medium text-xs sm:text-sm text-gray-800">{rank}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-900 font-bold">{amount}</span>
                    </div>
                );
            })}
        </div>
    )
}

// Event details dialog content
const EventDetails = ({ event, handleRegister, handleShare, isOpen }) => {
    return (
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto p-0 w-[95vw] mx-auto">
            <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
                <DialogTitle className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {event.title}
                </DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-500 text-xs sm:text-sm">Registration open</span>
                </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full px-4 sm:px-6 pb-4 sm:pb-6">
                <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="rules">Rules</TabsTrigger>
                    <TabsTrigger value="prizes">Prizes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-3 sm:space-y-4">
                    <Card>
                        <CardContent className="p-3 sm:p-4 space-y-2">
                            <h4 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900">About This Event</h4>
                            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{event.desc}</p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <Card>
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-sm sm:text-base text-gray-900">Date & Time</h5>
                                        <p className="text-xs sm:text-sm text-gray-700 mt-1">{event.date}</p>
                                        <p className="text-xs sm:text-sm text-gray-700">{event.time}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-3 sm:p-4">
                                <div className="flex items-start space-x-3">
                                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                                        <MapPin className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-sm sm:text-base text-gray-900">Venue & Price</h5>
                                        <p className="text-xs sm:text-sm text-gray-700 mt-1">{event.venue}</p>
                                        <p className="text-xs sm:text-sm text-green-700 font-semibold">₹ {event.price}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="rules">
                    <Card>
                        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                                <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mr-2">
                                    <ClipboardCheck className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
                                </div>
                                Event Rules
                            </h4>
                            <ul className="space-y-2 sm:space-y-3 pl-1">
                                {event.rules.map((rule, idx) => (
                                    <li key={idx} className="flex items-start group transition-all p-1.5 sm:p-2 hover:bg-purple-50 rounded-lg">
                                        <span className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-100 group-hover:bg-indigo-200 text-indigo-800 text-xs mr-2 sm:mr-3 mt-0.5 flex-shrink-0 transition-colors">
                                            {idx + 1}
                                        </span>
                                        <span className="text-xs sm:text-sm text-gray-700">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="prizes">
                    <Card>
                        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                                <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-lg mr-2">
                                    <Trophy className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600" />
                                </div>
                                Prizes
                            </h4>
                            <PrizeDisplay prizes={event.prizes} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-blue-800">
                    <div className="flex items-start">
                        <Info className="h-4 sm:h-5 w-4 sm:w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p>Registration closes on March 1, 2025. Limited spots available. You'll receive a confirmation email after registration.</p>
                    </div>
                </div>

                <div className="flex gap-3 sm:gap-4">
                    <button
                        className="flex-1 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
                        onClick={handleRegister}
                    >
                        <div className="flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            Register
                        </div>
                    </button>

                    <button
                        className="p-2 sm:p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                        onClick={handleShare}
                        aria-label="Share event"
                    >
                        <Share2 className="h-4 sm:h-5 w-4 sm:w-5" />
                    </button>
                </div>
            </div>
        </DialogContent>
    )
}

const TechelonsEvents = () => {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Events data
    const events = [
        {
            title: "Dark Coding",
            desc: "Test your code optimization skills with our algorithmic challenges under a strict time limit. Participants will navigate through increasingly complex problems that require elegant and efficient solutions.",
            img: "/assets/Poster.png",
            date: "March 15, 2025",
            venue: "Hall A",
            time: "10:00 AM - 12:00 PM",
            category: "coding",
            price: "300",
            rules: [
                "Individual participation only",
                "Participants must bring their own laptops",
                "Internet access will be restricted",
                "3 rounds of increasing difficulty",
                "Winners will be judged on time and code efficiency"
            ],
            prizes: "1st: ₹10,000 | 2nd: ₹5,000 | 3rd: ₹2,000"
        },
        {
            title: "Googler",
            desc: "Showcase your research prowess and information retrieval skills in this fast-paced challenge. Contestants will race to find specific information online, testing both search efficiency and evaluation abilities.",
            img: "/assets/Poster.png",
            date: "March 15, 2025",
            venue: "Lab 1",
            time: "1:00 PM - 3:00 PM",
            category: "search",
            price: "250",
            rules: [
                "Teams of 2 members",
                "Own devices allowed",
                "Only Google search engine permitted",
                "Time-based scoring system",
                "Judges' decision is final"
            ],
            prizes: "1st: ₹8,000 | 2nd: ₹4,000 | 3rd: ₹1,500"
        },
        {
            title: "Web Hive",
            desc: "Unleash your creativity and technical skills in this premier web design competition. Teams will conceptualize and build responsive, accessible websites based on a theme revealed at the event.",
            img: "/assets/Poster.png",
            date: "March 16, 2025",
            venue: "Hall B",
            time: "11:00 AM - 1:00 PM",
            category: "design",
            price: "400",
            rules: [
                "Teams of 2-3 members",
                "Own devices and software required",
                "Theme will be announced at the start",
                "8 hours to complete the website",
                "Judging based on creativity, responsiveness, and functionality"
            ],
            prizes: "1st: ₹15,000 | 2nd: ₹7,500 | 3rd: ₹3,000"
        },
        {
            title: "Whatzapper",
            desc: "Put your rapid communication skills to the test in this texting championship. Compete in speed typing challenges, emoji puzzles, and creative messaging scenarios that mirror real-world digital communication.",
            img: "/assets/Poster.png",
            date: "March 16, 2025",
            venue: "Lab 2",
            time: "2:00 PM - 4:00 PM",
            category: "communication",
            price: "200",
            rules: [
                "Individual participation",
                "Smartphones will be provided",
                "Multiple rounds with elimination",
                "Accuracy and speed both count",
                "No external devices allowed"
            ],
            prizes: "1st: ₹5,000 | 2nd: ₹2,500 | 3rd: ₹1,000"
        },
        {
            title: "AI Artistry",
            desc: "Blend creativity with technology in this cutting-edge AI art competition. Participants will use various AI tools to generate original artwork based on conceptual prompts, demonstrating both technical knowledge and artistic vision.",
            img: "/assets/Poster.png",
            date: "March 17, 2025",
            venue: "Hall C",
            time: "12:00 PM - 2:00 PM",
            category: "ai",
            price: "350",
            rules: [
                "Individual or pairs",
                "Bring your own devices",
                "Any AI art generation tool allowed",
                "Original prompts only",
                "Judging based on creativity, technical execution, and concept"
            ],
            prizes: "1st: ₹12,000 | 2nd: ₹6,000 | 3rd: ₹3,000"
        },
        {
            title: "E-Lafda",
            desc: "Experience the ultimate gaming showdown in this multi-title LAN tournament. Featuring popular competitive games across different genres, this event will test reflexes, strategy, and teamwork in an electrifying atmosphere.",
            img: "/assets/Poster.png",
            date: "March 17, 2025",
            venue: "Gaming Zone",
            time: "3:00 PM - 5:00 PM",
            category: "gaming",
            price: "500",
            rules: [
                "Teams of 4-5 members",
                "Games: CS:GO, Valorant, and FIFA",
                "Tournament style with eliminations",
                "Gaming peripherals allowed",
                "Anti-cheating measures will be enforced"
            ],
            prizes: "1st: ₹20,000 | 2nd: ₹10,000 | 3rd: ₹5,000"
        },
    ]

    // Enhanced sharing functionality
    const handleShare = () => {
        if (!selectedEvent) return;

        // Prepare rich sharing content
        const shareTitle = `Techelons 2025: ${selectedEvent.title}`;
        const shareText = `Join me at ${selectedEvent.title} on ${selectedEvent.date} at ${selectedEvent.venue}!\n\nEvent Details:\n• ${selectedEvent.desc}\n• Date: ${selectedEvent.date}\n• Time: ${selectedEvent.time}\n• Venue: ${selectedEvent.venue}\n• Prize: ₹${selectedEvent.price}`;
        const shareUrl = window.location.href;

        // Use Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback to clipboard copy with enhanced content
            const shareContent = `${shareTitle}\n\n${shareText}\n\nRegister now: ${shareUrl}`;
            navigator.clipboard.writeText(shareContent)
                .then(() => alert('Event details copied to clipboard! Share with your friends.'))
                .catch(err => console.error('Could not copy text: ', err));
        }
    };

    const handleRegister = () => {
        window.open("/techelonsregistration", "_blank")
    }

    const openEventDetails = (event) => {
        setSelectedEvent(event)
        setIsDialogOpen(true)
    }

    return (
        <section id="events" className="md:py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8 md:mb-12">
                    <motion.h2
                        {...animations.fadeInUp}
                        viewport={{ once: true }}
                        className="text-5xl sm:text-6xl md:text-6xl lg:text-8xl font-bold text-gray-900"
                    >
                        Events
                    </motion.h2>
                    <hr className="w-16 h-1 mx-auto my-6 md:my-8 bg-blue-500 border-0" />
                    <motion.p
                        {...animations.fadeInUp}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                        className="mt-3 md:mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4"
                    >
                        Showcase your skills and compete with the best minds across various technological domains.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {events.map((event, index) => (
                        <EventCard
                            key={`${event.title}-${index}`}
                            event={event}
                            index={index}
                            openEventDetails={openEventDetails}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Event Details Dialog */}
            {selectedEvent && (
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
                    <EventDetails
                        event={selectedEvent}
                        handleRegister={handleRegister}
                        handleShare={handleShare}
                        isOpen={isDialogOpen}
                    />
                </Dialog>
            )}
        </section>
    )
}

export default TechelonsEvents