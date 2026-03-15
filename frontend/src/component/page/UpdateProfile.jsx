import { useEffect, useState } from "react";
import { updateProfile } from "../../api/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
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

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
            alert("Profile updated successfully");
            navigate("/profile");
        } catch (error) {
            console.error(error);
            alert("Profile update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Avatar */}
                    <div className="flex flex-col items-center">
                        <img
                            src={user.avatar || "https://i.pravatar.cc/100"}
                            className="w-24 h-24 rounded-full mb-2"
                        />
                        <input
                            type="text"
                            name="avatar"
                            placeholder="Avatar Image URL"
                            value={user.avatar}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2"
                        />
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

                    {/* Bio */}
                    <textarea
                        name="bio"
                        placeholder="Short bio"
                        value={user.bio || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
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
                    <input
                        type="text"
                        name="gender"
                        placeholder="Gender"
                        value={user.gender || ""}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                    />

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
        </div>
    );
}