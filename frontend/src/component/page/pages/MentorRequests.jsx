import { useEffect, useState } from "react";
import { getMyTeachingSessions, updateSessionStatus, createChatRoom } from "../../../api/api";
import { Button } from "@/components/ui/button";
import Loading from "../components/Loading";
import ChatDialog from "./ChatPage";

export default function MentorSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chatOpen, setChatOpen] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [createdRooms, setCreatedRooms] = useState({});

    // Create chat room and open chat
    const createRoomAndOpenChat = async (session) => {
        try {
            const roomData = {
                swapSessionId: session.id,
                userAId: session.user1Id, // learner
                userBId: session.user2Id  // mentor
            }

            console.log("UserId:", localStorage.getItem("userId"));
            console.log("Session:", session);
            console.log("Payload for room:", {
                swapSessionId: session.id,
                userAId: session.user1Id,
                userBId: session.user2Id,
            });

            console.log("Logged-in userId:", localStorage.getItem("userId"));
            console.log("session.user1Id (learner):", session.user1Id);
            console.log("session.user2Id (mentor):", session.user2Id);

            console.log("Creating room with:", roomData);

            const res = await createChatRoom(roomData);

            if (res?.data?.id) {
                console.log("Room created:", res.data);

                // Cache created room
                setCreatedRooms(prev => ({ ...prev, [session.id]: res.data.id }));

                // Open chat
                setRoomId(res.data.id);
                setChatOpen(true);
            } else {
                console.warn("No room ID returned:", res.data);
                alert("Failed to create chat room. No ID returned from server.");
            }
        } catch (error) {
            console.error("Failed to create chat room:", error.response || error);
            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
            }
            alert(error?.response?.data || "Failed to create chat room");
        }
    };

    // Fetch sessions for logged-in mentor
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await getMyTeachingSessions();
                setSessions(res.data || []);
            } catch (error) {
                console.error("Failed to fetch sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // Update session status
    const handleUpdateStatus = async (sessionId, status) => {
        try {
            await updateSessionStatus(sessionId, status);
            setSessions(prev =>
                prev.map(s => (s.id === sessionId ? { ...s, status } : s))
            );
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    if (loading) return <Loading message="Loading sessions..." />;

    return (
        <div className="min-h-screen max-w-5xl mx-auto m-10 px-4">
            <h2 className="text-2xl font-bold mb-6">Skill Swap Sessions</h2>

            {sessions.length === 0 ? (
                <p className="text-gray-400">No sessions found</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
                        >
                            <div className="space-y-2 mb-3">
                                <p className="text-sm">
                                    <span className="font-semibold text-indigo-600">Skill:</span>{" "}
                                    {session.skill || "Not selected"}
                                </p>

                                <p className="text-sm">
                                    <span className="font-semibold text-green-600">Scheduled Time:</span>{" "}
                                    {session.scheduledTime
                                        ? new Date(session.scheduledTime).toLocaleString()
                                        : "Not scheduled"}
                                </p>

                                <p className="text-sm">
                                    <span className="font-semibold text-purple-600">Tokens:</span>{" "}
                                    {session.tokenAmount}
                                </p>
                            </div>

                            <p className="text-xs mb-4">
                                Status:{" "}
                                <span
                                    className={`ml-2 font-semibold ${session.status === "active"
                                        ? "text-green-600"
                                        : session.status === "rejected"
                                            ? "text-red-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {session.status}
                                </span>
                            </p>

                            <div className="flex gap-2">
                                {session.status === "pending" && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => handleUpdateStatus(session.id, "active")}
                                        >
                                            Accept
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleUpdateStatus(session.id, "rejected")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {session.status === "active" && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            onClick={() => handleUpdateStatus(session.id, "completed")}
                                        >
                                            Complete
                                        </Button>

                                        {createdRooms[session.id] ? (
                                            <Button
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                                onClick={() => {
                                                    setRoomId(createdRooms[session.id]);
                                                    setChatOpen(true);
                                                }}
                                            >
                                                Chat
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700"
                                                onClick={() => createRoomAndOpenChat(session)}
                                            >
                                                Create Room
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ChatDialog
                open={chatOpen}
                setOpen={setChatOpen}
                roomId={roomId}
                userId={localStorage.getItem("userId")}
            />
        </div>
    );
}