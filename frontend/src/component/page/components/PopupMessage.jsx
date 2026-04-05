import { useNavigate } from "react-router-dom";

export default function PopupMessage({ open, onClose, message }) {
    if (!open) return null;
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const handleClick = () => {
        if (!user?.id) {
            // Navigate to login/signup page
            navigate("/auth");
        } else {
            // User logged in → go to swapping page
            navigate("/dashboard"); // replace with your swapping route
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            ></div>

            {/* Popup Content */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-sm w-full text-center z-10">
                <h2 className="text-xl font-semibold text-red-500 mb-4">
                    Attention!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
                <div className="grid gap-2 justify-center">
                    <button
                        className="text-gray-500 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 px-4 cursor-pointer hover:bg-green-100 rounded-lg "
                        onClick={onClose}
                    >
                        OK
                    </button>
                    <button className="text-indigo-500 italic px-4 hover:font-bold cursor-pointer rounded-lg" onClick={handleClick}>
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}