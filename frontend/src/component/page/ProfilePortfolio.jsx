import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const skills = [
    { name: "Java", icon: "☕", verified: true },
    { name: "Spring Boot", icon: "🌱", verified: true },
    { name: "React", icon: "⚛️", verified: true },
    { name: "System Design", icon: "🧠", verified: false },
];

const reviews = [
    {
        id: 1,
        student: "Maria Lopez",
        rating: 5,
        comment: "Amazing mentor! Explained Spring Boot clearly.",
        date: "2 days ago",
    },
    {
        id: 2,
        student: "David Chen",
        rating: 4,
        comment: "Great teaching style and very patient.",
        date: "1 week ago",
    },
    {
        id: 3,
        student: "Rahul Sharma",
        rating: 5,
        comment: "Loved the session! Learned REST APIs quickly.",
        date: "2 weeks ago",
    },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const times = ["10AM", "12PM", "2PM", "4PM", "6PM"];

export default function ProfilePortfolio() {

    const [availability, setAvailability] = useState({});

    const toggleSlot = (day, time) => {
        const key = `${day}-${time}`;
        setAvailability((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <>
            <Helmet>
                <title>Mentor Profile | SkillSwap</title>
                <meta
                    name="description"
                    content="View mentor skills, reviews, and availability on SkillSwap."
                />
            </Helmet>

            <div className="min-h-screen bg-gray-50 p-8">

                {/* PROFILE HEADER */}

                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 flex items-center gap-6">

                    <img
                        src="https://i.pravatar.cc/150?img=11"
                        className="w-24 h-24 rounded-full"
                    />

                    <div>

                        <h1 className="text-2xl font-bold">
                            Rahul Sharma
                        </h1>

                        <p className="text-gray-500">
                            Full Stack Mentor • Java Specialist
                        </p>

                        <div className="flex gap-4 mt-2 text-sm">

                            <span className="text-yellow-500">
                                ⭐ 4.8 Rating
                            </span>

                            <span className="text-green-600">
                                ✔ Verified Mentor
                            </span>

                            <span>
                                42 Sessions Completed
                            </span>

                        </div>

                    </div>

                </div>

                {/* SKILL BADGES */}

                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">

                    <h2 className="text-xl font-semibold mb-4">
                        Skill Badges
                    </h2>

                    <div className="flex flex-wrap gap-4">

                        {skills.map((skill, index) => (

                            <div
                                key={index}
                                className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-gray-50"
                            >

                                <span className="text-lg">
                                    {skill.icon}
                                </span>

                                <span className="font-medium">
                                    {skill.name}
                                </span>

                                {skill.verified && (
                                    <span className="text-green-600 text-xs">
                                        ✔
                                    </span>
                                )}

                            </div>

                        ))}

                    </div>

                </div>

                {/* REVIEW TIMELINE */}

                <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">

                    <h2 className="text-xl font-semibold mb-6">
                        Student Reviews
                    </h2>

                    <div className="space-y-6">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="border-l-4 border-indigo-500 pl-4"
                            >

                                <div className="flex justify-between">

                                    <h3 className="font-semibold">
                                        {review.student}
                                    </h3>

                                    <span className="text-sm text-gray-400">
                                        {review.date}
                                    </span>

                                </div>

                                <p className="text-yellow-500">
                                    {"⭐".repeat(review.rating)}
                                </p>

                                <p className="text-gray-600 text-sm">
                                    {review.comment}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

                {/* AVAILABILITY CALENDAR */}

                <div className="bg-white p-6 rounded-xl shadow-sm border">

                    <h2 className="text-xl font-semibold mb-6">
                        Teaching Availability
                    </h2>

                    <div className="grid grid-cols-6 gap-2 text-sm">

                        <div></div>

                        {days.map((day) => (
                            <div key={day} className="font-semibold text-center">
                                {day}
                            </div>
                        ))}

                        {times.map((time) => (

                            <>
                                <div className="font-medium flex items-center">
                                    {time}
                                </div>

                                {days.map((day) => {

                                    const key = `${day}-${time}`;

                                    return (

                                        <div
                                            key={key}
                                            onClick={() => toggleSlot(day, time)}
                                            className={`h-10 cursor-pointer rounded flex items-center justify-center ${availability[key]
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100"
                                                }`}
                                        >

                                            {availability[key] ? "✓" : ""}

                                        </div>

                                    );
                                })}

                            </>

                        ))}

                    </div>

                    <div className="mt-6 flex justify-end">

                        <Button>
                            Save Availability
                        </Button>

                    </div>

                </div>

            </div>
        </>
    );
}