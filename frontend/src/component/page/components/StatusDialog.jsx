import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StatusDialog({
    open,
    type = "success", // "success" | "error"
    message,
    onClose
}) {
    if (!open) return null;

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-96 text-center animate-slideFromLeft">

                {/* Icon */}
                <div className="flex justify-center mb-3">
                    <div className={`p-3 rounded-full ${isSuccess ? "bg-green-100" : "bg-red-100"}`}>
                        {isSuccess ? (
                            <CheckCircle size={40} className="text-green-600" />
                        ) : (
                            <XCircle size={40} className="text-red-600" />
                        )}
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-2">
                    {isSuccess ? "Success" : "Error"}
                </h2>

                {/* Message */}
                <p className={`mb-6 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>

                {/* Button */}
                <Button
                    onClick={onClose}
                    className={`w-full ${isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white rounded-lg`}
                >
                    OK
                </Button>

            </div>
        </div>
    );
}