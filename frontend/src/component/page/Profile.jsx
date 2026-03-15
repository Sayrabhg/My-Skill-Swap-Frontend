import { useEffect, useState } from "react";
import { getProfile } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pencil, Globe, Phone, AtSign, MapPin, Github, Linkedin } from "lucide-react";
import Loading from "./components/Loading";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getProfile();
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <Loading message="Loading profile..." />;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Cover Section */}
            <div className="relative h-56 w-full">
                <img
                    src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d"
                    alt="cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-30 flex items-end justify-start p-6">
                    <img
                        src={user.avatar || "https://i.pravatar.cc/150"}
                        alt="avatar"
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg -mb-22"
                    />
                    <div className="ml-6 -mb-12 text-white gap-2 grid">
                        <h1 className="text-sm lg:text-2xl text-white bg-[#83838342] p-2 rounded-lg shadow-xl font-bold">{user.name}</h1>
                        <p className="text-gray-900">{user.email}</p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-5xl mx-auto px-6 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Role</p>
                    <p className="font-semibold text-lg">{user.role}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Tokens</p>
                    <p className="font-semibold text-lg">{user.tokens}</p>
                </div>
                <div className="bg-white shadow rounded-xl p-4 text-center">
                    <p className="text-gray-500">Trust Score</p>
                    <p className="font-semibold text-lg">{user.trustScore}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 mt-6 grid md:grid-cols-2 gap-6">

                {/* Bio Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Bio</h3>
                        <Pencil size={18} className="text-gray-400 cursor-pointer" />
                    </div>
                    <p className="text-gray-600">{user.bio || "No bio provided."}</p>
                </div>

                {/* Skills Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Skills</h3>
                        <Pencil size={18} className="text-gray-400 cursor-pointer" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {user.skills?.length > 0 ? (
                            user.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                >
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p className="text-gray-500">No skills added.</p>
                        )}
                    </div>
                </div>

                {/* Contact & Info Card */}
                <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Contact & Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <div className="flex items-center gap-2"><Phone size={16} /> {user.mobileNumber || "Not provided"}</div>
                        <div className="flex items-center gap-2"><MapPin size={16} /> {user.address || "Not provided"}, {user.city || "-"}, {user.state || "-"}, {user.country || "-"}, {user.postalCode || "-"}</div>
                        <div className="flex items-center gap-2"><Globe size={16} /> {user.website || "Not provided"}</div>
                        <div className="flex items-center gap-2"><Linkedin size={16} /> {user.linkedin || "Not provided"}</div>
                        <div className="flex items-center gap-2"><Github size={16} /> {user.github || "Not provided"}</div>
                        <div className="flex items-center gap-2"><AtSign size={16} /> Gender: {user.gender || "Not provided"}</div>
                    </div>
                </div>

            </div>

            {/* Edit Profile Button */}
            <div className="mt-8 flex justify-center">
                <Link to="/profile/edit">
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Pencil size={16} />
                        Edit Profile
                    </Button>
                </Link>
            </div>

        </div>
    );
}