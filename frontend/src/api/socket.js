import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let subscriptions = [];
let messageQueue = [];

// ✅ Get user ID
const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        return user?.id;
    } catch {
        return null;
    }
};

// ✅ Connect socket (ROOM BASED FIXED)
export const connectSocket = (roomId, onTypingReceived, onMessageReceived, onDeleteReceived) => {
    if (!roomId) return;

    if (subscriptions.length > 0) {
        subscriptions.forEach(sub => sub.unsubscribe());
        subscriptions = [];
    }

    if (!stompClient) {
        const socket = new SockJS("https://my-skill-swap-backend-production.up.railway.app/ws");
        stompClient = Stomp.over(socket);

        const token = localStorage.getItem("token"); // ✅ your JWT

        stompClient.connect({
            Authorization: `Bearer ${token}` // ✅ SEND TOKEN
        }, () => {
            console.log("SOCKET CONNECTED ✅");

            subscribeRoom(roomId, onTypingReceived, onMessageReceived, onDeleteReceived);

            messageQueue.forEach((item) => {
                if (item.type === "typing") {
                    sendTyping(item.roomId, item.typing);
                } else if (item.type === "message") {
                    sendMessage(item.message);
                } else if (item.type === "delete") {
                    sendDeleteMessage(
                        item.data.chatId,
                        item.data.roomId,
                        item.data.type
                    );
                }
            });

            messageQueue = [];
        });
    } else if (stompClient.connected) {
        subscribeRoom(roomId, onTypingReceived, onMessageReceived, onDeleteReceived);
    }
};

// ✅ Subscribe function (separate for reuse)
const subscribeRoom = (roomId, onTypingReceived, onMessageReceived, onDeleteReceived) => {
    console.log("SUBSCRIBING TO ROOM:", roomId);

    const typingSub = stompClient.subscribe(`/topic/typing/${roomId}`, (msg) => {
        onTypingReceived(JSON.parse(msg.body));
    });

    const messageSub = stompClient.subscribe(`/topic/${roomId}`, (msg) => {
        onMessageReceived(JSON.parse(msg.body));
    });

    const deleteSub = stompClient.subscribe(`/topic/delete/${roomId}`, (msg) => {
        const data = JSON.parse(msg.body);

        console.log("🗑️ DELETE RECEIVED:", data); // 🔥 ADD

        if (onDeleteReceived) {
            onDeleteReceived(data);
        }
    });

    subscriptions.push(typingSub, messageSub, deleteSub);
};

// Disconnect
export const disconnectSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => console.log("DISCONNECTED ❌"));
    }
    subscriptions = [];
};

// ✅ Send typing
export const sendTyping = (roomId, typing) => {
    const userId = getUserId();

    const payload = { roomId, userId, typing };

    if (stompClient && stompClient.connected) {
        stompClient.send("/app/typing", {}, JSON.stringify(payload));
    } else {
        messageQueue.push({ type: "typing", roomId, typing });
    }
};

// ✅ Send message (MATCHES YOUR JAVA MODEL)
export const sendMessage = (message) => {
    const userId = getUserId();

    const finalMessage = {
        roomId: message.roomId,
        senderId: userId,
        message: message.message
    };

    if (stompClient && stompClient.connected) {
        stompClient.send("/app/sendMessage", {}, JSON.stringify(finalMessage));
    } else {
        messageQueue.push({ type: "message", message: finalMessage });
    }
};

export const sendDeleteMessage = (chatId, roomId, type) => {
    const payload = { chatId, roomId, type };

    if (stompClient && stompClient.connected) {
        stompClient.send("/app/deleteMessage", {}, JSON.stringify(payload));
    } else {
        console.warn("⚠️ Socket not connected, queueing delete...");
        messageQueue.push({ type: "delete", data: payload });
    }
};

