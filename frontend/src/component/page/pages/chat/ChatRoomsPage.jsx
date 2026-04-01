import React, { useState, useEffect } from 'react';
import { getLoginUserRooms, getUserById, getLastChatRooms } from '@/api/api';

const ChatRoomsPage = ({ onRoomSelect, selectedRoomId }) => {
    const [loginUserRooms, setLoginUserRooms] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [mergedRooms, setMergedRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Fetch login user rooms
    const fetchLoginUserRooms = async () => {
        try {
            const res = await getLoginUserRooms();
            setLoginUserRooms(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load chat rooms");
        }
    };

    // ✅ Fetch last messages
    const fetchLastMessages = async () => {
        try {
            const res = await getLastChatRooms();
            setLastMessages(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // ✅ Merge rooms + avatar fetch
    const mergeRoomsData = async (rooms, lastMsgs) => {
        const merged = await Promise.all(
            rooms
                .filter(room => room.status === "ACCEPTED")
                .map(async (room) => {
                    let avatar = null;

                    try {
                        const res = await getUserById(room.otherUserId);
                        avatar = res.data?.user?.avatar || null;
                    } catch (err) {
                        console.error("Avatar fetch error:", err);
                    }

                    const lastMsg = lastMsgs.find(
                        msg => msg.roomId === room.roomId
                    );

                    return {
                        id: room.roomId,
                        roomId: room.roomId,
                        otherUserId: room.otherUserId,
                        otherUserName: room.otherUserName,
                        avatar,
                        lastMessage: lastMsg?.lastMessage || "Start conversation",
                        time: lastMsg?.time || ""
                    };
                })
        );

        return merged;
    };

    // ✅ Initial load
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchLoginUserRooms(),
                    fetchLastMessages()
                ]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // ✅ Merge after fetch
    useEffect(() => {
        const loadMerged = async () => {
            if (loginUserRooms.length > 0) {
                const merged = await mergeRoomsData(
                    loginUserRooms,
                    lastMessages
                );
                setMergedRooms(merged);
            }
        };

        loadMerged();
    }, [loginUserRooms, lastMessages]);

    // ✅ Search filter
    const filteredRooms = mergedRooms.filter(room =>
        room.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRoomClick = (room) => {
        onRoomSelect?.(room);
    };

    // ================= UI =================

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">

            {/* 🔍 Search */}
            <div className="p-4 border-b">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* 📋 Rooms */}
            <div className="flex-1 overflow-y-auto">

                {filteredRooms.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No conversations
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <div
                            key={room.roomId}
                            onClick={() => handleRoomClick(room)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-all duration-200 flex items-center gap-4 group relative border-r-4 ${selectedRoomId === room.roomId
                                ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-200/50'
                                : 'border-transparent hover:border-indigo-100'
                                }`}
                        >

                            {/* ✅ Avatar FIXED */}
                            <div className="flex-shrink-0 p-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm group-hover:scale-[1.05] transition-all duration-200">
                                <img
                                    src={
                                        room.avatar ||
                                        `https://ui-avatars.com/api/?name=${room.otherUserName}`
                                    }
                                    alt={room.otherUserName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left">
                                <div className="flex justify-between">
                                    <h3 className="font-semibold text-sm">
                                        {room.otherUserName}
                                    </h3>
                                    <span className="text-xs text-gray-400">
                                        {room.time}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500 truncate">
                                    {room.lastMessage}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatRoomsPage;




