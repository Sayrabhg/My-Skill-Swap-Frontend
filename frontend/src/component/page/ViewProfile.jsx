import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getUserByEmail,
    getSkillsByUserId,
    createChatRoom,
    getAcceptedChatRooms
} from "../../api/api";
import { Button } from "@/components/ui/button";

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
        return <div className="text-center mt-10">Loading Profile...</div>;
    }

    if (!user) {
        return <div className="text-center mt-10">User not found</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-10 px-4">

            {/* PROFILE HEADER */}
            <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                <img
                    src={user.avatar || "https://i.pravatar.cc/150"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full"
                />

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-gray-500">{user.email}</p>
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
            <div className="my-8">
                <h3 className="text-xl font-semibold mb-4">Skill Exchange</h3>

                {skills.length ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {skills.map((skill) => (
                            <div key={skill.id} className="border rounded-xl p-5 bg-white">
                                <p><b>Offers:</b> {skill.skillOffered}</p>
                                <p><b>Wants:</b> {skill.skillWanted}</p>

                                <Button
                                    className="w-full mt-4"
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
    );
}