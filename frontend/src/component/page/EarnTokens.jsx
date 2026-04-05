import React from "react";
import { motion } from "framer-motion";
import { earnOptions } from "./data/earnTokensData";
import { Coins, Users, Trophy } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { CoolMode } from "@/components/ui/cool-mode";

const EarnTokens = () => {
    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-800 to-gray-200 dark:to-gray-600 py-16 px-6">

            <Meteors number={30} className="text-indigo-400" />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">

                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                    🪙 Earn Tokens
                </h1>

                <p className="text-gray-500 dark:text-gray-400 mt-3">
                    Get rewarded with tokens for sharing knowledge, mentoring learners,
                    and contributing to the SkillSwap community.
                </p>

            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow text-center">
                    <Coins className="mx-auto text-yellow-500 mb-2" size={32} />
                    <h3 className="text-2xl font-bold">320K+</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tokens Earned by Community</p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow text-center">
                    <Users className="mx-auto text-indigo-500 mb-2" size={32} />
                    <h3 className="text-2xl font-bold">18K+</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Active Mentors</p>
                </div>

                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow text-center">
                    <Trophy className="mx-auto text-orange-500 mb-2" size={32} />
                    <h3 className="text-2xl font-bold">5K+</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Skill Challenges Completed</p>
                </div>

            </div>

            {/* Earn Options Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {earnOptions.map((option, index) => (

                    <motion.div
                        key={option.id}

                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        viewport={{ once: true }}

                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}

                        className="bg-white dark:bg-gray-700 rounded-3xl shadow-lg p-6 cursor-pointer transition"
                    >

                        <div className="text-4xl mb-4">{option.icon}</div>

                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {option.title}
                        </h3>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {option.description}
                        </p>

                        <div className="mt-4 flex justify-between items-center">

                            <span className="text-yellow-600 font-semibold">
                                🪙 {option.reward} Tokens
                            </span>

                            <button className="text-indigo-600 font-medium hover:underline">
                                Start →
                            </button>

                        </div>

                    </motion.div>

                ))}

            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">

                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                    Start sharing your knowledge today 🚀
                </h2>

                <CoolMode>
                    <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg transition">
                        Become a Mentor
                    </button>
                </CoolMode>

            </div>

        </section>
    );
};

export default EarnTokens;