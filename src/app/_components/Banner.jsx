'use client';

import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: 'easeOut' } }
};

const fadeInLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut' } }
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } }
};

const Banner = () => {
  const router = useRouter();
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const handleExit = useCallback(() => {
    router.push('/techelons');
  }, [router]);

  return (
    <section ref={ref} className="container h-fit px-8 mx-auto m-8">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center"
        variants={fadeInUpVariants}
        initial="hidden"
        animate={controls}
      >
        <motion.div
          className="flex flex-col items-center justify-center text-center w-full md:pl-10"
          variants={fadeInLeftVariants}
          initial="hidden"
          animate={controls}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold">Websters</h1>
          <h2 className="text-sm md:text-xl font-normal">
            The Computer Science Society of Shivaji College
          </h2>
          <h3 className="text-xl md:text-2xl">University of Delhi</h3>
          <p className="py-6 text-base md:text-lg max-w-2xl">
            Websters established in 1984, the Department of Computer Science is 
            dedicated to fostering academic excellence and intellectual growth. 
            It strives to enhance the cognitive aspect of education, ensuring a 
            strong foundation for its students.
          </p>
          <motion.div className="mt-4" variants={scaleInVariants} initial="hidden" animate={controls}>
            <Button 
              onClick={handleExit}
              className="p-6 rounded-[30px] shadow-lg hover:scale-105 transition-all text-lg font-bold tracking-wide"
            >
              Techelons - 25
            </Button>
          </motion.div>
        </motion.div>

        <motion.div className="flex items-center justify-center" variants={scaleInVariants} initial="hidden" animate={controls}>
          <Image
            alt="Websters Logo"
            src="/assets/webstersLogo.png"
            width={350}
            height={350}
            priority
            className="drop-shadow-[0px_8px_10px_rgba(0,0,0,0.9)]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Banner;
