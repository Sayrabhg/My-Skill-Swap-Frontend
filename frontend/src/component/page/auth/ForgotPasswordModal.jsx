import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Eye, EyeOff, Mail, Key } from "lucide-react";
import { sendOtp, verifyOtp, resetPassword } from "../../../api/api";

const ForgotPasswordModal = ({ open, onOpenChange }) => {

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [status, setStatus] = useState("success");

    const [formData, setFormData] = useState({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [verifiedOtp, setVerifiedOtp] = useState(""); // ✅ store verified OTP

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Reset when modal closes
    useEffect(() => {
        if (!open) {
            setStep(1);
            setFormData({
                email: "",
                otp: "",
                newPassword: "",
                confirmPassword: ""
            });
            setVerifiedOtp("");
            setDialogMessage("");
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ---------------- STEP 1 ----------------
    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email) {
            setStatus("error");
            setDialogMessage("Email is required ❌");
            return;
        }

        setLoading(true);
        try {
            const res = await sendOtp({ email: formData.email });

            setStatus("success");
            setDialogMessage(res?.data?.message || "OTP sent ✅");
            setStep(2);

        } catch (error) {
            setStatus("error");
            setDialogMessage(
                error?.response?.data?.message || "Failed to send OTP ❌"
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------- STEP 2 ----------------
    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        if (!formData.otp) {
            setStatus("error");
            setDialogMessage("Enter OTP ❌");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp({
                email: formData.email,
                otp: formData.otp
            });

            setVerifiedOtp(formData.otp); // ✅ save OTP
            setStatus("success");
            setDialogMessage(res?.data?.message || "OTP verified ✅");
            setStep(3);

        } catch (error) {
            setStatus("error");
            setDialogMessage(
                error?.response?.data?.message || "Invalid OTP ❌"
            );
        } finally {
            setLoading(false);
        }
    };

    // ---------------- STEP 3 ----------------
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!formData.newPassword || !formData.confirmPassword) {
            setStatus("error");
            setDialogMessage("All fields required ❌");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setStatus("error");
            setDialogMessage("Passwords do not match ❌");
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword({
                email: formData.email,
                otp: verifiedOtp, // ✅ IMPORTANT FIX
                newPassword: formData.newPassword
            });

            setStatus("success");
            setDialogMessage(res?.data?.message || "Password reset 🎉");

            setTimeout(() => {
                onOpenChange(false);
            }, 1200);

        } catch (error) {
            setStatus("error");
            setDialogMessage(
                error?.response?.data?.message || "Reset failed ❌"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md text-center">

                <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>

                    {dialogMessage && (
                        <DialogDescription className={`mt-2 font-medium ${status === "success" ? "text-green-500" : "text-red-500"
                            }`}>
                            {dialogMessage}
                        </DialogDescription>
                    )}
                </DialogHeader>

                {/* STEP 1 */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded-lg"
                            />
                            <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4 mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={formData.otp}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 rounded-lg"
                            />
                            <Key size={18} className="absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg">
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>
                    </form>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-4">

                        {/* New Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="newPassword"
                                placeholder="New Password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 pr-10 rounded-lg"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full border px-4 py-2 pr-10 rounded-lg"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

            </DialogContent>
        </Dialog>
    );
};

export default ForgotPasswordModal;