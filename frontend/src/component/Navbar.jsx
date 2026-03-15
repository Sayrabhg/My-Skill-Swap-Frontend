import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Rocket, MoreVertical } from "lucide-react";
import { CoolMode } from "@/components/ui/cool-mode";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // mobile dropdown
    const [isOpen1, setIsOpen1] = useState(false); // mobile nav links
    const [user, setUser] = useState(null); // user info
    const menuRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false); // desktop dropdown
    const navigate = useNavigate();
    const dropdownRef = useRef();

    // Load user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // Close desktop dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Browse Skills", href: "/all-skills" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Contact", href: "/contact" },
    ];

    // Get user initials if no avatar
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <nav className="fixed w-full z-50 top-0 bg-white/70 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <CoolMode>
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition">
                                <Rocket className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                My Skill-Swap
                            </span>
                        </Link>
                    </CoolMode>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-gray-700 hover:text-indigo-600 font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {user ? (
                            <div className="relative flex items-center gap-2" ref={dropdownRef}>
                                {/* Avatar */}
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                                        {getInitials(user.name)}
                                    </div>
                                )}

                                <span className="hidden sm:block font-medium text-gray-800">
                                    {user.name}
                                </span>

                                {/* Dropdown Toggle */}
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <MoreVertical size={24} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 top-11 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 z-50">
                                        <Link
                                            to="/dashboard"
                                            className="block text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/profile"
                                            className="block text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/mentor/requests"
                                            className="block text-left px-4 py-2 hover:bg-gray-100"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Request
                                        </Link>
                                        {user && (user.role === "ADMIN" || user.role === "MODERATOR") && (
                                            <button
                                                onClick={() => navigate("/admin/contacts")}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                Contact Form
                                            </button>
                                        )}
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <CoolMode>
                                <Link to="/auth">
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-semibold shadow">
                                        Get Started
                                    </button>
                                </Link>
                            </CoolMode>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsOpen1(!isOpen1)}>
                            {isOpen1 ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Links */}
            {isOpen1 && (
                <div className="flex flex-col space-y-2 px-4 pb-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.href}
                            onClick={() => setIsOpen1(false)}
                            className="block py-2 px-4 rounded hover:bg-indigo-50 text-gray-700 font-medium transition"
                        >
                            {link.name}
                        </Link>
                    ))}

                    {/* Show Get Started if user is not logged in */}
                    {!user && (
                        <Link to="/auth">
                            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition mt-2">
                                Get Started
                            </button>
                        </Link>
                    )}
                </div>
            )}

            {/* Mobile Bottom Bar */}
            <div className="bg-white border-t shadow-sm lg:hidden">
                {user ? (
                    <>
                        <div className="px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {getInitials(user.name)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-sm text-gray-500">{user.email || ""}</p>
                                </div>
                            </div>

                            {/* Three Dots Menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsOpen((prev) => !prev)}
                                    className="text-gray-600 text-2xl px-2 py-1 hover:bg-gray-100 rounded-full transition"
                                >
                                    ⋮
                                </button>

                                {isOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border z-50 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                navigate("/dashboard");
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                                        >
                                            Dashboard
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/profile");
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                                        >
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/mentor/requests");
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                                        >
                                            Request
                                        </button>
                                        {user && (user.role === "ADMIN" || user.role === "MODERATOR") && (
                                            <button
                                                onClick={() => {
                                                    navigate("/admin/contacts");
                                                    setIsOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                                            >
                                                Contact Form
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;