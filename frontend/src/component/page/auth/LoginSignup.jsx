import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import chatgptsskillsswap from "../../../assets/ChatGPTSkillSwap.png";
import { ShineBorder } from "@/components/ui/shine-border";
import { loginUser, registerUser, getProfile } from "../../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";


const LoginSignup = () => {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            if (isLogin) {

                const res = await loginUser({
                    email: formData.email,
                    password: formData.password
                });

                const token = res.data.token;
                const userId = res.data.userId;

                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);

                const userRes = await getProfile(userId);

                localStorage.setItem(
                    "user",
                    JSON.stringify(userRes.data)
                );

                setDialogMessage("Login Successful 🎉");
                setDialogOpen(true);

                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);

            } else {

                if (formData.password !== formData.confirmPassword) {

                    setDialogMessage("Passwords do not match ❌");
                    setDialogOpen(true);
                    return;
                }

                await registerUser({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });

                setDialogMessage("Registration Successful 🎉");
                setDialogOpen(true);

                setIsLogin(true);
            }
        }
        catch (error) {

            console.error(error);

            setDialogMessage("Invalid credentials ❌");
            setDialogOpen(true);

        }

    };

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center px-4">

            <img
                src={chatgptsskillsswap}
                alt="Skill Swap Background"
                className="absolute w-full h-full object-cover opacity-20"
            />

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>Skill Swap Login</DialogTitle>
                        <DialogDescription className="text-base mt-2">
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

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                    />

                    {!isLogin && (
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
                        />
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
                    >
                        {isLogin ? "Login" : "Sign Up"}
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