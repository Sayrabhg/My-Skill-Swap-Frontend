import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Clock, Globe, Zap } from "lucide-react";

const statsData = [
    {
        title: "Total Hours Swapped",
        value: 128450,
        icon: <Clock size={40} />,
        color: "from-indigo-500 to-purple-600",
    },
    {
        title: "Active Mentors",
        value: 2450,
        icon: <Users size={40} />,
        color: "from-pink-500 to-red-500",
    },
    {
        title: "Skills Available",
        value: 560,
        icon: <Globe size={40} />,
        color: "from-green-500 to-emerald-600",
    },
    {
        title: "Successful Swaps",
        value: 74200,
        icon: <Zap size={40} />,
        color: "from-yellow-400 to-orange-500",
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

const LiveStats = () => {
    const [counts, setCounts] = useState(statsData.map(() => 0));
    const [startCount, setStartCount] = useState(false);

    useEffect(() => {
        if (!startCount) return;

        const intervals = statsData.map((stat, index) => {
            let start = 0;
            const end = stat.value;
            const duration = 2000;
            const step = Math.ceil(end / (duration / 30));

            return setInterval(() => {
                start += step;

                if (start >= end) {
                    start = end;
                }

                setCounts((prev) => {
                    const updated = [...prev];
                    updated[index] = start;
                    return updated;
                });
            }, 30);
        });

        return () => intervals.forEach(clearInterval);
    }, [startCount]);

    return (
        <section className="bg-gradient-to-b from-gray-50 dark:from-gray-900 to-gray-200 dark:to-gray-900 py-20 px-6">

            {/* Heading Animation */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    📊 Live SkillSwap Network Stats
                </h2>
                <p className="text-gray-500 dark:text-gray-300 mt-3">
                    Real-time insights into our growing learning community
                </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onViewportEnter={() => setStartCount(true)}
            >
                {statsData.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ scale: 1.07 }}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-500 rounded-3xl p-8 text-center shadow-xl relative overflow-hidden"
                    >
                        {/* Icon */}
                        <div
                            className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white  bg-gradient-to-r ${stat.color}`}
                        >
                            {stat.icon}
                        </div>

                        {/* Counter */}
                        <h3 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                            {counts[index].toLocaleString()}+
                        </h3>

                        {/* Title */}
                        <p className="text-gray-500 dark:text-gray-300 mt-2">{stat.title}</p>

                        {/* Glow hover */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition bg-gradient-to-r from-indigo-400 to-purple-500 blur-2xl"></div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Bottom Text */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="text-center mt-16"
            >
                <p className="text-indigo-600 font-semibold text-lg">
                    🌍 Over 70+ countries exchanging skills daily
                </p>
            </motion.div>

        </section>
    );
};

export default LiveStats;