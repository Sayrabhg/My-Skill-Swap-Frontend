import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatgptsskillsswap from "../../../assets/ChatGPTSkillSwap.png";
import { ShineBorder } from "@/components/ui/shine-border";
import { Eye, EyeOff, Globe } from "lucide-react";
import { loginUser, registerUser, getProfile } from "../../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import ForgotPasswordModal from "./ForgotPasswordModal";


const LoginSignup = () => {

    const navigate = useNavigate();
    const [forgotOpen, setForgotOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("success");
    const [customLanguage, setCustomLanguage] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        language: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const res = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });

                const token = res.data.token;
                const userId = res.data.userId;

                localStorage.setItem("token", token);

                // Get full user profile
                const userRes = await getProfile(userId);
                const userData = userRes.data;

                localStorage.setItem("user", JSON.stringify(userData));

                setDialogMessage("Login Successful 🎉");
                setStatus("success");
                setDialogOpen(true);

                // ---------------- FIRST LOGIN CHECK ----------------
                const firstLogin = userData?.firstLogin === true || userData?.FirstLogin === true;

                // Navigate after short delay so dialog can be seen
                setTimeout(() => {
                    if (firstLogin) {
                        navigate("/welcome"); // first time login
                    } else {
                        navigate("/dashboard"); // subsequent logins
                    }
                }, 1000);

            } else {
                // SIGNUP LOGIC
                if (formData.password !== formData.confirmPassword) {
                    setDialogMessage("Passwords do not match ❌");
                    setStatus("error");
                    setDialogOpen(true);
                    return;
                }

                await registerUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    language:
                        formData.language === "Other" ? customLanguage : formData.language,
                });

                setDialogMessage("Registration Successful 🎉");
                setStatus("success");
                setDialogOpen(true);

                setIsLogin(true);
            }
        } catch (error) {
            console.error(error);
            setDialogMessage("Invalid credentials ❌");
            setStatus("error");
            setDialogOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center px-4">

            <img
                src={chatgptsskillsswap}
                alt="Skill Swap Background"
                className="absolute w-full h-full object-cover opacity-20"
            />

            <ForgotPasswordModal open={forgotOpen} onOpenChange={setForgotOpen} />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>Skill Swap</DialogTitle>
                        <DialogDescription
                            className={`text-base mt-2 font-medium ${status === "success"
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            {dialogMessage}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative w-full text-white max-w-md bg-[#000291]/25 shadow-xl rounded-2xl p-8 overflow-hidden z-10">

                <ShineBorder shineColor={["#00fdfd", "#ae00ff", "#ff0280"]} />

                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? "Login to Skill-Swap" : "Create Skill-Swap Account"}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {!isLogin && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />

                    {!isLogin && (
                        <div className="space-y-2">

                            <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                                <Globe size={16} />
                                Preferred Language
                            </label>

                            <div className="relative">

                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 text-gray-100 border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                >
                                    <option className="bg-dark" value="">Select Language</option>
                                    <option className="bg-dark" value="English">English</option>
                                    <option className="bg-dark" value="Hindi">Hindi</option>
                                    <option className="bg-dark" value="Marathi">Marathi</option>
                                    <option className="bg-dark" value="Spanish">Spanish</option>
                                    <option className="bg-dark" value="French">French</option>
                                    <option className="bg-dark" value="Other">Other</option>
                                </select>

                            </div>

                            {formData.language === "Other" && (
                                <input
                                    type="text"
                                    placeholder="Enter your language (Example: Japanese)"
                                    value={customLanguage}
                                    onChange={(e) => setCustomLanguage(e.target.value)}
                                    className="w-full bg-white/20 text-gray-200 border border-gray-300 rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            )}

                        </div>
                    )}

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-indigo-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Forgot Password Button */}
                    {isLogin && (
                        <div className="flex justify-end mt-1">
                            <button
                                type="button"
                                className="text-sm text-indigo-400 hover:text-indigo-600 font-medium"
                                onClick={() => setForgotOpen(true)}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    {!isLogin && (
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-indigo-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Processing...
                            </>
                        ) : (
                            isLogin ? "Login" : "Sign Up"
                        )}
                    </button>

                </form>

                <p className="text-sm text-center mt-5">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}

                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-indigo-600 font-medium ml-1 hover:underline"
                    >
                        {isLogin ? "Sign Up" : "Login"}
                    </button>
                </p>

                <div className="text-center mt-4">
                    <Link to="/" className="text-sm text-gray-300 hover:text-indigo-600">
                        ← Back to Home
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default LoginSignup;