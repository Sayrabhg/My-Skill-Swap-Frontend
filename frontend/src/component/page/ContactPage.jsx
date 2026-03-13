import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { StripedPattern } from "@/components/magicui/striped-pattern";
import { sendContactMessage } from "@/api/api"; // your API function
import { Helmet } from "react-helmet-async";
import { StatusModal } from "@/component/page/components/StatusModal";

const ContactPage = () => {
    // State for form
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // State for modal status
    const [status, setStatus] = useState({
        show: false,
        type: "",
        message: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendContactMessage(formData);
            setStatus({
                show: true,
                type: "success",
                message: "Message sent successfully!",
            });
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error(err);
            setStatus({
                show: true,
                type: "error",
                message: "Failed to send message. Please try again.",
            });
        }
    };

    const closeModal = () => setStatus({ ...status, show: false });

    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-6 overflow-hidden">
            {/* SEO */}
            <Helmet>
                <title>Contact Us | Skill Swap</title>
                <meta
                    name="description"
                    content="Contact Skill Swap for questions, suggestions, or support. Reach out to our team via email, phone, or form."
                />
            </Helmet>

            {/* Striped Pattern Background */}
            <StripedPattern className="absolute inset-0 opacity-40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center max-w-3xl mx-auto mb-14"
            >
                <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
                <p className="text-gray-500 mt-3">
                    Have questions or suggestions? We'd love to hear from you. Reach out
                    and our team will get back to you soon.
                </p>
            </motion.div>

            <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="space-y-8 text-left"
                >
                    <div className="flex items-start gap-4">
                        <Mail className="text-indigo-600" size={26} />
                        <div>
                            <h3 className="font-semibold text-gray-800">Email</h3>
                            <p className="text-gray-500">example@skillswap.com</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <Phone className="text-indigo-600" size={26} />
                        <div>
                            <h3 className="font-semibold text-gray-800">Phone</h3>
                            <p className="text-gray-500">+91 00000 00000</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <MapPin className="text-indigo-600" size={26} />
                        <div>
                            <h3 className="font-semibold text-gray-800">Location</h3>
                            <p className="text-gray-500">Nagpur, Maharashtra, India</p>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6"
                >
                    <div className="m-2">
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="m-2">
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="m-2">
                        <label className="text-sm text-gray-600">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Message subject"
                            required
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="m-2">
                        <label className="text-sm text-gray-600">Message</label>
                        <textarea
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message..."
                            required
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Send Message
                    </motion.button>
                </motion.form>
            </div>

            {/* Status Modal */}
            <StatusModal
                show={status.show}
                message={status.message}
                type={status.type}
                onClose={closeModal}
            />
        </section>
    );
};

export default ContactPage;