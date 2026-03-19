import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { sendMessage, getChatMessages, getUserById } from "../../../../api/api";
import { connectSocket, sendTyping, disconnectSocket } from "../../../../api/socket";
import { ChevronDown, Send } from "lucide-react";
import "./Scrollbar.css";

export default function ChatPage() {

    const { roomId } = useParams();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherTyping, setOtherTyping] = useState(false);
    const [userMap, setUserMap] = useState({});
    const [showScrollBtn, setShowScrollBtn] = useState(false);

    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const firstLoadRef = useRef(true);
    const wasNearBottomRef = useRef(true);

    // ✅ SOCKET
    useEffect(() => {
        if (!roomId) return;

        connectSocket(roomId, (data) => {
            console.log("Typing event:", data); // 🔍 debug

            // ✅ FIX: check sender properly
            if (data.userId !== userId) {
                setOtherTyping(data.typing);

                // auto hide typing after delay
                if (data.typing) {
                    setTimeout(() => {
                        setOtherTyping(false);
                    }, 1500);
                }
            }
        });

        return () => disconnectSocket();
    }, [roomId, userId]);

    // ✅ LOAD USER NAMES
    const loadUserNames = async (msgs) => {
        const uniqueUserIds = [...new Set(msgs.map(m => m.senderId))];

        const usersData = await Promise.all(
            uniqueUserIds.map(async (id) => {
                try {
                    const res = await getUserById(id);
                    return {
                        id,
                        name: res.data.user.name,
                        avatar: res.data.user.avatar
                    };
                } catch {
                    return { id, name: "Unknown" };
                }
            })
        );

        const map = {};
        usersData.forEach(u => (map[u.id] = u));
        setUserMap(map);
    };

    // ✅ LOAD MESSAGES
    const loadMessages = async () => {
        if (!roomId) return;

        try {
            const res = await getChatMessages(roomId);
            const msgs = res.data || [];

            setMessages(msgs);
            loadUserNames(msgs);

        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [roomId]);

    // ✅ POLLING
    useEffect(() => {
        if (!roomId) return;

        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, [roomId]);

    // ✅ TRACK SCROLL POSITION
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const nearBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight < 100;

            wasNearBottomRef.current = nearBottom;
            setShowScrollBtn(!nearBottom);
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ SMART AUTO SCROLL
    useEffect(() => {
        if (!containerRef.current) return;

        const scrollToBottom = (behavior = "auto") => {
            requestAnimationFrame(() => {
                bottomRef.current?.scrollIntoView({ behavior });
            });
        };

        if (firstLoadRef.current) {
            // 🔥 First time open → always go bottom
            scrollToBottom("auto");
            firstLoadRef.current = false;
        } else if (wasNearBottomRef.current) {
            // 🔥 Only scroll if user was near bottom
            scrollToBottom("smooth");
        }

    }, [messages]);

    // ✅ SEND MESSAGE
    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            await sendMessage({
                roomId,
                message: text.trim()
            });

            sendTyping(roomId, userId, false);
            setText("");
            loadMessages();

        } catch (err) {
            console.error("Send failed:", err);
        }
    };

    const otherUserId =
        messages.find(m => m.senderId !== userId)?.senderId ||
        Object.keys(userMap).find(id => id !== userId);

    const otherUser = userMap[otherUserId] || {};

    return (
        <div className="flex flex-col h-screen bg-gray-100 relative">

            {/* HEADER */}
            <div className="flex items-center gap-3 p-4 bg-white border-b shadow-sm">
                <img
                    src={
                        otherUser.avatar ||
                        `https://ui-avatars.com/api/?name=${otherUser.name || "User"}`
                    }
                    className="w-10 h-10 rounded-full"
                />
                <div className="text-left">
                    <p className="font-semibold">
                        {otherUser.name || "User"}
                    </p>
                    <p className="text-xs text-green-500">Online</p>
                </div>
            </div>

            {/* MESSAGES */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
            >
                {messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm">
                        No messages yet
                    </p>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === userId
                            ? "justify-end"
                            : "justify-start"
                            }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-xl max-w-xs text-left text-sm shadow ${msg.senderId === userId
                                ? "bg-primary text-white"
                                : "bg-white"
                                }`}
                        >
                            {msg.message}
                            <div className="text-xs text-right opacity-70 mt-1">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}

                <div ref={bottomRef}></div>
            </div>

            {/* 🔽 SCROLL BUTTON */}
            {showScrollBtn && (
                <button
                    onClick={() =>
                        bottomRef.current?.scrollIntoView({
                            behavior: "smooth"
                        })
                    }
                    className="absolute bottom-24 right-4 bg-primary text-white p-1 rounded-full shadow"
                >
                    <ChevronDown className="w-7 h-6" />
                </button>
            )}

            {/* TYPING */}
            {otherTyping && (
                <div className="flex items-center gap-2 px-4 pb-2 text-sm text-green-600">

                    {/* Animated dots */}
                    <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>

                    <span className="italic font-medium">
                        typing...
                    </span>
                </div>
            )}
            {/* INPUT */}
            <div className="p-3 bg-white border-t flex gap-2">
                <input
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);

                        // start typing
                        sendTyping(roomId, userId, true);

                        // clear previous timeout
                        if (typingTimeoutRef.current) {
                            clearTimeout(typingTimeoutRef.current);
                        }

                        // stop typing after delay
                        typingTimeoutRef.current = setTimeout(() => {
                            sendTyping(roomId, userId, false);
                        }, 1200);
                    }}
                    onKeyDown={(e) =>
                        e.key === "Enter" && handleSend()
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                    placeholder="Type a message..."
                />

                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="bg-primary text-white px-4 rounded-lg disabled:opacity-50"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}