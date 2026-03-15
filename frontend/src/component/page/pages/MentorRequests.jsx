import { useEffect, useState } from "react";
import {
    getSwapSessionsByMentorId,
    updateSwapSessionStatus,
    getProfile
} from "../../../api/api";
import { Button } from "@/components/ui/button";
import Loading from "../components/Loading";

export default function MentorSessions() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {

            try {

                const resUser = await getProfile();
                const mentor = resUser.data;

                const res = await getSwapSessionsByMentorId(mentor.id);

                setSessions(res.data || []);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);

    const updateStatus = async (sessionId, status) => {

        try {

            await updateSwapSessionStatus(sessionId, status);

            setSessions(prev =>
                prev.map(s =>
                    s.id === sessionId
                        ? { ...s, status }
                        : s
                )
            );

        } catch (error) {

            console.error("Update failed:", error);

        }

    };

    if (loading) return <Loading message="Loading sessions..." />;

    return (

        <div className="min-h-screen max-w-5xl mx-auto m-10 px-4">

            <h2 className="text-2xl font-bold mb-6">
                Skill Swap Sessions
            </h2>

            {sessions.length === 0 ? (

                <p className="text-gray-400">
                    No sessions found
                </p>

            ) : (

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {sessions.map((session) => (

                        <div
                            key={session.id}
                            className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
                        >

                            <div className="space-y-2 mb-3">

                                <p className="text-sm">
                                    <span className="font-semibold text-indigo-600">
                                        Skill:
                                    </span>{" "}
                                    {session.skill || "Not selected"}
                                </p>

                                <p className="text-sm">
                                    <span className="font-semibold text-green-600">
                                        Scheduled Time:
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

                            <p className="text-xs mb-4">
                                Status:
                                <span
                                    className={`ml-2 font-semibold 
                                    ${session.status === "ACCEPTED"
                                            ? "text-green-600"
                                            : session.status === "REJECTED"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {session.status}
                                </span>
                            </p>

                            <div className="flex gap-2">

                                {session.status === "PENDING" && (
                                    <>
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => updateStatus(session.id, "ACCEPTED")}
                                        >
                                            Accept
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => updateStatus(session.id, "REJECTED")}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {session.status === "ACCEPTED" && (
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() => updateStatus(session.id, "COMPLETED")}
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

    );
}