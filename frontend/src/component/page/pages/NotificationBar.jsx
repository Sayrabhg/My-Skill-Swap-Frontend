import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Bell, UserCheck2, UserRoundXIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
    getUserById,
    getPendingRequests,
    getAcceptedChatRooms,
    getMessages,
    acceptChatRequest,
    rejectChatRequest
} from "@/api/api";

export default function NotificationBar({ loggedInUser }) {
    const [notifications, setNotifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [userId, setUserId] = useState(null);
    const modalRef = useRef(null);

    const navigate = useNavigate();

    // ✅ Set logged user
    useEffect(() => {
        if (loggedInUser) setUserId(loggedInUser.id);
        else setUserId(null);
    }, [loggedInUser]);

    // ✅ FETCH NOTIFICATIONS
    const fetchNotifications = async () => {
        if (!userId) return;

        try {
            const pendingRes = await getPendingRequests();
            const acceptedRes = await getAcceptedChatRooms();

            const allRooms = [
                ...(pendingRes.data || []),
                ...(acceptedRes.data || [])
            ];

            const notifs = await Promise.all(
                allRooms.map(async (room) => {
                    const isSender = room.userAId === userId;
                    const isReceiver = room.userBId === userId;

                    const otherUserId = isSender
                        ? room.userBId
                        : room.userAId;

                    // ❌ Skip invalid IDs (FIX 404)
                    if (!otherUserId) return null;

                    let otherUserName = "Unknown User";
                    let avatar = "";
                    let lastMessage = "";
                    let lastMessageTime = "";

                    // ✅ Safe user fetch
                    try {
                        const userRes = await getUserById(otherUserId);
                        otherUserName = userRes?.data?.user?.name || "Unknown User";
                        avatar = userRes?.data?.user?.avatar || "";
                    } catch (err) {
                        console.error("User fetch failed:", otherUserId);
                    }

                    // ✅ Messages only for accepted
                    if (room.status === "ACCEPTED") {
                        try {
                            const msgRes = await getMessages(room.id);
                            const messages = msgRes.data || [];

                            if (messages.length > 0) {
                                const lastMsg = messages[messages.length - 1];
                                lastMessage = lastMsg.message;
                                lastMessageTime = lastMsg.time;
                            }
                        } catch (err) {
                            console.error("Message fetch failed");
                        }
                    }

                    return {
                        id: room.id,
                        name: otherUserName,
                        message:
                            room.status === "PENDING"
                                ? "Chat request received"
                                : lastMessage || "No messages",
                        time: lastMessageTime || "",
                        avatar,
                        roomId: room.id,
                        status: room.status,
                        isReceiver
                    };
                })
            );

            // ✅ REMOVE NULL + PRESERVE actionStatus
            setNotifications(prev => {
                const filtered = notifs.filter(Boolean);

                return filtered.map(n => {
                    const existing = prev.find(p => p.roomId === n.roomId);
                    return {
                        ...n,
                        actionStatus: existing?.actionStatus || null
                    };
                });
            });

        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };
    // ✅ Accept request
    const handleAccept = async (roomId) => {
        try {
            await acceptChatRequest(roomId);

            setNotifications(prev =>
                prev.map(n =>
                    n.roomId === roomId
                        ? {
                            ...n,
                            actionStatus: "ACCEPTED",
                            message: "You accepted the request ✅" // 👈 update message
                        }
                        : n
                )
            );

            toast.success("Request Accepted ✅");

        } catch (err) {
            console.error("Accept failed", err);
            toast.error("Failed to accept ❌");
        }
    };

    // ✅ Reject request
    const handleReject = async (roomId) => {
        try {
            await rejectChatRequest(roomId);

            setNotifications(prev =>
                prev.map(n =>
                    n.roomId === roomId
                        ? {
                            ...n,
                            actionStatus: "REJECTED",
                            message: "You rejected the request ❌" // 👈 update
                        }
                        : n
                )
            );

            toast.error("Request Rejected ❌");

        } catch (err) {
            console.error("Reject failed", err);
            toast.error("Failed to reject ❌");
        }
    };

    // ✅ Polling every 5 sec
    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 5000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [userId]);

    // ✅ Close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target)
            ) {
                setModalOpen(false);
            }
        };

        if (modalOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [modalOpen]);

    // ✅ Navigate to chat
    const handleOpenChat = (roomId) => {
        setModalOpen(false);
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="relative mx-4">
            {/* 🔔 Bell Icon */}
            <button
                className="relative p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-500 transition"
                onClick={() => setModalOpen(!modalOpen)}
            >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-100" />

                {userId && notifications.length > 0 && (
                    <span className="absolute top-0 right-0 px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* 📩 Modal */}
            {modalOpen && (
                <div
                    ref={modalRef}
                    className="absolute lg:right-0 right-[-2.7em] mt-2 w-80 lg:w-96 max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white dark:bg-gray-800 z-50"
                >
                    {/* HEADER */}
                    <div className="flex justify-between items-center p-3 border-b dark:border-gray-500 rounded-lg">
                        <h3 className="font-semibold dark:text-gray-100 text-gray-700">
                            Notifications
                        </h3>
                        <button onClick={() => setModalOpen(false)}>
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-200 cursor-pointer hover:text-red-700" />
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="p-2">
                        {!userId ? (
                            <p className="text-sm text-center py-4">
                                Please log in first
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="text-sm text-center py-4">
                                No notifications
                            </p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="flex gap-3 p-3 mb-2 hover:bg-violet-50 rounded-full cursor-pointer justify-between"
                                >
                                    {/* Avatar */}
                                    <div className="flex align-center gap-3">
                                        <img
                                            src={
                                                notif.avatar ||
                                                `https://ui-avatars.com/api/?name=${notif.name}`
                                            }
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />

                                        <p className="font-medium text-gray-700 self-center">
                                            {notif.name}
                                        </p>
                                    </div>

                                    {/* ✅ SHOW BUTTONS ONLY TO RECEIVER */}
                                    {notif.status?.toUpperCase() === "PENDING" && notif.isReceiver ? (

                                        notif.actionStatus ? (
                                            <div className="flex flex-col items-end text-xs">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-white ${notif.actionStatus === "ACCEPTED"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                        }`}
                                                >
                                                    {notif.actionStatus}
                                                </span>

                                                <span className="text-gray-500 mt-1 text-[11px]">
                                                    {notif.message}
                                                </span>
                                            </div>
                                        ) : (
                                            // ✅ BEFORE CLICK SHOW BUTTONS
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    title="Accept"
                                                    onClick={() => handleAccept(notif.roomId)}
                                                    className="px-2 py-1 cursor-pointer hover:scale-105 text-xs bg-green-500 text-white rounded-full"
                                                >
                                                    <UserCheck2 size={18} />
                                                </button>

                                                <button
                                                    title="Reject"
                                                    onClick={() => handleReject(notif.roomId)}
                                                    className="px-2 py-1 cursor-pointer hover:scale-105 text-xs bg-red-500 text-white rounded-full"
                                                >
                                                    <UserRoundXIcon size={18} />
                                                </button>
                                            </div>
                                        )

                                    ) : (
                                        <p
                                            onClick={() => handleOpenChat(notif.roomId)}
                                            className="text-sm text-green-600 truncate cursor-pointer"
                                        >
                                            {notif.message}
                                        </p>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}