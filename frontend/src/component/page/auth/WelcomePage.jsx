import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/api/api";
import chatgptsskillsswap from "@/assets/ChatGPTSkillSwap.png";

export default function WelcomePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const [accepted, setAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleGetStarted = async () => {
        if (!user?.id) return;

        if (!accepted) {
            window.alert("Please accept our Privacy Policy and Terms to continue.");
            return;
        }

        setLoading(true);
        try {
            // Update firstLogin to false in backend
            await updateProfile({ isFirstLogin: false });

            // Update localStorage so subsequent logins go to dashboard
            const updatedUser = { ...user, isFirstLogin: false };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Navigate to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error("Failed to update firstLogin:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-600 dark:from-violet-900 to-violet-600 dark:to-indigo-900 flex items-center justify-center px-4 relative">
            {/* Background Image */}
            <img
                src={chatgptsskillsswap}
                alt="Skill Swap Background"
                className="absolute w-full h-full object-cover opacity-20"
            />

            {/* Card */}
            <div className="relative max-w-3xl w-full bg-white/80 dark:bg-gray-800 shadow-xl rounded-2xl p-8 text-center space-y-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Welcome to Skill Swap 👋
                </h1>

                <p className="text-gray-500 dark:text-gray-300">
                    {user?.name ? `Hi ${user.name},` : "Hi there,"} welcome to Skill Swap! 🚀
                    Get ready to learn new skills, share your expertise, and connect with a vibrant
                    community of learners and mentors. Let's start swapping skills and growing together!
                </p>

                {/* Rules / Regulations */}
                <div className="text-left text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-600 p-4 rounded-lg shadow-inner space-y-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">📌 Community Guidelines & Rules</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Be respectful and professional in all interactions.</li>
                        <li>No abusive, offensive, or harmful content.</li>
                        <li>No spam, scams, or fake profiles.</li>
                        <li>Deliver what you promise when offering skills.</li>
                        <li>Communicate clearly and honestly.</li>
                    </ul>

                    <h3 className="font-semibold text-gray-800 mt-2 mb-1">⚖️ Regulations</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Users must provide accurate profile information.</li>
                        <li>Skills listed should be genuine and verifiable.</li>
                        <li>Misuse of the platform may lead to restrictions.</li>
                        <li>Token misuse or fraudulent activity is strictly prohibited.</li>
                    </ul>

                    <h3 className="font-semibold text-gray-800 mt-2 mb-1">🔐 Privacy Policy</h3>
                    <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Your personal data is secure and never sold to third parties.</li>
                        <li>Uploaded files (images, resumes) are stored securely.</li>
                        <li>You control what information is visible on your profile.</li>
                        <li>We only use your email for essential communication.</li>
                    </ul>
                </div>

                {/* Checkbox */}
                <div className="flex items-center justify-center gap-2">
                    <input
                        type="checkbox"
                        id="privacyCheck"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                    />
                    <label htmlFor="privacyCheck" className="text-gray-500 dark:text-gray-300 text-sm">
                        I agree to the{" "}
                        <span className="text-indigo-600 font-medium">Privacy Policy</span> and{" "}
                        <span className="text-indigo-600 font-medium">Terms of Service</span>.
                    </label>
                </div>

                {/* Get Started Button */}
                <Button
                    type="button"
                    onClick={handleGetStarted}
                    disabled={!accepted || loading}
                    className={`px-6 py-2 rounded-lg text-white ${accepted && !loading
                            ? "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {loading ? "Processing..." : "Get Started →"}
                </Button>
            </div>
        </div>
    );
}