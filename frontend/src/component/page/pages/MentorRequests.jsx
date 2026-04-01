import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTeachingSessions, updateSessionStatus } from "../../../api/api";
import { Button } from "@/components/ui/button";
import Loading from "../components/Loading";

export default function MentorRequests() {
    const navigate = useNavigate();

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================= FETCH SESSIONS =================
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await getMyTeachingSessions();
                const sessionList = res.data || [];
                setSessions(sessionList);
            } catch (error) {
                console.error("Error fetching sessions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // ================= UPDATE SESSION STATUS =================
    const handleUpdateStatus = async (sessionId, status) => {
        try {
            await updateSessionStatus(sessionId, status);

            setSessions(prev =>
                prev.map(s => (s.id === sessionId ? { ...s, status } : s))
            );
        } catch (error) {
            console.error("Error updating session status:", error);
        }
    };

    if (loading) return <Loading message="Loading sessions..." />;

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-6xl mx-auto">

                <h2 className="text-3xl font-bold mb-8 text-gray-800">
                    Mentor Requests
                </h2>

                {sessions.length === 0 ? (
                    <p className="text-gray-400 text-center">
                        No sessions found
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {sessions.map(session => (
                            <div
                                key={session.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 border"
                            >

                                {/* SESSION INFO */}
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm">
                                        <span className="font-semibold text-indigo-600">
                                            Skill:
                                        </span>{" "}
                                        {session.skill || "Not selected"}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-semibold text-green-600">
                                            Time:
                                        </span>{" "}
                                        {session.scheduledTime
                                            ? new Date(session.scheduledTime).toLocaleString()
                                            : "Not scheduled"}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-semibold text-purple-600">
                                            Tokens:
                                        </span>{" "}
                                        {session.tokenAmount}
                                    </p>
                                </div>

                                {/* STATUS */}
                                <p className="text-xs mb-4">
                                    Status:
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

                                {/* ACTIONS */}
                                <div className="flex flex-wrap gap-2">
                                    {session.status === "pending" && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() =>
                                                    handleUpdateStatus(session.id, "active")
                                                }
                                            >
                                                Accept
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    handleUpdateStatus(session.id, "rejected")
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}

                                    {session.status === "active" && (
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700"
                                            onClick={() =>
                                                handleUpdateStatus(session.id, "completed")
                                            }
                                        >
                                            Complete
                                        </Button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}