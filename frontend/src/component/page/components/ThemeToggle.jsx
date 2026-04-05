// ThemeToggle.jsx
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react"; // optional icons, or use emojis

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // Load saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className={`fixed cursor-pointer bottom-20 right-6 z-11 text-white p-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition transform ${isDark ? 'bg-yellow-400' : 'bg-gray-800'}`}
        >
            {isDark ? <Sun className="w-5 h-5 text-yellow-950" /> : <Moon className="w-5 h-5 text-gray-200" />}
        </button>
    );
}