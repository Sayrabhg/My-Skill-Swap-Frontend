import { motion, AnimatePresence } from "framer-motion";

export const StatusModal = ({ show, message, onClose, type }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center z-50"
                >
                    {/* Background overlay */}
                    <div
                        className="absolute inset-0 bg-black/30"
                        onClick={onClose}
                    ></div>

                    {/* Modal box */}
                    <motion.div
                        className={`bg-white p-6 rounded-xl shadow-xl max-w-sm w-full relative z-10 ${type === "success"
                                ? "border-l-4 border-green-500"
                                : "border-l-4 border-red-500"
                            }`}
                    >
                        <p className="text-gray-800 font-medium">{message}</p>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 font-bold"
                        >
                            ✕
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};