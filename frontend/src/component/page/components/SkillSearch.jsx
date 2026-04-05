import { useState } from "react";
import { Search } from "lucide-react"; // already using lucide-react in your project

const SkillSearch = ({ search, setSearch }) => {
    return (
        <div className="max-w-xl mx-auto mb-12 relative">
            {/* Search Icon */}
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />

            <input
                type="text"
                placeholder="Search skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                    w-full
                    px-12 py-4
                    rounded-3xl
                    bg-white/30 backdrop-blur-md
                    border border-gray-200
                    focus:outline-none
                    text-left
                    focus:ring-4 focus:ring-indigo-300
                    placeholder-gray-400
                    dark:placeholder-gray-500
                    dark:bg-gray-700/30 dark:border-gray-600
                    dark:focus:ring-indigo-500
                    text-gray-800
                    dark:text-gray-200
                    shadow-lg
                    transition
                    duration-300
                    hover:shadow-indigo-200
                    focus:shadow-indigo-400
                    text-center
                    text-lg
                "
            />
            {/* Animated Placeholder Suggestion */}
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-200 text-sm animate-pulse hidden sm:inline">
                Type and discover trending skills...
            </span>
        </div>
    );
};

export default SkillSearch;