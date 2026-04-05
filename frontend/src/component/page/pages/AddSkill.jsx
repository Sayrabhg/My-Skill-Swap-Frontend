import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSkill } from "../../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Navigate, useNavigate } from "react-router-dom";

export default function AddSkill() {

    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const [status, setStatus] = useState("success");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    const [formData, setFormData] = useState({
        skillOffered: "",
        skillWanted: "",
        category: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            await createSkill({
                ...formData,
                userId
            });

            setFormData({
                skillOffered: "",
                skillWanted: "",
                category: ""
            });

            setDialogMessage("Skill added successfully 🎉");
            setStatus("success");
            setDialogOpen(true);

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {

            console.error(error);

            setDialogMessage("Failed to add skill ❌");
            setStatus("error");
            setDialogOpen(true);

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-violet-50 dark:bg-gray-900 flex items-center justify-center p-6">

            {/* Dialog */}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="text-center">
                    <DialogHeader>
                        <DialogTitle>SkillSwap Skills</DialogTitle>
                        <DialogDescription
                            className={`text-base mt-2 font-medium ${status === "success"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {dialogMessage}
                        </DialogDescription>

                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Form Card */}

            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-lg border">

                <h2 className="text-2xl font-bold mb-2 text-center">
                    Add Your Skill
                </h2>

                <p className="text-gray-500 dark:text-gray-300 text-center mb-6">
                    Share what you can teach and what you want to learn
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Skill Offered */}

                    <div>

                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Skill You Offer
                        </label>

                        <input
                            type="text"
                            name="skillOffered"
                            value={formData.skillOffered}
                            onChange={handleChange}
                            placeholder="Example: Spring Boot"
                            className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                    </div>

                    {/* Skill Wanted */}

                    <div>

                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Skill You Want
                        </label>

                        <input
                            type="text"
                            name="skillWanted"
                            value={formData.skillWanted}
                            onChange={handleChange}
                            placeholder="Example: React"
                            className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />

                    </div>

                    {/* Category */}

                    <div>

                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                            required
                        >

                            <option value="">Select Category</option>
                            <option value="Technology">Technology</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Business">Business</option>
                            <option value="Language">Language</option>

                        </select>

                    </div>

                    {/* Submit */}

                    <Button
                        type="submit"
                        className="w-full dark:text-white"
                        disabled={loading}
                    >
                        {loading ? "Adding Skill..." : "Add Skill"}
                    </Button>

                </form>

            </div>

        </div>

    );
}
