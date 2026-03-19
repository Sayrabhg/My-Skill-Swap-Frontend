import { useParams } from "react-router-dom";
import ChatDialog from "./ChatPage";

export default function ChatPages() {
    const { roomId } = useParams();

    return (
        <div className="">
            <ChatDialog open={true} roomId={roomId} />
        </div>
    );
}