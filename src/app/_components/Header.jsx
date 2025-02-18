'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Workshop', href: '/#workshop' },
    { name: 'Past Event', href: '/#pastevent' },
    { name: 'Council', href: '/#council' },
    { name: 'Techelons - 25', href: '/techelons' },
];

const Header = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleExit = () => {
        window.open("/registrationclosed", "_self");
        // window.open("/workshopregistration", "_blank");
        // window.open("/techelonsregistration", "_blank");
    };

    return (
        <>
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="bg-white w-full"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
                    <nav className="flex items-center justify-between">
                        <Link href="/" className="flex-shrink-0 z-10">
                            <Image
                                alt="logo"
                                src="/assets/Header_logo.png"
                                width={250}
                                height={65}
                                className="h-8 sm:h-6 lg:h-8 w-auto"
                                priority
                            />
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                            className="hidden md:flex md:items-center md:gap-4 lg:gap-6 xl:gap-8"
                        >
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm lg:text-base font-semibold text-gray-900 hover:text-gray-600 transition duration-200 hover:underline"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
                            className="hidden md:block"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                className="bg-gray-900 text-white py-2 px-4 text-sm lg:text-base font-bold rounded-full shadow-md hover:bg-gray-800 transition duration-200"
                                onClick={handleExit}
                            >
                                Register Now
                            </motion.button>
                        </motion.div>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition duration-200"
                            aria-label="Open menu"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </nav>
                </div>
            </motion.header>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="fixed inset-0 z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="fixed inset-0 bg-gray-900 bg-opacity-50"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                            className="fixed inset-y-0 right-0 w-64 sm:w-72 bg-white px-6 py-6 shadow-lg z-50"
                        >
                            <div className="flex items-center justify-between">
                                <Link href="/" className="flex-shrink-0">
                                    <Image
                                        alt="logo"
                                        src="/assets/Header_logo.png"
                                        width={250}
                                        height={65}
                                        className="h-9 w-auto"
                                    />
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition duration-200"
                                    aria-label="Close menu"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="block text-lg font-semibold text-gray-900 hover:underline text-gray-600 transition duration-200"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-gray-300 my-4" />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-full shadow-md"
                                    onClick={handleExit}
                                >
                                    Register Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </Dialog>
                )}
            </AnimatePresence>

            <main>{children}</main>
        </>
    );
};

export default Header;
