// import { useEffect, useState } from "react";
// import { Bell, X } from "lucide-react";
// import { getUserChatRooms } from "../../../api/api";
// import ChatDialog from "./ChatPage";
// import { useNavigate } from "react-router-dom";

// export default function NotificationBar({ loggedInUser }) { // receive prop
//     const [notifications, setNotifications] = useState([]);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [chatOpen, setChatOpen] = useState(false);
//     const [roomId, setRoomId] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const navigate = useNavigate();

//     // Set userId from loggedInUser prop
//     useEffect(() => {
//         if (loggedInUser) setUserId(loggedInUser.id);
//         else setUserId(null);
//     }, [loggedInUser]);

//     // Fetch notifications if user is logged in
//     const fetchNotifications = async () => {
//         if (!userId) return; // skip if no user logged in

//         try {
//             const res = await getUserChatRooms();
//             const rooms = res.data;

//             const notifs = rooms.map((room) => ({
//                 id: room.id,
//                 type: "chat",
//                 message: `Chat room with users: ${room.userAId} & ${room.userBId}`,
//                 timestamp: room.updatedAt || new Date().toISOString(),
//                 roomId: room.id,
//             }));

//             setNotifications(notifs);
//         } catch (err) {
//             console.error("Failed to fetch notifications:", err);
//         }
//     };

//     useEffect(() => {
//         if (userId) {
//             fetchNotifications();
//             const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
//             return () => clearInterval(interval);
//         } else {
//             setNotifications([]); // clear if logged out
//         }
//     }, [userId]);

//     const handleOpenChat = (roomId) => {
//         setRoomId(roomId);
//         setChatOpen(true);
//         setModalOpen(false);
//     };

//     return (
//         <div className="relative inline-block text-left">
//             {/* Bell Icon */}
//             <button
//                 className="relative p-2 rounded-full hover:bg-gray-200 transition"
//                 onClick={() => navigate("/notification")}
//             >
//                 <Bell className="w-6 h-6 text-gray-600" />
//                 {userId && notifications.length > 0 && (
//                     <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
//                         {notifications.length}
//                     </span>
//                 )}
//             </button>

//             {/* Notifications Modal */}
//             {modalOpen && (
//                 <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
//                     <div className="flex justify-between items-center p-3 border-b">
//                         <h3 className="font-semibold text-gray-700">Notifications</h3>
//                         <button onClick={() => setModalOpen(false)}>
//                             <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
//                         </button>
//                     </div>

//                     <div className="p-2">
//                         {!userId ? (
//                             <p className="text-sm text-gray-500 text-center py-4">
//                                 Please log in first to see your notifications.
//                             </p>
//                         ) : notifications.length === 0 ? (
//                             <p className="text-sm text-gray-500 text-center py-4">
//                                 No notifications
//                             </p>
//                         ) : (
//                             notifications.map((notif) => (
//                                 <div
//                                     key={notif.id}
//                                     className="flex items-center justify-between p-3 mb-2 hover:bg-gray-100 rounded cursor-pointer transition"
//                                     onClick={() => handleOpenChat(notif.roomId)}
//                                 >
//                                     <div>
//                                         <p className="text-sm text-gray-700">{notif.message}</p>
//                                         <p className="text-xs text-gray-400">
//                                             {new Date(notif.timestamp).toLocaleString()}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             )}

//             {/* Chat Dialog */}
//             {chatOpen && roomId && userId && (
//                 <ChatDialog
//                     open={chatOpen}
//                     setOpen={setChatOpen}
//                     roomId={roomId}
//                     userId={userId}
//                 />
//             )}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { getUserChatRooms } from "../../../api/api";
import ChatDialog from "./ChatPage";

export default function NotificationBar({ loggedInUser }) { // receive prop
    const [notifications, setNotifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [roomId, setRoomId] = useState(null);
    const [userId, setUserId] = useState(null);

    // Set userId from loggedInUser prop
    useEffect(() => {
        if (loggedInUser) setUserId(loggedInUser.id);
        else setUserId(null);
    }, [loggedInUser]);

    // Fetch notifications if user is logged in
    const fetchNotifications = async () => {
        if (!userId) return; // skip if no user logged in

        try {
            const res = await getUserChatRooms();
            const rooms = res.data;

            const notifs = rooms.map((room) => ({
                id: room.id,
                type: "chat",
                message: `Chat room with users: ${room.userAId} & ${room.userBId}`,
                timestamp: room.updatedAt || new Date().toISOString(),
                roomId: room.id,
            }));

            setNotifications(notifs);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 5000); // refresh every 5s
            return () => clearInterval(interval);
        } else {
            setNotifications([]); // clear if logged out
        }
    }, [userId]);

    const handleOpenChat = (roomId) => {
        setRoomId(roomId);
        setChatOpen(true);
        setModalOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            {/* Bell Icon */}
            <button
                className="relative p-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => setModalOpen(!modalOpen)}
            >
                <Bell className="w-6 h-6 text-gray-600" />
                {userId && notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </button>

            {/* Notifications Modal */}
            {modalOpen && (
                <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="flex justify-between items-center p-3 border-b">
                        <h3 className="font-semibold text-gray-700">Notifications</h3>
                        <button onClick={() => setModalOpen(false)}>
                            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>

                    <div className="p-2">
                        {!userId ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                                Please log in first to see your notifications.
                            </p>
                        ) : notifications.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                                No notifications
                            </p>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="flex items-center justify-between p-3 mb-2 hover:bg-gray-100 rounded cursor-pointer transition"
                                    onClick={() => handleOpenChat(notif.roomId)}
                                >
                                    <div>
                                        <p className="text-sm text-gray-700">{notif.message}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(notif.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Chat Dialog */}
            {chatOpen && roomId && userId && (
                <ChatDialog
                    open={chatOpen}
                    setOpen={setChatOpen}
                    roomId={roomId}
                    userId={userId}
                />
            )}
        </div>
    );
}