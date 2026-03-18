import { useEffect, useState } from "react";
import { getUserChatRooms } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage({ loggedInUser }) {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await getUserChatRooms();
            const rooms = res.data;

            const notifs = rooms.map((room) => ({
                id: room.id,
                message: `Chat room with users: ${room.userAId} & ${room.userBId}`,
                timestamp: room.updatedAt || new Date().toISOString(),
                roomId: room.id,
            }));

            setNotifications(notifs);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (loggedInUser) fetchNotifications();
    }, [loggedInUser]);

    const openChat = (roomId) => {
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {!loggedInUser ? (
                <p className="text-gray-500 text-center">
                    Please log in first
                </p>
            ) : notifications.length === 0 ? (
                <p className="text-gray-500 text-center">
                    No notifications
                </p>
            ) : (
                notifications.map((notif) => (
                    <div
                        key={notif.id}
                        onClick={() => openChat(notif.roomId)}
                        className="p-4 mb-3 bg-white shadow rounded cursor-pointer hover:bg-gray-100"
                    >
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.timestamp).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}