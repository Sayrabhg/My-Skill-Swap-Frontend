import React from "react";
import { motion } from "framer-motion";
import { testimonials } from "./data/testimonialData";

// animation for container
const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2
        }
    }
};

// animation for each card
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const TestimonialBento = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100">

            {/* Heading animation */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold text-gray-800">
                    💬 What Our Learners Say
                </h2>
                <p className="text-gray-500 mt-3">
                    Real stories from people exchanging skills worldwide
                </p>
            </motion.div>

            {/* Grid */}
            <motion.div
                className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 auto-rows-[180px]"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >

                {testimonials.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl transition"
                    >

                        <p className="text-gray-600 text-sm">
                            “{item.quote}”
                        </p>

                        <div className="flex items-center gap-4 mt-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />

                            <div className="text-left">
                                <h4 className="font-semibold text-gray-800">
                                    {item.name}
                                </h4>
                                <p className="text-xs text-indigo-500">
                                    {item.skill}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                ))}

            </motion.div>

        </section>
    );
};

export default TestimonialBento;