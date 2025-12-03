import React from 'react';
import { motion } from 'framer-motion';
import Girl from '../../../assets/img/finalmodel.png';
import Logo from '../../../assets/img/gymnazu.png';
import SchoolBg from '../../../assets/img/gymBG.png';
import { Link } from 'react-router-dom';
import { ArrowRight} from 'lucide-react';

const Home = () => {
    return (
        <div
            id="home"
            className="relative w-full h-[calc(100vh+8rem)] lg:h-[calc(100vh+9rem)] overflow-hidden transition-all duration-500 -mt-24 lg:-mt-24"
            style={{
                backgroundImage: `url(${SchoolBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Sophisticated Overlay with Gradient */}
            <div className="absolute inset-0 bg-black/60 dark:bg-slate-900/90 backdrop-blur-[1px] transition-all duration-500">
                {/* Animated Mesh Gradient Overlay */}
                <div className="absolute inset-0 opacity-50 dark:opacity-25">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#F4D77D]/40 dark:bg-amber-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E6C76A]/35 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-[#F4D77D]/30 dark:bg-yellow-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
                </div>

                {/* Geometric Accent Shapes */}
                <div className="absolute top-24 right-[15%] w-24 h-24 border-2 border-[#F4D77D]/50 dark:border-amber-500/15 rounded-full"></div>
                <div className="absolute bottom-32 left-[10%] w-20 h-20 bg-[#F4D77D]/30 dark:bg-orange-500/10 rounded-lg rotate-45"></div>
                <div className="absolute top-[40%] left-[5%] w-12 h-12 border-2 border-[#E6C76A]/50 dark:border-yellow-500/15 rounded-lg rotate-12"></div>
            </div>

            {/* Main Content Container - Moved down with padding */}
            <div className="relative z-10 container mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pt-32 lg:pt-40 h-full flex items-center">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">

                    {/* Left Content Column */}
                    <motion.div
                        className="space-y-5 lg:space-y-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Main Headline */}
                        <div className="space-y-3">
                            <motion.h1
                                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                <span className="text-white dark:text-white">GYMNAZO</span>
                                <br />
                                <span className="text-white dark:text-white">CHRISTIAN</span>
                                <br />
                                <span className="bg-gradient-to-r from-[#F4D77D] via-[#E6C76A] to-[#F7E5A5] dark:from-amber-500 dark:via-amber-400 dark:to-yellow-500 bg-clip-text text-transparent">
                                    ACADEMY
                                </span>
                            </motion.h1>

                            {/* Promise Statement */}
                            <motion.p
                                className="text-base sm:text-lg lg:text-xl font-light text-gray-100 dark:text-slate-300 max-w-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Where <span className="font-semibold text-[#F4D77D] dark:text-amber-400">affordable excellence</span> meets <span className="font-semibold text-[#E6C76A] dark:text-amber-400">accessible faith</span>-based education
                            </motion.p>
                        </div>
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                        >
                            <button className="w-full sm:w-auto group bg-white/10 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white/20 dark:hover:bg-slate-700 text-white dark:text-white px-6 py-3.5 rounded-xl font-semibold text-base border-2 border-[#F4D77D]/60 dark:border-amber-400 hover:border-[#F4D77D] dark:hover:border-amber-400 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                <span>Learn More</span>
                            </button>
                            <Link to="/admission" className="group">
                                <button className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-[#F4D77D] via-[#E6C76A] to-[#F7E5A5] dark:from-amber-400 dark:via-amber-400 dark:to-amber-400 hover:from-[#E6C76A] hover:via-[#D9B857] hover:to-[#F4D77D] dark:hover:from-amber-500 dark:hover:via-amber-500 dark:hover:to-amber-500 text-[#5B3E31] dark:text-[#5B3E31] px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                                    <span>Enroll Your Child Now</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                                </button>
                            </Link>

                        </motion.div>
                    </motion.div>

                    {/* Right Image Column */}
                    <motion.div
                        className="relative hidden lg:flex items-center justify-center h-[450px] xl:h-[550px]"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    >
                        {/* Glow Effect Behind Image */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#F4D77D]/20 via-[#E6C76A]/10 to-transparent blur-3xl"></div>

                        {/* Circular Frame Container */}
                        <div className="relative w-[450px] h-[450px] xl:w-[550px] xl:h-[550px]">
                            {/* Outer Frame Border */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-[#F4D77D]/40 dark:border-amber-500/40"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                            />

                            {/* Inner Frame Accent */}
                            <motion.div
                                className="absolute inset-4 rounded-full border-2 border-[#F4D77D]/20 dark:border-amber-500/20"
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                            />

                            {/* Image Container */}
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                {/* Background Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-white/5"></div>

                                {/* School Logo - Centered and Fitted */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.7 }}
                                >
                                    <img
                                        src={Logo}
                                        alt="Gymnazo Logo"
                                        className="w-full h-full object-contain opacity-70 dark:opacity-90" z
                                        style={{ filter: 'blur(.02px)' }}
                                    />
                                </motion.div>

                                {/* Student Image - Centered and Fitted */}
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
                                >
                                    <img
                                        src={Girl}
                                        alt="Gymnazo Student"
                                        className="max-h-full max-w-full w-auto h-auto object-contain"
                                        style={{ filter: 'drop-shadow(0 25px 50px rgba(244, 215, 125, 0.4))' }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Decorative Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 dark:from-slate-900 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default Home;