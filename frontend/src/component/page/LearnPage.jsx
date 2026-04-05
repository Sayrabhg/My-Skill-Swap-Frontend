import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, BookOpen } from "lucide-react";
import { courses } from "./data/coursesData";
import { ShineBorder } from "@/components/ui/shine-border";
import { CoolMode } from "@/components/ui/cool-mode";

const LearnPage = () => {

    const [search, setSearch] = useState("");
    const [showLockedPopup, setShowLockedPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleUnlockClick = (course) => {
        setSelectedCourse(course);
        setShowLockedPopup(true);
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-50 dark:from-gray-800 to-gray-200 dark:to-gray-600 py-16 px-6">

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <div className="relative inline-block">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
                        🎓 Learn Premium Skills
                    </h1>

                    <span className="absolute -top-3 -right-6 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md rotate-12">
                        PREMIUM
                    </span>
                </div>

                <p className="text-gray-500 dark:text-gray-400 mt-3">
                    Use your tokens to unlock premium learning content and master new skills.
                </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-12 relative">

                <ShineBorder className="rounded-full" shineColor={["#00fdfd", "#ae00ff", "#ff0280"]} />

                <Search className="absolute left-4 top-3 text-gray-400" size={20} />

                <input
                    type="text"
                    placeholder="Search courses..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />

            </div>

            {/* Courses Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {filteredCourses.map((course) => (

                    <motion.div
                        key={course.id}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white dark:bg-gray-700 rounded-3xl shadow-lg overflow-hidden cursor-pointer"
                    >

                        <img
                            src={course.image}
                            alt={course.title}
                            className="h-44 w-full object-cover"
                        />

                        <div className="p-6">

                            <div className="flex justify-between mb-2">

                                <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                    {course.category}
                                </span>

                                <span className="text-xs bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full">
                                    🪙 {course.tokens} Tokens
                                </span>

                            </div>

                            <h3 className="text-lg font-semibold text-gray-800">
                                {course.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                Instructor: {course.instructor}
                            </p>

                            <div className="flex justify-between items-center mt-4">

                                <span className="text-xs text-gray-500 dark:text-gray-300">
                                    Level: {course.level}
                                </span>

                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {course.rating}
                                    </span>
                                </div>

                            </div>

                            <CoolMode>
                                <button
                                    onClick={() => handleUnlockClick(course)}
                                    className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-full flex items-center justify-center gap-2 transition"
                                >

                                    <BookOpen size={18} />

                                    Unlock Course

                                </button>
                            </CoolMode>

                        </div>

                    </motion.div>

                ))}

            </div>
            {showLockedPopup && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.7, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-8 text-center max-w-sm w-full"
                    >

                        <div className="text-5xl mb-3">🔒</div>

                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            Course Locked
                        </h3>

                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            This course is locked. Use tokens to unlock it.
                        </p>

                        {selectedCourse && (
                            <p className="text-indigo-600 font-semibold mt-3">
                                {selectedCourse.tokens} Tokens Required
                            </p>
                        )}

                        <button
                            onClick={() => setShowLockedPopup(false)}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full"
                        >
                            Close
                        </button>

                    </motion.div>

                </div>
            )}
        </section>
    );
};

export default LearnPage;