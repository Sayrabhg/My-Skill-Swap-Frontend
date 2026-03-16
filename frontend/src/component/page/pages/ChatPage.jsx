import { useEffect, useState, useRef } from "react";
import { sendMessage, getChatMessages } from "../../../api/api";
import { Send } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

export default function ChatDialog({ open, setOpen, roomId, userId }) {

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    const loadMessages = async () => {
        try {
            const res = await getChatMessages(roomId);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (open && roomId) {
            loadMessages();
        }
    }, [open, roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!text.trim()) return;

        try {
            await sendMessage({
                roomId: roomId,
                message: text
            });

            setText("");
            loadMessages();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent className="max-w-lg p-0">

                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Chat</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col h-[500px]">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.senderId === userId
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >

                                <div
                                    className={`px-4 py-2 rounded-xl max-w-xs text-sm shadow
                                    ${msg.senderId === userId
                                            ? "bg-blue-500 text-white"
                                            : "bg-white border"
                                        }`}
                                >
                                    {msg.message}

                                    <div className="text-xs opacity-70 mt-1">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>

                            </div>
                        ))}

                        <div ref={bottomRef}></div>

                    </div>

                    {/* Input */}
                    <div className="border-t p-3 flex gap-2">

                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-3 py-2"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />

                        <button
                            onClick={handleSend}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Send size={18} />
                            Send
                        </button>

                    </div>

                </div>

            </DialogContent>

        </Dialog>
    );
}