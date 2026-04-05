import { motion } from "framer-motion";

export default function Loading({ message = "Loading..." }) {

    return (

        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-800">

            {/* Animated Logo Circle */}

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>

            {/* Pulsing Brand */}

            <motion.h2
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-6 text-lg font-semibold text-indigo-600 dark:text-indigo-400"
            >
                SkillSwap
            </motion.h2>

            {/* Message */}

            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                {message}
            </p>

        </div>

    );

}