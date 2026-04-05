import React, { useState } from "react";
import { motion } from "framer-motion";
import { allSkills } from "./data/skillsData";
import SkillSearch from "./components/SkillSearch";

const AllSkills = () => {
    const [search, setSearch] = useState("");

    // Filter skills by search
    const filteredSkills = allSkills.filter(skill =>
        skill.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-gradient-to-b from-gray-100 dark:from-gray-800 to-gray-50 dark:to-gray-600 py-16 px-6">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
                🚀 Explore All Skills
            </h2>

            {/* Search */}
            <SkillSearch search={search} setSearch={setSearch} />

            {/* Skills Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
                {filteredSkills.map((skill, idx) => (
                    <motion.div
                        key={idx}
                        className="bg-white dark:bg-gray-700 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center hover:scale-100 transform transition-transform duration-300 relative"
                        whileHover={{ scale: 1.08 }}
                    >
                        <div className="text-6xl mb-4">{skill.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{skill.title}</h3>
                        <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 via-red-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                            {skill.popularity}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{skill.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default AllSkills;