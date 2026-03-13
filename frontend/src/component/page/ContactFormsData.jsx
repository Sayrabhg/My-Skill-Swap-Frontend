import { useEffect, useState } from "react";
import { getAllContactMessages, deleteContact } from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";

const ContactFormsData = () => {
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null); // track which contact to delete
    const [showModal, setShowModal] = useState(false);

    const fetchContacts = async () => {
        try {
            const res = await getAllContactMessages();
            setContacts(res.data);
        } catch (err) {
            console.error(err);
            setStatus("Failed to load contacts.");
            setTimeout(() => setStatus(""), 3000);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteContact(id);
            setStatus("Message deleted successfully!");
            setContacts((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            setStatus("Failed to delete message.");
        }

        setShowModal(false);
        setTimeout(() => setStatus(""), 3000);
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-5">
                Contact Messages
            </h2>

            {status && (
                <div
                    className={`mb-4 p-3 rounded ${status.includes("successfully")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        } transition-all duration-500`}
                >
                    {status}
                </div>
            )}

            {contacts.length === 0 && (
                <p className="text-center text-gray-500 mt-10 text-lg">
                    No messages found.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {contacts.map((contact) => (
                        <motion.div
                            key={contact.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="relative bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 group"
                        >
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">{contact.name}</h3>
                                <p className="text-sm text-gray-500 mb-2">{contact.email}</p>
                                <p className="text-gray-700 font-medium mb-2">{contact.subject}</p>
                                <p className="text-gray-600">{contact.message}</p>
                            </div>

                            {/* Delete button appears on hover */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={() => {
                                    setConfirmDeleteId(contact.id);
                                    setShowModal(true);
                                }}
                            >
                                Delete
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Custom Delete Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white rounded-xl p-6 w-11/12 max-w-md shadow-lg text-center"
                        >
                            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this message? This action cannot be undone.
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(confirmDeleteId)}
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContactFormsData;