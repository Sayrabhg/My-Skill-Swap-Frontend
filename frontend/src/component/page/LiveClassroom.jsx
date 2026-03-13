import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

export default function LiveClassroom() {

    const [notes, setNotes] = useState("");
    const [messages, setMessages] = useState([
        { user: "Aisha", text: "Let's start with Spring Boot annotations." },
        { user: "You", text: "Sure! I'm ready." }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input) return;

        setMessages([
            ...messages,
            { user: "You", text: input }
        ]);

        setInput("");
    };

    return (

        <>
            <Helmet>
                <title>Live SkillSwap Classroom</title>
                <meta name="description" content="Interactive live classroom for skill exchange learning." />
            </Helmet>

            <div className="min-h-screen bg-gray-100 flex flex-col">

                {/* HEADER */}

                <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center">

                    <div>
                        <h1 className="text-xl font-semibold">
                            Live Classroom
                        </h1>
                        <p className="text-xs text-gray-500">
                            Session with Aisha Khan — Spring Boot Mentorship
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            Live • 32 min
                        </div>

                        <Button variant="destructive">
                            End Session
                        </Button>

                    </div>

                </header>

                {/* MAIN CLASSROOM */}

                <div className="flex flex-1">

                    {/* LEFT AREA 70% */}

                    <div className="w-[70%] flex flex-col border-r">

                        {/* VIDEO / WHITEBOARD */}

                        <div className="flex-1 bg-black flex items-center justify-center text-white">

                            <div className="text-center">

                                <p className="text-lg">
                                    Video / Whiteboard Area
                                </p>

                                <p className="text-sm text-gray-400">
                                    (WebRTC video stream or collaborative whiteboard)
                                </p>

                            </div>

                        </div>

                        {/* COLLABORATIVE NOTES */}

                        <div className="h-56 bg-white border-t p-4 flex flex-col">

                            <h3 className="font-semibold mb-2">
                                Collaborative Notes
                            </h3>

                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Write shared notes during the session..."
                                className="flex-1 border rounded-lg p-3 resize-none focus:outline-none"
                            />

                        </div>

                    </div>

                    {/* RIGHT PANEL 30% */}

                    <div className="w-[30%] flex flex-col bg-white">

                        {/* CHAT */}

                        <div className="flex-1 p-4 overflow-y-auto">

                            <h3 className="font-semibold mb-4">
                                Session Chat
                            </h3>

                            <div className="space-y-3">

                                {messages.map((msg, index) => (

                                    <div key={index}>

                                        <span className="font-semibold text-sm">
                                            {msg.user}
                                        </span>

                                        <p className="text-sm text-gray-600">
                                            {msg.text}
                                        </p>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* CHAT INPUT */}

                        <div className="border-t p-3 flex gap-2">

                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type message..."
                                className="flex-1 border rounded-lg px-3 py-2 text-sm"
                            />

                            <Button
                                size="sm"
                                onClick={sendMessage}
                            >
                                Send
                            </Button>

                        </div>

                        {/* TOKEN RELEASE */}

                        <div className="border-t p-4">

                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700">

                                Confirm Session & Release Tokens

                            </Button>

                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Tokens will transfer to mentor after confirmation
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}