import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
    getProfile,
    getSkillsByUserId,
    getAllUsers,
    getAllSkills,
    deleteSkill
} from "../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function UserDashboard() {

    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(0);
    const [skills, setSkills] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [status, setStatus] = useState("success");

    const handleDelete = async (skillId) => {

        try {

            await deleteSkill(skillId);

            setSkills((prev) =>
                prev.filter((skill) => skill.id !== skillId)
            );

            setDialogMessage("Skill deleted successfully 🗑️");
            setStatus("success");
            setDialogOpen(true);

        } catch (error) {

            console.error("Delete failed", error);

            setDialogMessage("Failed to delete skill ❌");
            setStatus("error");
            setDialogOpen(true);

        }

    };

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
                // Smart matching
                const recommended = allUsers.filter((otherUser) => {

                    if (otherUser.id === userId) return false;

                    const otherUserSkills = allSkills.filter(
                        (skill) => skill.userId === otherUser.id
                    );

                    const otherOffers = otherUserSkills.map(s => s.skillOffered);
                    const otherWants = otherUserSkills.map(s => s.skillWanted);

                    // Condition 1: They offer what I want
                    const canTeachMe = otherOffers.some(skill =>
                        myWantedSkills.includes(skill)
                    );

                    // Condition 2: I offer what they want
                    const iCanTeachThem = myOfferedSkills.some(skill =>
                        otherWants.includes(skill)
                    );

                    // Perfect swap match
                    return canTeachMe && iCanTeachThem;

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
            <div className="min-h-screen bg-gray-50 p-6 animate-pulse">

                {/* Header Skeleton */}
                <div className="flex items-center justify-center gap-4 mb-8">

                    <div className="w-14 h-14 rounded-full bg-gray-300"></div>

                    <div className="space-y-2">
                        <div className="h-6 w-40 bg-gray-300 rounded"></div>
                        <div className="h-4 w-28 bg-gray-200 rounded"></div>
                    </div>

                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">

                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white border rounded-xl p-6 shadow-sm space-y-3"
                        >
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-8 w-16 bg-gray-300 rounded"></div>
                        </div>
                    ))}

                </div>

                {/* Skills Section Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-10">

                    <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>

                    <div className="flex flex-wrap gap-3">

                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-8 w-28 bg-gray-200 rounded-full"
                            ></div>
                        ))}

                    </div>

                </div>

                {/* Recommendations Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="h-6 w-52 bg-gray-300 rounded mb-6"></div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="border rounded-xl p-4 text-center space-y-3"
                            >

                                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto"></div>

                                <div className="h-4 w-20 bg-gray-300 rounded mx-auto"></div>

                                <div className="h-3 w-32 bg-gray-200 rounded mx-auto"></div>

                                <div className="h-8 w-24 bg-gray-300 rounded mx-auto"></div>

                            </div>
                        ))}

                    </div>

                </div>

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>SkillSwap Skills</DialogTitle>

                        <DialogDescription
                            className={`text-base mt-2 font-medium ${status === "success"
                                ? "text-green-500"
                                : "text-red-500"
                                }`}
                        >
                            {dialogMessage}
                        </DialogDescription>

                    </DialogHeader>
                </DialogContent>
            </Dialog>

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

                <div className="flex flex-wrap gap-3 lg:justify-between justify-center">
                    {skills.length ? (

                        <div className="flex flex-wrap gap-3 justify-center">

                            {skills.map((skill) => (

                                <div
                                    key={skill.id}
                                    className="relative group"
                                >

                                    <span
                                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        {skill.skillOffered} → {skill.skillWanted}
                                    </span>

                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-gray-500" style={{webkitTextStrokeWidth:'medium'}}>
                            You have not added any skills yet.
                        </p>

                    )}

                    <Button onClick={() => navigate("/add-skill")}>
                        Add Skill
                    </Button>

                </div>

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

                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/profile/${u.email}`)}
                                >
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