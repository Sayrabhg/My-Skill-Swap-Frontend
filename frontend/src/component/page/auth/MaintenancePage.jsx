import React from "react";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-6">

            <div className="text-center max-w-lg">

                {/* Animated Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center animate-pulse">
                        <span className="text-4xl">🛠️</span>
                    </div>
                </div>

                {/* Heading */}
                <h6 className="text-2xl italic font-bold text-primary mb-4">
                    MySkillSwap
                </h6>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    This Page is Under Maintenance
                </h1>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                    We're improving your experience 🚀 <br />
                    Please check back soon!
                </p>

                {/* Loader */}
                <div className="flex justify-center gap-2 mb-6">
                    <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce delay-300"></span>
                </div>

                {/* Footer */}
                <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} SkillSwap
                </p>
            </div>
        </div>
    );
}