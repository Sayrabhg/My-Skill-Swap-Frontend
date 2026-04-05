import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createSwapSession, getSkillsByUserId } from "../../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft } from "lucide-react";

export default function CreateRequest() {

    const { mentorId, skillId } = useParams();
    const navigate = useNavigate();

    const [skill, setSkill] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("success");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    // ================= LOAD SKILL =================
    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const res = await getSkillsByUserId(mentorId);
                const mentorSkills = res.data || [];

                const selectedSkill = mentorSkills.find(
                    (s) => s.id === skillId
                );

                if (selectedSkill) {
                    setSkill(selectedSkill.skillOffered);
                }
            } catch (error) {
                console.error("Skill load error:", error);
            }
        };

        if (mentorId && skillId) {
            fetchSkill();
        }
    }, [mentorId, skillId]);

    // ================= SUBMIT =================
    const handleSubmit = async () => {

        if (!scheduledTime || !tokenAmount) {
            setDialogMessage("Please fill all fields");
            setStatus("error");
            setDialogOpen(true);
            return;
        }

        try {
            setLoading(true);

            const sessionData = {
                skill: skill,
                scheduledTime: new Date(scheduledTime).toISOString(),
                tokenAmount: Number(tokenAmount)
            };

            console.log("Sending:", sessionData);

            await createSwapSession(mentorId, sessionData);

            setDialogMessage("Session request sent successfully");
            setStatus("success");
            setDialogOpen(true);

            setTimeout(() => {
                navigate(-1);
            }, 1500);

            setScheduledTime("");
            setTokenAmount("");

        } catch (error) {
            console.error("Create session error:", error);

            setDialogMessage(
                error?.response?.data || "Failed to send request"
            );

            setStatus("error");
            setDialogOpen(true);

        } finally {
            setLoading(false);
        }
    };

    // ================= UI =================
    return (
        <div className="relative dark:bg-gray-800 py-6">
            <div className="max-w-xl mx-auto m-10 bg-white dark:bg-gray-700 shadow-lg rounded-xl p-6">

                <div className="absolute top-6 left-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:scale-110 rounded-full shadow-md hover:bg-indigo-200 transition-all"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Dialog */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="text-center">
                        <DialogHeader>
                            <DialogTitle>Skill Swap</DialogTitle>
                            <DialogDescription
                                className={`text-base mt-2 font-medium ${status === "success"
                                    ? "text-green-500"
                                    : "text-red-500"
                                    }`}
                            >
                                {dialogMessage}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <h2 className="text-2xl font-bold mb-4">
                    Send Skill Request
                </h2>

                <p className="text-gray-500 dark:text-gray-300 mb-6">
                    Request this mentor for a skill swap.
                </p>

                <div className="space-y-4">

                    {/* Skill */}
                    <div>
                        <label className="text-sm font-medium">
                            Selected Skill
                        </label>
                        <input
                            type="text"
                            value={skill}
                            readOnly
                            className="w-full border rounded-lg p-3 mt-1 bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Time */}
                    <div>
                        <label className="text-sm font-medium">
                            Schedule Time
                        </label>
                        <input
                            type="datetime-local"
                            min={new Date().toISOString().slice(0, 16)}
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                    {/* Tokens */}
                    <div>
                        <label className="text-sm font-medium">
                            Token Amount
                        </label>
                        <input
                            type="number"
                            placeholder="Example: 50"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className="w-full border rounded-lg p-3 mt-1"
                        />
                    </div>

                    {/* Button */}
                    <Button
                        className="w-full dark:text-white cursor-pointer py-6"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Request"}
                    </Button>

                </div>
            </div>
        </div>
    );
}