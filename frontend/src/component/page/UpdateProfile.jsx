import { useEffect, useState } from "react";
import { updateProfile } from "../../api/api";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {

    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
        bio: ""
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
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res = await updateProfile(user);

            localStorage.setItem(
                "user",
                JSON.stringify(res.data)
            );

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

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

                <h2 className="text-2xl font-bold mb-6">
                    Update Profile
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Avatar */}

                    <div className="flex flex-col items-center">

                        <img
                            src={user.avatar || "https://i.pravatar.cc/100"}
                            className="w-20 h-20 rounded-full mb-2"
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

                    {/* Email */}

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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >

                        {loading ? "Updating..." : "Update Profile"}

                    </Button>

                </form>

            </div>

        </div>

    );

}