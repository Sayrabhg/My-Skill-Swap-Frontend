import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectSocket = (roomId, onTypingReceived) => {
    if (stompClient && stompClient.connected) return; // ✅ prevent reconnect

    const socket = new SockJS("http://localhost:1213/ws");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("CONNECTED ✅");

        stompClient.subscribe(`/topic/typing/${roomId}`, (msg) => {
            const data = JSON.parse(msg.body);
            onTypingReceived(data);
        });

    }, (error) => {
        console.error("SOCKET ERROR ❌", error);
    });
};

export const disconnectSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("DISCONNECTED ❌");
        });
    }
};

// ✅ SEND TYPING EVENT
export const sendTyping = (roomId, userId, typing) => {
    if (stompClient && stompClient.connected) {
        stompClient.send(
            "/app/typing",
            {},
            JSON.stringify({
                roomId,
                userId,
                typing
            })
        );
    }
};