import { useEffect, useState } from "react";
import { getAllUsers, deleteUserByEmail } from "@/api/api";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import AdminCreateDialog from "./AdminCreateDialog";
import Loading from "../components/Loading";
import { CheckCircle2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";

export default function UserData() {

    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [deleteMode, setDeleteMode] = useState("single");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteEmail, setDeleteEmail] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const selectAll = () => {
        setSelectedUsers(users.map(user => user.email));
    };

    const clearSelection = () => {
        setSelectedUsers([]);
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (error) {
            console.error("Error fetching users", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (email) => {
        setSelectedUsers(prev =>
            prev.includes(email)
                ? prev.filter(e => e !== email)
                : [...prev, email]
        );
    };

    const confirmDelete = async () => {

        try {

            if (deleteMode === "single") {

                await deleteUserByEmail(deleteEmail);

                setUsers(prev => prev.filter(u => u.email !== deleteEmail));
                setSelectedUsers(prev => prev.filter(e => e !== deleteEmail));

                setMessageText("User deleted successfully.");

            }

            if (deleteMode === "bulk") {

                await Promise.all(
                    selectedUsers.map(email => deleteUserByEmail(email))
                );

                setUsers(prev =>
                    prev.filter(u => !selectedUsers.includes(u.email))
                );

                setMessageText(`${selectedUsers.length} users deleted successfully.`);

                setSelectedUsers([]);

            }

            setMessageOpen(true);

        } catch (err) {
            console.error("Delete failed", err);
            setMessageText("Failed to delete user.");
            setMessageOpen(true);
        } finally {
            setConfirmOpen(false);
            setDeleteEmail(null);
        }
    };
    const deleteSelected = async () => {
        try {

            await Promise.all(
                selectedUsers.map(email => deleteUserByEmail(email))
            );

            setUsers(prev =>
                prev.filter(u => !selectedUsers.includes(u.email))
            );

            setSelectedUsers([]);

        } catch (err) {
            console.error("Bulk delete failed", err);
        }
    };

    if (loading) return <Loading message="Loading users..." />;

    return (
        <div className="p-6">

            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

                <h1 className="text-2xl font-bold">
                    Users ({users.length})
                </h1>

                <div className="flex gap-3 flex-wrap items-center">

                    {/* Select All */}
                    <button
                        onClick={selectAll}
                        className="border px-3 py-2 rounded hover:bg-gray-100 text-sm"
                    >
                        Select All
                    </button>

                    {/* Clear Selection */}
                    <button
                        onClick={clearSelection}
                        className="border px-3 py-2 rounded hover:bg-gray-100 text-sm"
                    >
                        None
                    </button>

                    {selectedUsers.length > 0 && (
                        <button
                            onClick={() => {
                                setDeleteMode("bulk");
                                setConfirmOpen(true);
                            }}
                            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            <Trash2 size={16} />
                            Delete ({selectedUsers.length})
                        </button>
                    )}

                    <AdminCreateDialog onSuccess={fetchUsers} />

                </div>

            </div>

            {/* Users Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {users.map((user, index) => {

                    const selected = selectedUsers.includes(user.email);

                    return (
                        <motion.div
                            key={user.email}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleSelect(user.email)}
                            className={`group border rounded-xl p-5 relative cursor-pointer transition
                            ${selected
                                    ? "border-red-500 bg-red-50"
                                    : "hover:shadow-md"
                                }`}
                        >

                            {/* Checkbox */}
                            <div
                                className={`absolute top-3 right-3 transition
                                ${selected
                                        ? "opacity-100"
                                        : "opacity-0 group-hover:opacity-100"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    readOnly
                                    className="w-4 h-4"
                                />
                            </div>

                            {/* Avatar */}
                            <div className="flex items-center gap-3 mb-4">

                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 className="font-semibold">
                                        {user.name}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        {user.email}
                                    </p>
                                </div>

                            </div>

                            {/* Info */}
                            <div className="text-sm space-y-1">

                                <p>
                                    <span className="font-medium">Role:</span>{" "}
                                    {user.role}
                                </p>

                                <p>
                                    <span className="font-medium">Tokens:</span>{" "}
                                    {user.tokens ?? 0}
                                </p>

                            </div>

                            {/* Delete */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteMode("single");
                                    setDeleteEmail(user.email);
                                    setConfirmOpen(true);
                                }}
                                className="mt-4 text-red-500 flex items-center gap-1 text-sm hover:text-red-700"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>

                        </motion.div>
                    );
                })}

            </div>

            <AlertDialog open={messageOpen} onOpenChange={setMessageOpen}>
                <AlertDialogContent className="sm:max-w-sm text-center">

                    <div className="flex flex-col items-center gap-4">

                        {/* Success Icon */}
                        <div className="bg-green-100 p-3 rounded-full">
                            <CheckCircle2 className="text-green-600 w-8 h-8" />
                        </div>

                        <AlertDialogHeader>

                            <AlertDialogTitle className="text-green-600 text-xl">
                                Success
                            </AlertDialogTitle>

                            <AlertDialogDescription className="text-gray-600">
                                {messageText}
                            </AlertDialogDescription>

                        </AlertDialogHeader>

                        <AlertDialogFooter className="w-full mb-1">

                            <AlertDialogAction
                                onClick={() => setMessageOpen(false)}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                                OK
                            </AlertDialogAction>

                        </AlertDialogFooter>

                    </div>

                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>

                <AlertDialogContent>

                    <AlertDialogHeader>

                        <AlertDialogTitle>
                            Confirm Delete
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {deleteMode === "single"
                                ? "Are you sure you want to delete this user? This action cannot be undone."
                                : `Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
                        </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>

                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>

                    </AlertDialogFooter>

                </AlertDialogContent>

            </AlertDialog>
        </div>
    );
}