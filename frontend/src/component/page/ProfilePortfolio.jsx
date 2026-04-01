import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { getUserById } from "../../api/api";

export default function ProfilePortfolio() {
    const { user2Id } = useParams();
    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [availability, setAvailability] = useState({});

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const times = ["10AM", "12PM", "2PM", "4PM", "6PM"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserById(user2Id);
                const { user: fetchedUser, skills: fetchedSkills } = res.data;
                setUser(fetchedUser);
                setSkills(fetchedSkills || []);
                setReviews(fetchedUser.reviews || []);
            } catch (err) {
                console.error("Failed to load user profile:", err);
            }
        };
        if (user2Id) fetchData();
    }, [user2Id]);

    const toggleSlot = (day, time) => {
        const key = `${day}-${time}`;
        setAvailability((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{user.name} | Mentor Profile</title>
            </Helmet>

            <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
                {/* PROFILE HEADER */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                    <img
                        src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${user.name || "User"}&background=6366f1&color=fff`
                        }
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="text-center sm:text-left flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-500 text-sm sm:text-base">{user.role || "Mentor"}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2 text-sm">
                            <span className="text-yellow-500">⭐ {user.rating || 0} Rating</span>
                            {user.verified && <span className="text-green-600">✔ Verified Mentor</span>}
                            <span>{user.sessionsCompleted || 0} Sessions Completed</span>
                        </div>
                    </div>
                </div>

                {/* SKILL BADGES */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Skill Badges</h2>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 border px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gray-50"
                            >
                                {/* <span className="text-lg">{skill.icon}</span> */}
                                <span className="font-medium text-sm sm:text-base">{skill.skillOffered}</span>
                                {skill.verified && <span className="text-green-600 text-xs">✔</span>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* REVIEWS */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Student Reviews</h2>
                    <div className="space-y-4 sm:space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border-l-4 border-indigo-500 pl-3 sm:pl-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                                    <h3 className="font-semibold text-sm sm:text-base">{review.student}</h3>
                                    <span className="text-xs sm:text-sm text-gray-400">{review.date}</span>
                                </div>
                                <p className="text-yellow-500 text-sm mt-1">{'⭐'.repeat(review.rating)}</p>
                                <p className="text-gray-600 text-xs sm:text-sm">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AVAILABILITY */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Teaching Availability</h2>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1 sm:gap-2 text-xs sm:text-sm min-w-max">
                            <div></div>
                            {days.map((day) => (
                                <div key={day} className="font-semibold text-center">{day}</div>
                            ))}

                            {times.map((time) => (
                                <React.Fragment key={time}>
                                    <div className="font-medium flex items-center justify-center">{time}</div>
                                    {days.map((day) => {
                                        const key = `${day}-${time}`;
                                        return (
                                            <div
                                                key={key}
                                                onClick={() => toggleSlot(day, time)}
                                                className={`h-8 sm:h-10 w-full cursor-pointer rounded flex items-center justify-center ${availability[key] ? "bg-green-500 text-white" : "bg-gray-100"}`}
                                            >
                                                {availability[key] ? "✓" : ""}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-6 flex justify-end">
                        <Button size="sm">Save Availability</Button>
                    </div>
                </div>
            </div>
        </>
    );
}