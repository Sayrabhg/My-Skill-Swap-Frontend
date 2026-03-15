import { useEffect, useState } from "react";
import { getAllContactMessages, deleteContact } from "@/api/api";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Trash2 } from "lucide-react";

const ContactFormsData = () => {
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showSelectMenu, setShowSelectMenu] = useState(false);
    // const [holdTimer, setHoldTimer] = useState(null);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [deleteType, setDeleteType] = useState(""); // single or multiple

    const selectAllContacts = () => {
        setSelectedContacts(contacts.map((c) => c.id));
        setShowSelectMenu(false);
    };

    const selectNoneContacts = () => {
        setSelectedContacts([]);
        setShowSelectMenu(false);
    };

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
            setContacts((prev) => prev.filter((c) => c.id !== id));
            setStatus("Message deleted successfully!");
        } catch (err) {
            console.error(err);
            setStatus("Failed to delete message.");
        }

        setShowModal(false);
        setTimeout(() => setStatus(""), 3000);
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedContacts.map((id) => deleteContact(id)));

            setContacts((prev) =>
                prev.filter((c) => !selectedContacts.includes(c.id))
            );

            setStatus(`${selectedContacts.length} messages deleted successfully!`);
            setSelectedContacts([]);
        } catch (err) {
            console.error(err);
            setStatus("Failed to delete messages.");
        }

        setShowModal(false);
        setTimeout(() => setStatus(""), 3000);
    };

    const toggleSelect = (id) => {
        setSelectedContacts((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    // const handleSelectAll = () => {
    //     if (selectedContacts.length === contacts.length) {
    //         setSelectedContacts([]);
    //     } else {
    //         setSelectedContacts(contacts.map((c) => c.id));
    //     }
    // };

    // const handleHoldStart = (id) => {
    //     const timer = setTimeout(() => {
    //         toggleSelect(id);
    //     }, 500); // 500ms hold

    //     setHoldTimer(timer);
    // };

    // const handleHoldEnd = () => {
    //     clearTimeout(holdTimer);
    // };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-5">
                Contact Messages
            </h2>

            {/* Status */}
            {status && (
                <div
                    className={`mb-4 p-3 rounded ${status.includes("successfully")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {status}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">

                {/* Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowSelectMenu(!showSelectMenu)}
                        className="flex items-center gap-2 bg-gray-300 border border-gray-800 text-gray-800 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                        Select
                        <ChevronDown
                            size={18}
                            className={`transition-transform ${showSelectMenu ? "rotate-180" : ""}`}
                        />
                    </button>

                    {showSelectMenu && (
                        <div className="absolute mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                            <button
                                onClick={selectAllContacts}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Select All
                            </button>

                            <button
                                onClick={selectNoneContacts}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            >
                                Select None
                            </button>
                        </div>
                    )}
                </div>

                {/* Selected Counter */}
                {selectedContacts.length > 0 && (
                    <div className="flex items-center gap-4">

                        <span className="text-gray-700 font-medium">
                            {selectedContacts.length} selected
                        </span>

                        <button
                            onClick={() => {
                                setDeleteType("multiple");
                                setShowModal(true);
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                            <Trash2 size={18} />
                        </button>

                    </div>
                )}

            </div>


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
                            onClick={() => toggleSelect(contact.id)}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className={`relative bg-white rounded-xl shadow-md p-5 flex flex-col justify-between 
    hover:shadow-xl transition-shadow duration-300 group cursor-pointer
    ${selectedContacts.includes(contact.id) ? "border-2 border-blue-500 bg-blue-50" : ""}
    `}
                        >
                            {/* Checkbox */}
                            <input
                                type="checkbox"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={() => toggleSelect(contact.id)}
                                className={`absolute top-4 left-4 transition-opacity duration-300 
    ${selectedContacts.includes(contact.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            />

                            <div className="mb-4 mt-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                    {contact.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {contact.email}
                                </p>
                                <p className="text-gray-700 font-medium mb-2">
                                    {contact.subject}
                                </p>
                                <p className="text-gray-600">{contact.message}</p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute bottom-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                onClick={() => {
                                    setConfirmDeleteId(contact.id);
                                    setDeleteType("single");
                                    setShowModal(true);
                                }}
                            >
                                Delete
                            </motion.button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Modal */}
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
                            <h3 className="text-xl font-semibold mb-4">
                                Confirm Delete
                            </h3>

                            <p className="text-gray-600 mb-6">
                                {deleteType === "single"
                                    ? "Are you sure you want to delete this message?"
                                    : `Delete ${selectedContacts.length} selected messages?`}
                            </p>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() =>
                                        deleteType === "single"
                                            ? handleDelete(confirmDeleteId)
                                            : handleBulkDelete()
                                    }
                                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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