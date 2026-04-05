import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userImg from "@/assets/no_user.jpg";
import {
    getUserByEmail,
    getSkillsByUserId,
    createChatRoom,
    getAcceptedChatRooms
} from "../../api/api";
import { Button } from "@/components/ui/button";
import Loading from "./components/Loading";
import { ArrowLeft } from "lucide-react";

export default function ViewProfile() {
    const { email } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🔥 CHAT STATES
    const [requestSent, setRequestSent] = useState(false);
    const [chatRoom, setChatRoom] = useState(null);
    const [roomLoading, setRoomLoading] = useState(false);

    // 🔥 FETCH USER + SKILLS
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserByEmail(email);
                const userData = res.data;
                setUser(userData);

                if (userData?.id) {
                    const skillRes = await getSkillsByUserId(userData.id);
                    setSkills(skillRes.data);

                    // ✅ Check if chat already exists
                    const roomsRes = await getAcceptedChatRooms();
                    const existingRoom = roomsRes.data.find(
                        (room) =>
                            room.userAId === userData.id ||
                            room.userBId === userData.id
                    );

                    if (existingRoom) {
                        setChatRoom(existingRoom);
                    }
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [email]);

    // 🔥 SEND REQUEST
    const handleSendRequest = async () => {
        try {
            setRoomLoading(true);

            const res = await createChatRoom(user.id);

            if (res.status === 200) {
                setRequestSent(true);
                alert("Chat request sent!");
            }

        } catch (err) {
            console.error(err);
            alert("Request already sent or failed.");
        } finally {
            setRoomLoading(false);
        }
    };

    // 🔥 GO TO CHAT
    const handleGoToChat = () => {
        if (chatRoom?.id) {
            navigate(`/chat/${chatRoom.id}`);
        }
    };

    // --- LOADING ---
    if (loading) {
        return <Loading message="Loading profile..." />;
    }

    if (!user) {
        return <div className="text-center mt-10">User not found</div>;
    }

    return (
        <div className="dark:bg-gray-800 relative py-8">
            <div className="absolute top-8 left-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-110 rounded-full shadow-md hover:bg-indigo-200 transition-all"
                >
                    <ArrowLeft size={20} />
                </button>
            </div>
            <div className="max-w-5xl mx-auto px-4">

                {/* PROFILE HEADER */}
                <div className="bg-indigo-100 dark:bg-gray-700 shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                    <img
                        src={user.avatar || userImg}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border border-white border-3 object-cover"
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
                    </div>

                    {/* 🔥 CHAT BUTTON LOGIC */}
                    <div className="flex flex-col gap-2">

                        {/* ✅ If chat already accepted */}
                        {chatRoom ? (
                            <Button
                                onClick={handleGoToChat}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Go to Chat
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSendRequest}
                                disabled={requestSent || roomLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {roomLoading
                                    ? "Sending..."
                                    : requestSent
                                        ? "Request Sent"
                                        : "Message / Request Chat"}
                            </Button>
                        )}

                    </div>
                </div>

                {/* SKILLS */}
                <div className="py-8">
                    <h3 className="text-xl font-semibold mb-4">Skill Exchange</h3>

                    {skills.length ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {skills.map((skill) => (
                                <div key={skill.id} className="border rounded-xl p-5 bg-white dark:bg-gray-700 shadow">
                                    <div className="grid gap-2">
                                        <p><b className="text-green-500">Offers :</b> {skill.skillOffered}</p>
                                        <p><b className="text-blue-500">Wants :</b> {skill.skillWanted}</p>
                                    </div>

                                    <Button
                                        className="w-full mt-4 dark:text-white cursor-pointer"
                                        onClick={() =>
                                            navigate(`/request/${user.id}/${skill.id}`)
                                        }
                                    >
                                        Request Swap
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No skills added</p>
                    )}
                </div>
            </div>
        </div>
    );
}