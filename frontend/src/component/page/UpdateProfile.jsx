import { useEffect, useState } from "react";
import { updateProfile, uploadAvatar } from "../../api/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, XCircle, ArrowLeft } from "lucide-react";
import StatusDialog from "./components/StatusDialog";

export default function UpdateProfile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
        avatarName: "",
        // resumePdf: "",
        // resumePdfName: "",
        bio: "",
        mobileNumber: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        website: "",
        linkedin: "",
        github: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [dialogMessage, setDialogMessage] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [dialogType, setDialogType] = useState("success");
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        setUploading(true);

        try {
            const res = await uploadAvatar(formData);

            const updatedUser = {
                ...user,
                avatar: res.data,              // URL from backend
                avatarName: file.name          // 👈 store file name
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            alert("Only PDF allowed");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setUploading(true);

            const res = await uploadResume(formData); // 👈 create this API

            const updatedUser = {
                ...user,
                resumePdf: res.data,       // URL from backend
                resumePdfName: file.name   // file name
            };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await updateProfile(user);
            localStorage.setItem("user", JSON.stringify(res.data));

            setDialogMessage("Profile updated successfully");
            setDialogType("success");
            setShowDialog(true);

        } catch (error) {
            console.error(error);

            setDialogMessage("Profile update failed. Please try again.");
            setDialogType("error");
            setShowDialog(true);

        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setShowDialog(false);
        if (dialogMessage === "Profile updated successfully") {
            navigate("/profile");
        }
    };

    return (
        <div className="min-h-screen bg-violet-50 flex justify-center items-center p-6 relative">
            <div className="absolute top-6 left-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-110 rounded-full shadow-md hover:bg-indigo-200 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-3">

                            {/* Avatar */}
                            <img
                                src={preview || user.avatar || "https://i.pravatar.cc/100"}
                                alt="avatar"
                                className="w-24 h-24 rounded-full object-cover"
                            />

                            {/* Loader Overlay */}
                            {uploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            id="avatarUpload"
                            style={{ display: "none" }}
                            onChange={handleAvatarUpload}
                        />

                        {/* Button */}
                        <label
                            htmlFor="avatarUpload"
                            className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Choose Image
                        </label>
                    </div>

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Email (disabled) */}
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                        className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                    />

                    {/* Mobile Number */}
                    <input
                        type="text"
                        name="mobileNumber"
                        placeholder="Mobile Number"
                        value={user.mobileNumber || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Gender */}
                    <div className="w-full">
                        <label className="block mb-1 font-medium text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={user.gender || ""}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Address */}
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={user.address || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* City */}
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={user.city || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* State */}
                    <input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={user.state || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Country */}
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={user.country || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Postal Code */}
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={user.postalCode || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Website */}
                    <input
                        type="text"
                        name="website"
                        placeholder="Website URL / Portfolio URL"
                        value={user.website || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* LinkedIn */}
                    <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={user.linkedin || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* GitHub */}
                    <input
                        type="text"
                        name="github"
                        placeholder="GitHub URL"
                        value={user.github || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </Button>

                </form>
            </div>

            {/* Dialog */}
            <StatusDialog
                open={showDialog}
                type={dialogType}
                message={dialogMessage}
                onClose={handleDialogClose}
            />
        </div>
    );
}