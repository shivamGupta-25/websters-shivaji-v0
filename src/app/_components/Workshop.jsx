'use client';

import { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";

// Workshop details data
const workshopDetails = [
  { label: '📅 Date:', value: '29th & 30th January, 2025', id: 'date' },
  { label: '🕒 Time:', value: '10 AM - 2 PM', id: 'time' },
  { label: '🏛️ Venue:', value: 'Jijabai Computer Lab', id: 'venue' },
  {
    label: '📖 Description:',
    value: 'From Idea to Interfaces: A UI/UX Foundation Workshop is a 2-day event organized by the Websters - Computer Science Society of Shivaji College. The workshop will cover the basics of UI/UX design, including principles of user interfaces, user experience, wireframing, prototyping, and best design practices with an hands-on project. It\'s an exciting opportunity for beginners and design enthusiasts to learn essential skills for creating user-friendly digital experiences.',
    id: 'description'
  }
];

// Optimized DetailItem component
const DetailItem = memo(({ label, value }) => (
  <p className="text-sm sm:text-base lg:text-lg">
    <strong className="text-gray-900 dark:text-white">{label}</strong>{' '}
    <span className="text-gray-700 dark:text-gray-300">{value}</span>
  </p>
));

DetailItem.displayName = 'DetailItem';

const Workshop = () => {
  const router = useRouter();

  return (
    <section
      id="workshop"
      className="container mx-auto mb-8 px-4 sm:px-6 lg:px-8 mt-8 flex flex-col items-center justify-center"
    >
      <motion.h1
        className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Workshop
      </motion.h1>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
        <div className="relative w-full aspect-video">
          <Image
            src="/assets/Events/UI-UX_Workshop.png"
            alt="Workshop Banner"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>

        <div className="p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              From Idea to Interfaces : A UI/UX foundation workshop
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Join us for an exciting 2-day workshop on UI/UX Design, organized by the Websters - Computer Science Society of Shivaji College!
            </p>
          </div>

          <div className="space-y-3 border-l-4 border-blue-500 pl-4">
            {workshopDetails.map((detail) => (
              <DetailItem
                key={detail.id}
                label={detail.label}
                value={detail.value}
              />
            ))}
          </div>

          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <Button
              onClick={() => router.push("/registrationclosed")}
              // onClick={() => window.open("/workshopregistration", "_blank")}
              className="px-6 py-3 sm:px-9 sm:py-6 text-sm sm:text-base rounded-full font-bold shadow-lg tracking-wide"
            >
              Register Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Workshop);