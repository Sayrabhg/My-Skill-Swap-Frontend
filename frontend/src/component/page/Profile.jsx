import { useEffect, useState } from "react";
import { getProfile } from "../../api/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

    /* Loader */

    if (loading) return <Loading message="Loading profile..." />;

    return (

        <div className="min-h-screen bg-gray-50 flex justify-center p-8">

            <div className="bg-white shadow-xl h-fit rounded-xl p-8 w-full max-w-xl">

                {/* Avatar */}

                <div className="flex flex-col items-center mb-6">

                    <img
                        src={user.avatar || "https://i.pravatar.cc/120"}
                        alt="profile"
                        className="w-24 h-24 rounded-full border-4 border-indigo-500"
                    />

                    <h2 className="text-2xl font-bold mt-3">
                        {user.name}
                    </h2>

                    <p className="text-gray-500">
                        {user.email}
                    </p>

                </div>

                {/* Bio */}

                <div className="mb-6">

                    <h3 className="font-semibold text-lg mb-2">
                        Bio
                    </h3>

                    <p className="text-gray-600">
                        {user.bio || "No bio added"}
                    </p>

                </div>

                {/* Skills */}

                <div className="mb-6">

                    <h3 className="font-semibold text-lg mb-2">
                        Skills
                    </h3>

                    <div className="flex flex-wrap gap-2">

                        {user.skills?.map((skill, i) => (

                            <span
                                key={i}
                                className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                </div>

                {/* Button */}

                <Link to="/profile/edit">

                    <Button className="w-full">
                        Edit Profile
                    </Button>

                </Link>

            </div>

        </div>

    );

}