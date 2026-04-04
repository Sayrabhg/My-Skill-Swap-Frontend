import { Search, ArrowRight, Users, BookOpen, Sparkles } from "lucide-react";
import geminiskillswap from "../../assets/GeminiSkillSwap.png";
import { Typewriter } from "react-simple-typewriter";
import RightIllustration from "./components/RightIllustration";
import { CoolMode } from "@/components/ui/cool-mode";
import PopupMessage from "@/component/page/components/PopupMessage";
import { useState } from "react";

const suggestions = [
    "What do you want to learn today?",
    "What skill would you like to share today?",
    "Learn Web Development from a mentor",
    "Exchange coding skills for design",
    "Find someone to practice English",
    "Teach photography and learn editing",
    "Learn guitar from a music lover",
    "Share your cooking skills",
    "Find a partner to learn React",
    "Exchange skills and grow together"
];

const HeroSection = () => {
    const handleSearch = () => {
        alert("Searching skills...");
    };

    const [showPopup, setShowPopup] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const handleStartClick = () => {
        if (!user?.id) {
            setShowPopup(true); // Show popup if not logged in
        } else {
            // Navigate to swapping page
            console.log("User logged in, go to swapping page");
        }
    };

    return (
        <section className="relative flex items-center overflow-hidden">

            {/* Background Image */}
            <img
                src={geminiskillswap}
                alt="Skill Swap Background"
                className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
            />

            {/* Overlay (optional for better text visibility) */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 via-purple-800/50 to-blue-100/40"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Content */}
                <div className="animate-fadeIn">

                    <h1 className="text-3xl lg:text-5xl font-bold leading-tight text-gray-200">
                        Your Expertise is Your{" "}
                        <span className="text-card relative">
                            Currency
                            <span className="absolute left-0 -bottom-2 w-full h-1 bg-primary rounded-full"></span>
                        </span>
                    </h1>

                    <p className="mt-6 text-lg text-white">
                        Join a global community where knowledge is exchanged, not bought.
                        Share what you know and learn what you love — completely free.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-8 relative flex items-center bg-white text-gray-600 border border-border rounded-full shadow-lg hover:shadow-xl transition overflow-hidden group">

                        {/* Input */}
                        <input
                            type="text"
                            className="flex-1 p-2 lg:px-6 lg:py-3 outline-none bg-transparent relative z-10"
                        />

                        {/* Animated Placeholder */}
                        <div className="absolute overflow-hidden h-6 left-6 text-gray-400 pointer-events-none group-focus-within:hidden">
                            <Typewriter
                                words={suggestions}
                                loop={true}
                                cursor={false}
                                typeSpeed={60}
                                deleteSpeed={40}
                                delaySpeed={2000}
                            />
                        </div>

                        {/* Search Button */}
                        <CoolMode>
                            <button
                                onClick={handleSearch}
                                className="bg-primary hover:bg-primaryLight text-white px-4 lg:px-6 py-3 flex items-center gap-2 cursor-pointer transition relative z-10"
                            >
                                <Search size={18} />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </CoolMode>

                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap lg:justify-start justify-center gap-4">

                        <CoolMode>
                            <button
                                className="bg-primary hover:bg-primaryLight text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 shadow-lg hover:shadow-primary/40 transition transform hover:-translate-y-1"
                                onClick={handleStartClick}
                            >
                                Start Swapping
                                <ArrowRight size={18} />
                            </button>
                        </CoolMode>

                        <button className="border border-primary text-primarylight px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition transform hover:-translate-y-1">
                            Explore Skills
                        </button>

                    </div>

                    {/* Features */}
                    <div className="mt-10 grid grid-cols-3 gap-6 text-center">

                        <div className="hover:scale-110 transition">
                            <Users className="mx-auto text-violet-800 mb-2" size={28} />
                            <p className="text-sm text-gray-100">Global Community</p>
                        </div>

                        <div className="hover:scale-110 transition">
                            <BookOpen className="mx-auto text-purple-800 mb-2" size={28} />
                            <p className="text-sm text-gray-100">Learn Anything</p>
                        </div>

                        <div className="hover:scale-110 transition">
                            <Sparkles className="mx-auto text-orange-800 mb-2" size={28} />
                            <p className="text-sm text-gray-100">Share Your Talent</p>
                        </div>

                    </div>

                </div>

                {/* Right Illustration */}
                <RightIllustration />
                {/* Popup */}
                <PopupMessage
                    open={showPopup}
                    onClose={() => setShowPopup(false)}
                    message="You need to first login to start swapping."
                />

            </div>
        </section>
    );
};

export default HeroSection;