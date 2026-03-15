import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserByEmail, getSkillsByUserId } from "../../api/api";
import { Button } from "@/components/ui/button";

export default function ViewProfile() {

    const { email } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await getUserByEmail(email);
                const userData = res.data;

                setUser(userData);

                if (userData?.id) {

                    const skillRes = await getSkillsByUserId(userData.id);
                    setSkills(skillRes.data);

                }

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchUser();

    }, [email]);

    /* ---------------- LOADING SKELETON ---------------- */

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto mt-10 px-4 animate-pulse">

                {/* Profile Header Skeleton */}
                <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                    <div className="w-24 h-24 rounded-full bg-gray-300"></div>

                    <div className="space-y-3 text-center md:text-left">
                        <div className="h-6 w-40 bg-gray-300 rounded"></div>
                        <div className="h-4 w-52 bg-gray-200 rounded"></div>
                        <div className="h-5 w-28 bg-gray-200 rounded-full"></div>
                    </div>

                </div>

                {/* Skills Skeleton */}

                <div className="my-8">

                    <div className="h-6 w-40 bg-gray-300 rounded mb-6"></div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {[1, 2, 3].map((i) => (

                            <div
                                key={i}
                                className="border rounded-xl p-5 bg-white space-y-3"
                            >

                                <div className="h-4 w-16 bg-gray-200 rounded"></div>

                                <div className="h-4 w-32 bg-gray-300 rounded"></div>

                                <div className="h-4 w-28 bg-gray-200 rounded"></div>

                                <div className="h-8 w-full bg-gray-300 rounded"></div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>
        );
    }

    /* ---------------- MAIN UI ---------------- */

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">

            {/* PROFILE HEADER */}

            <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                <img
                    src={user.avatar || "https://i.pravatar.cc/150"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full"
                />

                <div className="text-center md:text-left">

                    <h2 className="text-2xl font-bold">
                        {user.name}
                    </h2>

                    <p className="text-gray-500">
                        {user.email}
                    </p>

                    <div className="mt-3">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full">
                            SkillSwap Member
                        </span>
                    </div>

                </div>

            </div>

            {/* SKILLS SECTION */}

            <div className="my-8">

                <h3 className="text-xl font-semibold mb-4">
                    Skill Exchange
                </h3>

                {skills.length ? (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {skills.map((skill) => (

                            <div
                                key={skill.id}
                                className="border rounded-xl p-5 hover:shadow-lg transition bg-white"
                            >

                                <div className="flex justify-between items-center mb-3">

                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {skill.category}
                                    </span>

                                </div>

                                <div className="space-y-2">

                                    <p className="text-sm">
                                        <span className="font-semibold text-indigo-600">
                                            Offers:
                                        </span>{" "}
                                        {skill.skillOffered}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-semibold text-green-600">
                                            Wants:
                                        </span>{" "}
                                        {skill.skillWanted}
                                    </p>

                                </div>

                                <Button
                                    className="w-full mt-4"
                                    size="sm"
                                    onClick={() => navigate(`/request/${user.id}/${skill.id}`)}
                                >
                                    Request Swap
                                </Button>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-gray-400">
                        No skills added
                    </p>

                )}

            </div>

        </div>
    );
}