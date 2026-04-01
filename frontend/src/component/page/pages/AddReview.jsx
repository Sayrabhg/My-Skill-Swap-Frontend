import { useState } from "react";
import { createSwapSession } from "../../../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AddReview() {
    const { userId } = useParams(); // The mentor/user being reviewed
    const navigate = useNavigate();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [showDialog, setShowDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert("Please select a rating!");
            return;
        }

        const data = { rating, comment };

        try {
            setLoading(true);
            await createSwapSession(data, userId); // call API
            setShowDialog(true); // show success
        } catch (err) {
            console.error(err);
            alert("Failed to submit review. Try again!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-xl w-full max-w-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Leave a Review</h2>
                <p className="text-gray-500 mb-6">Share your experience with this mentor.</p>

                {/* Rating */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Rating</label>
                    <div className="flex gap-2 text-3xl justify-center cursor-pointer">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                onClick={() => setRating(star)}
                                className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                {/* Comment */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Write your feedback..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                    {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>}
                    {loading ? "Submitting..." : "Submit Review"}
                </button>
            </div>

            {/* Success Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
                        <div className="text-green-500 text-4xl mb-3">✓</div>
                        <h3 className="text-lg font-semibold mb-2">Review Submitted</h3>
                        <p className="text-gray-500 mb-4">Thank you for your feedback!</p>
                        <button
                            onClick={() => {
                                setShowDialog(false);
                                navigate("/dashboard");
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}