import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatRoomsPage from "./ChatRoomsPage";
import ChatUserPage from "./ChatUserPage";
import EmptyState from "./EmptyState";
import { Rocket } from "lucide-react";
import { getUserById } from "@/api/api";

const ChatDashboard = () => {
    const { roomId: urlRoomId, userId } = useParams(); // ✅ Only ChatDashboard uses this
    const navigate = useNavigate();
    const [otherUser, setOtherUser] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState(urlRoomId || null);

    // Sync with URL params
    useEffect(() => {
        if (urlRoomId) {
            setSelectedRoomId(urlRoomId);
        } else {
            setSelectedRoomId(null);
        }
    }, [urlRoomId]);

    const handleRoomSelect = (room) => {
        setSelectedRoomId(room.roomId);

        // ✅ PASS userId ALSO
        navigate(`/chats/${room.roomId}/${room.otherUserId}`);
    };

    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await getUserById(userId);

                console.log("✅ USER DATA:", res.data);

                setOtherUser({
                    name: res.data.name,
                    avatar: res.data.avatar || null,
                });
            } catch (err) {
                console.error("❌ Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [userId]);

    const handleBackToRooms = () => {
        setSelectedRoomId(null);
        navigate('/chats'); // ✅ Go back to rooms list
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* ================= LEFT SIDEBAR ================= */}
            <div
                className={`
                ${selectedRoomId ? "hidden md:flex" : "flex"} 
                flex-col w-full md:w-80 lg:w-96 xl:w-[420px]
                border-r border-slate-200 bg-white shadow-sm
            `}
            >
                {/* Header */}
                <div className="p-4 md:p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <div className="flex items-center justify-between text-left">

                        {/* 🔙 Back Button */}
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="mr-3 p-2 rounded-lg hover:bg-white/20 transition"
                            title="Back to Dashboard"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-full group-hover:scale-110 transition">
                                <Rocket className="text-white w-6 h-6" />
                            </div>
                        </button>

                        <div className="flex-1">
                            <h1 className="text-lg md:text-xl font-bold">My Skill Swap</h1>
                            <p className="text-indigo-100 text-xs md:text-sm mt-1">
                                Your conversations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Chat Rooms */}
                <div className="flex-1 overflow-hidden">
                    <ChatRoomsPage
                        onRoomSelect={handleRoomSelect}
                        selectedRoomId={selectedRoomId}
                    />
                </div>
            </div>

            {/* ================= RIGHT CHAT AREA ================= */}
            <div
                className={`
                ${selectedRoomId ? "flex" : "hidden md:flex"}
                flex-1 flex-col min-w-0 bg-[#f8fafc]
            `}
            >
                {selectedRoomId ? (
                    <ChatUserPage
                        roomId={selectedRoomId}
                        onBack={handleBackToRooms}
                    />
                ) : (
                    <EmptyState
                        title="Welcome to Messages"
                        description="Select a conversation to start chatting."
                        icon="message-circle"
                    />
                )}
            </div>
        </div>
    );
};

export default ChatDashboard;