import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    return (
        <div id="header"
            className={`relative ${user ? "h-38 lg:h-20" : "h-20"
                } transition-all duration-300`}
        >
            <Navbar />
        </div>
    );
}