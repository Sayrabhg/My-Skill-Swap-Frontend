import { useState } from "react";
import { createAdmin } from "@/api/api";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";

export default function AdminCreateDialog() {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [messageOpen, setMessageOpen] = useState(false);
    const [messageType, setMessageType] = useState("");
    const [messageText, setMessageText] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        try {

            setLoading(true);

            await createAdmin(form);

            setMessageType("success");
            setMessageText("User created successfully.");
            setMessageOpen(true);

            setForm({
                name: "",
                email: "",
                password: ""
            });

            setOpen(false);

        } catch (err) {

            console.error(err);

            setMessageType("error");
            setMessageText(
                err.response?.data?.message || "Failed to create user"
            );

            setMessageOpen(true);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            {/* Create User Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>

                <DialogTrigger asChild>
                    <Button className="bg-primary py-5 text-white border border-primary cursor-pointer transition-all duration-300 hover:bg-white hover:text-primary">
                        Create Account
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">

                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        />

                        {/* Password */}
                        <div className="relative">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2 pr-10"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword
                                    ? <EyeOff size={18} />
                                    : <Eye size={18} />}
                            </button>

                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                        >

                            {loading && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            )}

                            {loading ? "Creating..." : "Create User"}

                        </Button>

                    </div>

                </DialogContent>

            </Dialog>

            {/* Message Dialog */}
            <Dialog open={messageOpen} onOpenChange={setMessageOpen}>

                <DialogContent className="sm:max-w-sm text-center">

                    <DialogHeader>
                        <DialogTitle>
                            {messageType === "success" ? "Success" : "Error"}
                        </DialogTitle>
                    </DialogHeader>

                    <p
                        className={`text-sm ${messageType === "success"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                    >
                        {messageText}
                    </p>

                    <Button
                        onClick={() => setMessageOpen(false)}
                        className="w-full mt-4"
                    >
                        OK
                    </Button>

                </DialogContent>

            </Dialog>

        </>
    );
}