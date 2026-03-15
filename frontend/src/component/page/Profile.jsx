import { useEffect, useState } from "react";
import { getProfile } from "../../api/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import Loading from "./components/Loading";

export default function Profile() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await getProfile();
                setUser(res.data);

                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data)
                );

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

            {/* Cover Banner */}
            <div className="h-64 w-full relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Main Container */}
            <div className="max-w-5xl mx-auto px-6">

                {/* Profile Header */}
                <div className="flex items-center gap-6 -mt-16">
                    <img
                        src={user.avatar || "https://i.pravatar.cc/150"}
                        className="w-32 h-32 z-0 rounded-full border-4 border-white shadow-lg"
                    />

                    <div className="z-0 grid gap-4">
                        <h2 className="text-sm lg:text-2xl text-white bg-[#83838342] p-2 rounded-lg shadow-xl font-bold">
                            {user.name}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>

                {/* Profile Completeness */}
                <div className="bg-white rounded-xl shadow p-6 mt-8">
                    <div className="flex justify-between mb-2 text-sm">
                        <span className="font-medium">Profile Completeness</span>
                        <span>100%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full w-full"></div>
                    </div>
                </div>

                {/* Profile Cards */}
                <div className="grid md:grid-cols-2 gap-6 mt-8">

                    {/* Bio */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Bio</h3>
                            <Pencil size={16} className="text-gray-500 cursor-pointer" />
                        </div>
                        <p className="text-gray-600">{user.bio || "No bio added"}</p>
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Skills</h3>
                            <Pencil size={16} className="text-gray-500 cursor-pointer" />
                        </div>
                        <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
                            {user.skills?.length > 0 ? (
                                user.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No skills added</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* ✅ Edit Profile Button at the bottom */}
                <div className="mt-8 flex justify-center">
                    <Link to="/profile/edit">
                        <Button className="flex gap-2 items-center">
                            <Pencil size={16} />
                            Edit Profile
                        </Button>
                    </Link>
                </div>

            </div>
        </div>

    );

}