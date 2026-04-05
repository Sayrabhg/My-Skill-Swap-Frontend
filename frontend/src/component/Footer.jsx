import { useState } from "react";
import { Link } from "react-router-dom";
import { Rocket } from "lucide-react";
import { sendContactMessage } from "@/api/api"; // import API

const Footer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState(null); // success/error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendContactMessage(formData);
            setStatus("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            console.error(err);
            setStatus("Failed to send message. Please try again.");
        }
    };

    return (
        <footer className="relative border-t border-gray-600 bg-gray-900 text-gray-300 pt-12 pb-6 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

                {/* Logo + Description */}
                <div>
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Rocket className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold text-white">My Skill-Swap</span>
                    </Link>
                    <p className="text-sm text-justify leading-relaxed">
                        My Skill-Swap is a collaborative platform where people exchange
                        skills and knowledge. Learn new abilities, share your expertise,
                        and connect with a community passionate about growth and learning.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <div className="mb-4"><span className="text-white font-semibold">Quick Links</span></div>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
                        <li><Link to="/learn" className="hover:text-indigo-400">Learn</Link></li>
                        <li><Link to="/earn-tokens" className="hover:text-indigo-400">Earn Tokens</Link></li>
                        <li><Link to="/teach" className="hover:text-indigo-400">Teach</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <div className="mb-4"><span className="text-white font-semibold">Services</span></div>
                    <ul className="space-y-2">
                        <li className="hover:text-indigo-400 cursor-pointer">Skill Exchange</li>
                        <li className="hover:text-indigo-400 cursor-pointer">Mentorship</li>
                        <li className="hover:text-indigo-400 cursor-pointer">Community Learning</li>
                        <li className="hover:text-indigo-400 cursor-pointer">Project Collaboration</li>
                        <li className="hover:text-indigo-400 cursor-pointer">Career Growth</li>
                    </ul>
                </div>

                {/* Contact Form */}
                <div>
                    <div className="mb-5"><span className="text-white font-semibold">Contact Us</span></div>

                    <form className="space-y-3" onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-indigo-500"
                        />

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-indigo-500"
                        />

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Message"
                            rows="3"
                            required
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-indigo-500"
                        ></textarea>

                        {/* Status Message */}
                        {status && (
                            <p className={`text-sm ${status.includes("success") ? "text-green-500" : "text-red-500"}`}>
                                {status}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded text-sm"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

            </div>

            {/* Bottom */}
            <div className="border-t border-gray-800 mt-4 pt-4 text-center text-sm">
                © {new Date().getFullYear()} My Skill-Swap. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;