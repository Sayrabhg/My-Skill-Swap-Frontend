import { useState, useEffect } from "react";
import { getMessages } from "../../../api/api";

export default function ChatRoomFetch() {
    const [roomId, setRoomId] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        if (!roomId) return alert("Enter a room ID!");
        setLoading(true);
        try {
            const res = await getMessages(roomId);
            setMessages(res.data || []);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            alert("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Join Chat Room</h2>

            <div className="flex mb-4 gap-2">
                <input
                    type="text"
                    placeholder="Enter Room ID"
                    className="flex-1 border rounded px-3 py-2"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                    onClick={fetchMessages}
                >
                    Fetch Messages
                </button>
            </div>

            {loading && <p className="text-gray-500">Loading messages...</p>}

            <div className="max-h-80 overflow-y-auto border rounded p-2">
                {messages.length === 0 ? (
                    <p className="text-gray-400 text-sm">No messages yet.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="mb-2">
                            <p className="text-xs text-gray-500">{msg.senderId}</p>
                            <p className="bg-gray-100 p-2 rounded">{msg.text}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}