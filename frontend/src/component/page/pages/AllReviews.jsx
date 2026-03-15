import { useEffect, useState } from "react";
import { getAllReviews, deleteReviewById } from "../../../api/api";
import Loading from "../components/Loading";

export default function AllReviews() {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await getAllReviews();
            setReviews(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async () => {
        try {
            await deleteReviewById(selectedReview.id);
            setSelectedReview(null);
            setShowSuccessDialog(true);
            fetchReviews();
        } catch (err) {
            console.error(err);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span
                key={i}
                className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
            >
                ★
            </span>
        ));
    };

    /* ---------------- LOADING RETURN ---------------- */

    if (loading) return <Loading message="Loading reviews..." />;


    /* ---------------- MAIN UI ---------------- */

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    User Reviews
                </h1>

                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">
                        No reviews available.
                    </p>
                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
                            >

                                <div className="flex items-center gap-3 mb-3">

                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                        {review.userId?.charAt(0).toUpperCase()}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            User
                                        </p>

                                        <div className="flex">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>

                                </div>

                                <p className="text-gray-600 text-sm mb-4">
                                    {review.comment}
                                </p>

                                <button
                                    onClick={() => setSelectedReview(review)}
                                    className="text-red-500 text-sm font-semibold hover:text-red-700"
                                >
                                    Delete Review
                                </button>

                            </div>

                        ))}

                    </div>
                )}

            </div>

            {/* Delete Confirmation Dialog */}
            {selectedReview && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">

                        <h3 className="text-lg font-semibold mb-3">
                            Delete Review
                        </h3>

                        <p className="text-gray-500 mb-5">
                            Are you sure you want to delete this review?
                        </p>

                        <div className="flex justify-center gap-3">

                            <button
                                onClick={() => setSelectedReview(null)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* Success Dialog */}
            {showSuccessDialog && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">

                        <div className="text-green-500 text-4xl mb-3">
                            ✓
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            Review Deleted
                        </h3>

                        <p className="text-gray-500 mb-4">
                            The review has been successfully removed.
                        </p>

                        <button
                            onClick={() => setShowSuccessDialog(false)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}