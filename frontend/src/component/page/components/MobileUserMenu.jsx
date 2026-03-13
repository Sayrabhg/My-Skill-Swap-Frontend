import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileUserMenu = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm lg:hidden">
            {/* Left: Avatar */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {getInitials(user.name)}
                </div>
                <div>
                    <p className="text-gray-800 font-semibold">{user.name}</p>
                    {user.email && <p className="text-gray-500 text-sm">{user.email}</p>}
                </div>
            </div>

            {/* Right: Three dots menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="text-gray-600 text-2xl px-2 py-1 hover:bg-gray-100 rounded-full transition"
                >
                    ⋮
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50 overflow-hidden">
                        <button
                            onClick={() => { navigate("/dashboard"); setIsOpen(false); }}
                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => { navigate("/profile"); setIsOpen(false); }}
                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => { navigate("/contact"); setIsOpen(false); }}
                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                        >
                            Contact Form
                        </button>
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileUserMenu;