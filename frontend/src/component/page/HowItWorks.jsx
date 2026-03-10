import { FaChalkboardTeacher, FaCoins, FaBookOpen, FaRocket, FaLightbulb, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
    {
        id: 1,
        title: "Teach",
        description: "Share your knowledge and guide learners in your expertise.",
        icon: <FaChalkboardTeacher className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-blue-500 to-blue-700",
    },
    {
        id: 2,
        title: "Earn Tokens",
        description: "Get rewarded with tokens for your contributions and mentorship.",
        icon: <FaCoins className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-green-500 to-green-700",
    },
    {
        id: 3,
        title: "Learn",
        description: "Use your tokens to unlock premium learning content and skills.",
        icon: <FaBookOpen className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-purple-500 to-purple-700",
    },
    {
        id: 4,
        title: "Grow",
        description: "Continuously improve your skills and expand your knowledge base.",
        icon: <FaRocket className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-yellow-500 to-yellow-700",
    },
    {
        id: 5,
        title: "Innovate",
        description: "Apply your skills to create innovative solutions and projects.",
        icon: <FaLightbulb className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-pink-500 to-pink-700",
    },
    {
        id: 6,
        title: "Collaborate",
        description: "Work with others, share insights, and achieve goals together.",
        icon: <FaUsers className="text-5xl text-white" />,
        color: "bg-gradient-to-tr from-teal-500 to-teal-700",
    },
];

const HowItWorks = () => {
    return (
        <section className="bg-gray-50 py-20 px-6 flex flex-col items-center">
            <h2 className="text-5xl font-bold mb-12 text-gray-800 text-center">
                How it Works
            </h2>

            {/* Stepper */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 relative w-full max-w-6xl">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        className="flex flex-col items-center text-center md:w-1/4"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.3 }}
                        viewport={{ once: true }}
                    >
                        {/* Step Icon */}
                        <div
                            className={`w-24 h-24 flex items-center justify-center rounded-full mb-4 shadow-xl hover:scale-110 transition-transform ${step.color}`}
                        >
                            {step.icon}
                        </div>

                        {/* Step Title */}
                        <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>

                        {/* Step Description */}
                        <p className="text-gray-600">{step.description}</p>

                        {/* Arrow (except last step) */}
                        {index < steps.length - 1 && (
                            <div className="hidden md:block w-16 h-1 bg-gray-300 mt-6"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* 2026 Smart Learning Hub Card */}
            <motion.div
                className="mt-20 p-8 bg-gradient-to-r from-cyan-600 via-blue-400 to-indigo-600 text-white rounded-3xl shadow-2xl max-w-3xl text-center hover:scale-105 transition-transform"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h3 className="text-3xl font-extrabold mb-3">🚀 Smart Learning Hub</h3>
                <p className="text-lg mb-4">
                    Unlock personalized growth with AI-driven recommendations, token-based achievements,
                    and skill tracking. Your learning journey adapts to your progress in real-time!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <span className="bg-white text-cyan-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                        Explore Swaps
                    </span>
                    <span className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                        View Achievements
                    </span>
                </div>
            </motion.div>
        </section>
    );
};

export default HowItWorks;