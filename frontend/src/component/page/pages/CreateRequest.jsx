import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createSwapSession, getProfile, getSkillsByUserId } from "../../../api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export default function CreateRequest() {

    const { mentorId, skillId } = useParams();
    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [tokenAmount, setTokenAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("success");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

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

                console.error(error);

            }

        };

        fetchSkill();

    }, [mentorId, skillId]);

    const handleSubmit = async () => {

        try {

            setLoading(true);

            const profileRes = await getProfile();
            const studentId = profileRes.data.id;

            const sessionData = {
                skill: skill,
                scheduledTime: scheduledTime,
                tokenAmount: Number(tokenAmount)
            };

            await createSwapSession(mentorId, studentId, sessionData);

            setDialogMessage("Session request sent successfully");
            setStatus("success");
            setDialogOpen(true);

            setTimeout(() => {
                navigate(-1);
            }, 1500);

            setSkill("");
            setScheduledTime("");
            setTokenAmount("");

        } catch (error) {

            console.error(error);

            setDialogMessage("Failed to send request");
            setStatus("error");
            setDialogOpen(true);

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-xl mx-auto m-10 bg-white shadow-lg rounded-xl p-6">

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

            <p className="text-gray-500 mb-6">
                Request this mentor for a skill swap.
            </p>

            <div className="space-y-4">

                {/* Skill Dropdown */}
                <div>
                    <label className="text-sm font-medium">
                        Selected Skill
                    </label>

                    <input
                        type="text"
                        value={skill}
                        readOnly
                        className="w-full border rounded-lg p-3 mt-1 bg-gray-100"
                    />
                </div>

                {/* Scheduled Time */}
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

                {/* Token Amount */}
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

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send Request"}
                </Button>

            </div>

        </div>
    );
}