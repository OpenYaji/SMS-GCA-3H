import React from 'react';
import { motion } from 'framer-motion';
import TeamImage from '../../../assets/img/team.png';
import GlareHover from '../../ui/GlareHover';
import CircularGallery from '../../ui/CircularGallery';

const About = () => {

    const leftVariant = {
        hidden: { opacity: 0, y: 30 }, 
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const rightVariant = {
        hidden: { opacity: 0, y: 30 }, 
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } } // Added a delay
    };

    const bottomVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } }
    };

    return (
        <div className="bg-white dark:bg-gray-900 py-20 pt-24 min-h-screen transition-colors duration-300 overflow-hidden">
            <div className="container mx-auto px-[30px]">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    
                    <motion.div 
                        className="w-full md:w-1/2 rounded-[20px] md:rounded-[50px] overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-gray-800/50 max-h-[300px] md:max-h-none"
                        variants={leftVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                    >
                        <GlareHover
                            glareColor="#ffffff"
                            glareOpacity={0.3}
                            glareAngle={-30}
                            glareSize={300}
                            transitionDuration={800}
                            playOnce={false}
                        >
                            <img
                                src={TeamImage}
                                alt="Students and Teacher working together"
                                className="w-full h-full object-cover dark:opacity-90"
                            />
                        </GlareHover>
                    </motion.div>

                    <motion.div 
                        className="w-full md:w-1/2"
                        variants={rightVariant}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.2 }}
                    >
                        <h4 className="text-xl font-semibold text-[#3a2c1c] dark:text-amber-400 uppercase tracking-widest mb-10 transition-colors duration-300">
                            ABOUT US
                        </h4>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 text-[#3C2F2F] dark:text-gray-100 transition-colors duration-300">
                            Why You Should Choose <span className="text-[#F7C236] dark:text-amber-400">Gymnazo</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 transition-colors duration-300">
                            The Gymnazo Christian Academy is committed in the formation of values and
                            education among their learners by following these philosophical foundations.
                        </p>
                        <a href="#about-us-details" className="text-[#F7C236] dark:text-amber-400 font-medium hover:text-yellow-600 dark:hover:text-amber-300 transition duration-150">
                            Read More
                        </a>
                    </motion.div>
                </div>
            </div>

            <motion.div 
                style={{ height: '600px', position: 'relative'}}
                variants={bottomVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
            >
                <CircularGallery bend={0} textColor="#FFCA28" borderRadius={0.05} scrollEase={0.02} />
            </motion.div>
        </div>
    );
}

export default About;