import { useState } from "react";
import { Link } from "react-router-dom";

const LoginSignup = () => {

    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-[var(--color-mine)] shadow-xl rounded-2xl p-8">

                {/* Title */}
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? "Login to Skill-Swap" : "Create Skill-Swap Account"}
                </h2>

                {/* Form */}
                <form className="space-y-4">

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />

                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                        />
                    )}

                    {/* Button */}
                    <button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </button>

                </form>

                {/* Toggle */}
                <p className="text-sm text-center mt-5">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}

                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-medium ml-1 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>

                {/* Back Home */}
                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-500 hover:text-indigo-600">
                        ← Back to Home
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default LoginSignup;