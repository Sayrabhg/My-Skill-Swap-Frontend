import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, ArrowLeft, Smile, Trash2, Phone, Video, Paperclip, X, Settings, UserCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getMessages, getUserById, deleteForEveryone, deleteForMe } from "@/api/api";
import {
    connectSocket,
    sendMessage,
    sendTyping,
    disconnectSocket,
    sendDeleteMessage
} from "@/api/socket";

const EMOJI_CATEGORIES = [
    { name: "Recent", emojis: ["😊", "😂", "👍", "❤️", "🔥", "✨", "🙌", "🤔"] },
    { name: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😅", "😆", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😍", "🥰", "😘"] },
    { name: "Gestures", emojis: ["👍", "👎", "👌", "🤌", "✌️", "🤞", "🤟", "🤘"] },
    { name: "Hearts", emojis: ["❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "💔", "❣️", "💕"] },
];

const ChatUserPage = ({ roomId, onBack }) => {
    const { roomId: urlRoomId, userId } = useParams();
    const finalRoomId = roomId || urlRoomId;
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Current user

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [otherTyping, setOtherTyping] = useState(false);
    const typingTimeout = useRef(null);
    const [otherUser, setOtherUser] = useState({ name: "User", avatar: null });

    const [showEmoji, setShowEmoji] = useState(false);
    const [activeEmojiTab, setActiveEmojiTab] = useState("Smileys");
    const buttonRef = useRef(null);
    const emojiRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    const [openMenuId, setOpenMenuId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const mobileMenuRef = useRef(null);
    const headerMenuRef = useRef(null);   // ✅ for profile dropdown
    const messageMenuRef = useRef(null);  // ✅ for message menu
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const currentUserId = storedUser ? JSON.parse(storedUser).id : null;


    // 1️⃣ From URL
    useEffect(() => {
        if (!userId) return;

        const fetchUser = async () => {
            try {
                const res = await getUserById(userId);

                console.log("✅ USER:", res.data);

                setOtherUser({
                    name: res.data.user?.name,
                    avatar: res.data.user?.avatar || null,
                });

            } catch (err) {
                console.error("❌ Failed to fetch user:", err);
            }
        };

        fetchUser();
    }, [userId]);

    // 👇 OUTSIDE CLICK HANDLER
    useEffect(() => {
        const handleClickOutside = (e) => {

            // ✅ Close header dropdown
            if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
                setShowMenu(false);
            }

            // ✅ Close message menu
            if (messageMenuRef.current && !messageMenuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // ✅ Fetch old messages
    const fetchMessages = useCallback(async () => {
        if (!finalRoomId) return;
        try {
            setLoading(true);
            const res = await getMessages(finalRoomId);

            const normalized = (res.data || []).map((m) => ({
                ...m,
                id: m.id || m.chatId, // ✅ unify id
            }));

            setMessages(normalized);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [finalRoomId]);

    // ✅ Socket connection with REALTIME DELETE
    useEffect(() => {
        if (!finalRoomId) return;

        connectSocket(
            finalRoomId,
            (typingData) => {
                if (typingData.userId !== currentUserId) {
                    setOtherTyping(typingData.typing);
                }
            },

            // ✅ new message
            (newMessage) => {
                setMessages((prev) => [...prev, newMessage]);
            },

            // ✅ delete message (REALTIME)
            (deleteData) => {
                setMessages((prev) =>
                    prev.map((msg) => {
                        if (msg.id !== deleteData.chatId) return msg;

                        // ✅ delete for everyone
                        if (deleteData.type === "everyone") {
                            return {
                                ...msg,
                                deletedForEveryone: true
                            };
                        }

                        // ✅ delete for me
                        if (deleteData.type === "me") {
                            return {
                                ...msg,
                                deletedForUsers: Array.from(
                                    new Set([...(msg.deletedForUsers || []), deleteData.userId])
                                )
                            };
                        }

                        return msg;
                    })
                );
            }
        );

        return () => disconnectSocket();
    }, [finalRoomId]);

    // ✅ Load initial messages
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    useEffect(() => {
        setOtherUser({ name: "User", avatar: null }); // reset header
    }, [finalRoomId]);

    // ✅ Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ✅ Send message
    const handleSend = () => {
        if (!text.trim() || !user?.id || !roomId || !currentUserId) return;

        const messageData = {
            roomId: finalRoomId,
            senderId: user.id, // ✅ Real user ID
            message: text.trim(),
        };

        sendMessage(messageData);
        setText("");
        sendTyping(roomId, false);
        setShowEmoji(false);

        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleTyping = (value) => {
        setText(value);

        if (!roomId || !currentUserId) return;

        sendTyping(roomId, true);

        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            sendTyping(roomId, false);
        }, 1000);

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    };

    // ✅ REALTIME DELETE - Both sides + Save to DB
    const handleDelete = async (id, type) => {
        try {
            // ✅ 1. API (DB)
            if (type === "everyone") {
                await deleteForEveryone(id);
            } else {
                await deleteForMe(id);
            }

            // ✅ 2. SOCKET (REALTIME)
            sendDeleteMessage(id, finalRoomId, type);

        } catch (err) {
            console.error(err);
        }
    };

    // ================= OUTSIDE CLICK =================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setShowEmoji(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ================= FILE ATTACH =================
    const handleFile = () => {
        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.onchange = (e) => console.log("Selected file:", e.target.files[0]);
        inputFile.click();
    };

    const addEmoji = (emoji) => setText((prev) => prev + emoji);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="animate-spin h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full shadow-lg" />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col h-full bg-gradient-to-br from-gray-50 to-slate-100">

            {/* 🔷 HEADER */}
            <div className="flex items-center gap-4 px-5 py-4 bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-10">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all md:hidden flex-shrink-0"
                        title="Back to chats"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}

                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                        src={otherUser.avatar || `https://ui-avatars.com/api/?name=${otherUser.name}`}
                        alt={otherUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1 text-left">
                        <h2 className="font-bold text-slate-800 text-lg truncate">{otherUser.name}</h2>
                        <p className="text-sm text-emerald-600 font-medium flex items-center gap-1">
                            Online
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => navigate("/maintenance")}
                        className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all hidden md:flex">
                        <Phone size={18} />
                    </button>
                    <button
                        onClick={() => navigate("/maintenance")}
                        className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all hidden lg:flex">
                        <Video size={18} />
                    </button>
                    <div className="relative" ref={headerMenuRef}>
                        {/* 🔘 Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(prev => !prev);
                            }}
                            className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 5v.01M12 12v.01M12 19v.01M13 11a1 1 0 110-2 1 1 0 010 2zm-2 0a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>

                        {/* 📂 Dropdown */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 py-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">

                                {/* 📱 Mobile Only Options */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() => {
                                            navigate("/maintenance");
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex gap-2 text-left px-4 py-2 text-sm hover:bg-slate-50"
                                    >
                                        <Phone size={18} /> Call
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/maintenance");
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex gap-2 text-left px-4 py-2 text-sm hover:bg-slate-50"
                                    >
                                        <Video size={18} /> Video Call
                                    </button>
                                </div>

                                {/* 👤 Profile */}
                                <button
                                    onClick={() => {
                                        navigate(`/user-profile/${userId}`);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex gap-2 text-left px-4 py-2 text-sm hover:bg-slate-50"
                                >
                                    <UserCircle2 size={18} /> View Profile
                                </button>

                                {/* ⚙️ Settings */}
                                <button
                                    onClick={() => {
                                        navigate(`/maintenance`);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex gap-2 text-left px-4 py-2 text-sm hover:bg-slate-50"
                                >
                                    <Settings size={18} /> Settings
                                </button>

                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔷 MESSAGES */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-24 text-slate-500">
                        <div className="w-24 h-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl flex items-center justify-center mb-6 border border-slate-200/50">
                            <Smile className="w-12 h-12 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No messages yet</h3>
                        <p className="text-sm opacity-75 max-w-md mx-auto leading-relaxed">
                            Start the conversation! Messages are end-to-end encrypted.
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        const messageId = msg.id || msg._id || msg.chatId;

                        return (
                            <div
                                key={messageId}
                                className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-200`}
                            >
                                <div
                                    className={`group relative max-w-[80%] p-4 rounded-2xl shadow-lg transition-all backdrop-blur-sm z-0 border ${isMe
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400/50 rounded-br-sm ml-4"
                                        : "bg-white/90 text-slate-900 border-slate-200/50 rounded-bl-sm mr-4 hover:shadow-xl"
                                        }`}
                                >

                                    {/* 🔥 THREE DOT MENU */}
                                    {isMe && !msg.deletedForEveryone && (
                                        <div className="absolute top-2 right-2" ref={messageMenuRef}>
                                            <button
                                                onClick={() =>
                                                    setOpenMenuId(
                                                        openMenuId === messageId ? null : messageId
                                                    )
                                                }
                                                className="absolute opacity-0 right-1 group-hover:opacity-100"
                                            >
                                                ⋮
                                            </button>

                                            {openMenuId === messageId && (
                                                <div className="absolute overflow-hidden right-3 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 z-5">
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(messageId, "me");
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                                                    >
                                                        Delete for me
                                                    </button>

                                                    <button
                                                        onClick={() => {
                                                            handleDelete(messageId, "everyone");
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                                                    >
                                                        Delete for everyone
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* MESSAGE */}
                                    <div className="break-words leading-relaxed text-sm pr-8">
                                        {msg.deletedForEveryone ? (
                                            <i className="text-gray-300 text-xs">
                                                This message was deleted
                                            </i>
                                        ) : msg.deletedForUsers?.includes(user?.id) ? (
                                            <i className="text-gray-300 text-xs">
                                                Message deleted for me
                                            </i>
                                        ) : (
                                            msg.message
                                        )}
                                    </div>

                                    {/* TIME */}
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                                        <span className="text-xs opacity-90 font-medium tracking-wide">
                                            {msg.time}
                                        </span>
                                    </div>

                                    {/* STATUS */}
                                    {isMe && (
                                        <div className="absolute -bottom-2 -right-2 flex items-center gap-0.5 text-[10px] opacity-80">
                                            <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                                            <div className="w-1.5 h-1.5 bg-violet-300 rounded-full shadow-sm" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}

                {/* ✅ Typing indicator */}
                {otherTyping && (
                    <div className="flex items-center gap-2 w-fit animate-pulse">
                        <div className="w-7 h-7 bg-gradient-to-r from-slate-300 to-slate-400 rounded-2xl shadow-sm flex-shrink-0" />
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></span>
                        </div>
                        <span className="text-xs text-gray-400">typing...</span>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* 🔷 INPUT */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-slate-200 shadow-2xl p-4">
                <div className="max-w-4xl mx-auto flex items-end gap-3">
                    {showEmoji && (
                        <div
                            ref={emojiRef}
                            className="absolute bottom-10 left-4 mb-4 w-72 h-80 bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col z-50"
                        >
                            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Emojis</span>
                                <button onClick={() => setShowEmoji(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="flex gap-2 p-2 border-b border-slate-50 overflow-x-auto custom-scrollbar">
                                {EMOJI_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => setActiveEmojiTab(cat.name)}
                                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors ${activeEmojiTab === cat.name
                                            ? "bg-indigo-600 text-white"
                                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                                <div className="grid grid-cols-6 gap-2">
                                    {EMOJI_CATEGORIES.find((c) => c.name === activeEmojiTab)?.emojis.map((emoji, i) => (
                                        <button
                                            key={i}
                                            onClick={() => addEmoji(emoji)}
                                            className="text-xl hover:bg-slate-50 p-1 rounded-lg transition-colors transform hover:scale-125 active:scale-90"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 📱 Mobile Menu Button */}
                    <button
                        onClick={() => setShowMobileMenu(prev => !prev)}
                        className="md:hidden p-3 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M13 11a1 1 0 110-2 1 1 0 010 2zm-2 0a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    {/* 📱 Mobile Dropdown */}
                    {showMobileMenu && (
                        <div
                            ref={mobileMenuRef}
                            className="absolute bottom-16 left-4 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden md:hidden"
                        >
                            <button
                                onClick={() => {
                                    setShowEmoji(prev => !prev);
                                    setShowMobileMenu(false);
                                }}
                                className="flex items-center hover:text-yellow-500 gap-2 px-4 py-2 text-sm hover:bg-slate-50 w-full"
                            >
                                <Smile size={16} />
                                Emoji
                            </button>

                            <button
                                onClick={() => {
                                    handleFile();
                                    setShowMobileMenu(false);
                                }}
                                className="flex items-center hover:text-indigo-600 gap-2 px-4 py-2 text-sm hover:bg-slate-50 w-full"
                            >
                                <Paperclip size={16} />
                                Attach File
                            </button>
                        </div>
                    )}
                    {/* Emoji button */}
                    {/* 💻 Desktop Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            ref={buttonRef}
                            onClick={() => setShowEmoji(prev => !prev)}
                            className="p-3 text-slate-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-2xl transition-all shadow-sm"
                        >
                            <Smile size={20} />
                        </button>

                        <button
                            onClick={handleFile}
                            className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-yellow-50 rounded-2xl transition-all shadow-sm"
                        >
                            <Paperclip size={20} />
                        </button>
                    </div>

                    {/* Input */}
                    <input
                        type="text"
                        value={text}
                        ref={textareaRef}
                        onChange={(e) => handleTyping(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 w-full bg-slate-50 border-2 border-slate-200 rounded-3xl px-5 py-3 text-sm placeholder-slate-500 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all shadow-sm hover:shadow-md resize-none"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    {/* Send button */}
                    <button
                        onClick={handleSend}
                        disabled={!text.trim()}
                        className="group flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        <Send
                            size={18}
                            fill="currentColor"
                            className={!text.trim() ? "opacity-50" : ""}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatUserPage;