import React from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Sparkles } from "lucide-react";
import { teachOptions } from "./data/teachData";
import { Meteors } from "@/components/ui/meteors";

const TeachPage = () => {
    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-6 overflow-hidden">

            {/* Meteors Effect */}
            <Meteors number={25} className="text-indigo-400" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >

                <h1 className="text-4xl font-bold text-gray-800">
                    👨‍🏫 Teach on SkillSwap
                </h1>

                <p className="text-gray-500 mt-3">
                    Share your knowledge, guide learners, and build your reputation
                    as an expert while earning rewards.
                </p>

            </motion.div>

            {/* Platform Stats */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

                {[
                    {
                        icon: <Users className="mx-auto text-indigo-500 mb-2" size={32} />,
                        number: "18K+",
                        text: "Active Mentors"
                    },
                    {
                        icon: <BookOpen className="mx-auto text-green-500 mb-2" size={32} />,
                        number: "120K+",
                        text: "Skills Shared"
                    },
                    {
                        icon: <Sparkles className="mx-auto text-orange-500 mb-2" size={32} />,
                        number: "350K+",
                        text: "Learning Sessions"
                    }
                ].map((item, i) => (

                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white p-6 rounded-2xl shadow text-center"
                    >

                        {item.icon}

                        <h3 className="text-2xl font-bold">{item.number}</h3>

                        <p className="text-gray-500 text-sm">{item.text}</p>

                    </motion.div>

                ))}

            </div>

            {/* Teaching Options */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {teachOptions.map((option, index) => (

                    <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -6 }}
                        className="bg-white rounded-3xl shadow-lg p-6 cursor-pointer"
                    >

                        <div className="text-4xl mb-4">{option.icon}</div>

                        <h3 className="text-lg font-semibold text-gray-800">
                            {option.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                            {option.description}
                        </p>

                        <div className="mt-4 flex justify-between items-center">

                            <span className="text-indigo-600 font-semibold">
                                {option.reward}
                            </span>

                            <button className="text-indigo-600 font-medium hover:underline">
                                Start →
                            </button>

                        </div>

                    </motion.div>

                ))}

            </div>

            {/* CTA */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mt-20"
            >

                <h2 className="text-2xl font-semibold text-gray-800">
                    Become a mentor and start teaching today 🚀
                </h2>

                <button className="mt-5 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg transition">
                    Start Teaching
                </button>

            </motion.div>

        </section>
    );
};

export default TeachPage;