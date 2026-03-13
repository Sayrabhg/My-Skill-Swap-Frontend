import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    getProfile,
    getSkillsByUserId,
    getAllUsers,
    getAllSkills
} from "../../api/api";

export default function UserDashboard() {

    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(0);
    const [skills, setSkills] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                // Get logged in user
                const resUser = await getProfile();
                if (!resUser.data) return;

                const currentUser = resUser.data;
                setUser(currentUser);
                setTokens(currentUser.tokens || 0);

                const userId = currentUser.id;

                // Get current user skills
                const resSkills = await getSkillsByUserId(userId);
                const mySkills = resSkills.data || [];
                setSkills(mySkills);

                // Extract my offered & wanted skills
                const myOfferedSkills = mySkills.map(s => s.skillOffered);
                const myWantedSkills = mySkills.map(s => s.skillWanted);

                // Get all users
                const resUsers = await getAllUsers();
                const allUsers = resUsers.data || [];

                // Get all skills
                const resAllSkills = await getAllSkills();
                const allSkills = resAllSkills.data || [];

                // Smart matching
                const recommended = allUsers.filter((otherUser) => {

                    if (otherUser.id === userId) return false;

                    const otherUserSkills = allSkills.filter(
                        (skill) => skill.userId === otherUser.id
                    );

                    const otherOffers = otherUserSkills.map(s => s.skillOffered);

                    // show users who offer skills I want
                    const canTeachMe = otherOffers.some(skill =>
                        myWantedSkills.includes(skill)
                    );

                    return canTeachMe;
                });

                setRecommendations(recommended);

            } catch (error) {

                console.error("Error fetching dashboard data", error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading dashboard...</p>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}

            <div className="flex items-center justify-center gap-4 mb-8">

                <img
                    src={user?.avatar || "https://i.pravatar.cc/150"}
                    className="w-14 h-14 rounded-full"
                    alt={user?.name}
                />

                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome {user?.name}
                    </h1>

                    <p className="text-gray-500">
                        Your SkillSwap Dashboard
                    </p>
                </div>

            </div>


            {/* Stats Cards */}

            <div className="grid md:grid-cols-3 gap-6 mb-10">

                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Earned Tokens
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-600 mt-2">
                        {tokens}
                    </h2>
                </div>

                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Your Skills
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-600 mt-2">
                        {skills.length}
                    </h2>
                </div>

                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Skill Matches
                    </p>

                    <h2 className="text-4xl font-bold text-indigo-600 mt-2">
                        {recommendations.length}
                    </h2>
                </div>

            </div>


            {/* Skills Section */}

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">

                <h2 className="text-xl font-semibold mb-4">
                    Your Skills
                </h2>

                {skills.length ? (

                    <div className="flex flex-wrap gap-3">

                        {skills.map((skill) => (

                            <span
                                key={skill.id}
                                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                            >
                                {skill.skillOffered} → {skill.skillWanted}
                            </span>

                        ))}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        You have not added any skills yet.
                    </p>

                )}

            </div>


            {/* Recommended Matches */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

                <h2 className="text-xl font-semibold mb-6">
                    Recommended Skill Matches
                </h2>

                {recommendations.length ? (

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {recommendations.map((u) => (

                            <div
                                key={u.id}
                                className="border rounded-xl p-4 text-center hover:shadow-lg transition"
                            >

                                <img
                                    src={u.avatar || "https://i.pravatar.cc/150"}
                                    alt={u.name}
                                    className="w-16 h-16 rounded-full mx-auto mb-3"
                                />

                                <h3 className="font-semibold">
                                    {u.name}
                                </h3>

                                <p className="text-sm text-gray-500 mb-3">
                                    Perfect Skill Swap Match
                                </p>

                                <Button size="sm">
                                    View Profile
                                </Button>

                            </div>

                        ))}

                    </div>

                ) : (

                    <p className="text-gray-500">
                        No recommendations available.
                    </p>

                )}

            </div>

        </div>

    );
}