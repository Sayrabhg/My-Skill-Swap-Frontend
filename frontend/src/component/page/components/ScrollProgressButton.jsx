import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // optional icon library

export default function ScrollProgressButton() {
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            setScrollPercent(scrolled);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToHeader = () => {
        const header = document.getElementById("header");
        if (header) {
            header.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <button
            onClick={scrollToHeader}
            className="fixed bottom-6 right-6 w-11 h-11 z-11 hover:scale-110 rounded-full flex items-center justify-center bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
        >
            {/* Circular SVG progress */}
            <svg className="absolute w-14 h-14" viewBox="0 0 36 36">
                <path
                    className="text-indigo-200"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                    stroke="#9286ff"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${scrollPercent}, 100`}
                    d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
                />
            </svg>

            {/* Arrow Icon */}
            <ArrowUp size={26} strokeWidth={3} />
        </button>
    );
}