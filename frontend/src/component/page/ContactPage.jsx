import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { StripedPattern } from "@/components/magicui/striped-pattern";

const ContactPage = () => {
    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-16 px-6 overflow-hidden">

            {/* Striped Pattern Background */}
            <StripedPattern className="absolute inset-0 opacity-40 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center max-w-3xl mx-auto mb-14"
            >
                <h1 className="text-4xl font-bold text-gray-800">
                    Contact Us
                </h1>

                <p className="text-gray-500 mt-3">
                    Have questions or suggestions? We'd love to hear from you.
                    Reach out and our team will get back to you soon.
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
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6"
                >

                    {/* Name */}
                    <div className="m-2">
                        <label className="text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="m-2">
                        <label className="text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Subject */}
                    <div className="m-2">
                        <label className="text-sm text-gray-600">Subject</label>
                        <input
                            type="text"
                            placeholder="Message subject"
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Message */}
                    <div className="m-2">
                        <label className="text-sm text-gray-600">Message</label>
                        <textarea
                            rows="4"
                            placeholder="Write your message..."
                            className="w-full mt-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        Send Message
                    </motion.button>

                </motion.form>

            </div>

        </section>
    );
};

export default ContactPage;