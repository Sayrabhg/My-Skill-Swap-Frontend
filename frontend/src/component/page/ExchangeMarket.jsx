import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";

const mentors = [
    {
        id: 1,
        name: "Aisha Khan",
        avatar: "https://i.pravatar.cc/150?img=5",
        skillOffered: "Spring Boot",
        skillWanted: "French",
        rating: 4.8,
        trust: 92,
        category: "Tech",
        language: "English",
    },
    {
        id: 2,
        name: "David Chen",
        avatar: "https://i.pravatar.cc/150?img=8",
        skillOffered: "React",
        skillWanted: "Guitar",
        rating: 4.6,
        trust: 88,
        category: "Tech",
        language: "English",
    },
    {
        id: 3,
        name: "Maria Lopez",
        avatar: "https://i.pravatar.cc/150?img=10",
        skillOffered: "UI/UX Design",
        skillWanted: "Cooking",
        rating: 4.9,
        trust: 95,
        category: "Arts",
        language: "Spanish",
    },
    {
        id: 4,
        name: "Rahul Sharma",
        avatar: "https://i.pravatar.cc/150?img=11",
        skillOffered: "Java",
        skillWanted: "Photography",
        rating: 4.4,
        trust: 84,
        category: "Tech",
        language: "Hindi",
    },
    {
        id: 5,
        name: "Emily Johnson",
        avatar: "https://i.pravatar.cc/150?img=12",
        skillOffered: "Photography",
        skillWanted: "Digital Marketing",
        rating: 4.7,
        trust: 90,
        category: "Arts",
        language: "English",
    },
    {
        id: 6,
        name: "Carlos Martinez",
        avatar: "https://i.pravatar.cc/150?img=13",
        skillOffered: "Cooking",
        skillWanted: "English",
        rating: 4.3,
        trust: 80,
        category: "Cooking",
        language: "Spanish",
    },
    {
        id: 7,
        name: "Priya Patel",
        avatar: "https://i.pravatar.cc/150?img=14",
        skillOffered: "Python",
        skillWanted: "Graphic Design",
        rating: 2.8,
        trust: 94,
        category: "Tech",
        language: "Hindi",
    },
    {
        id: 8,
        name: "Liam Anderson",
        avatar: "https://i.pravatar.cc/150?img=15",
        skillOffered: "Guitar",
        skillWanted: "React",
        rating: 4.5,
        trust: 86,
        category: "Arts",
        language: "English",
    },
];

export default function ExchangeMarket() {

    const [selectedMentor, setSelectedMentor] = useState(null);
    const [openFilters, setOpenFilters] = useState(false);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [language, setLanguage] = useState("Any");
    const [rating, setRating] = useState("Any");

    const filteredMentors = mentors.filter((mentor) => {

        const matchesSearch =
            mentor.name.toLowerCase().includes(search.toLowerCase()) ||
            mentor.skillOffered.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            category === "All" || mentor.category === category;

        const matchesLanguage =
            language === "Any" || mentor.language === language;

        const matchesRating =
            rating === "Any" || mentor.rating >= Number(rating);

        return (
            matchesSearch &&
            matchesCategory &&
            matchesLanguage &&
            matchesRating
        );
    });

    return (
        <>
            <Helmet>
                <title>SkillSwap Exchange Market</title>
                <meta
                    name="description"
                    content="Explore mentors and exchange skills on SkillSwap platform."
                />
            </Helmet>

            <div className="min-h-screen bg-gray-50">

                {/* HEADER */}

                <header className="bg-white shadow-sm border-b">

                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-3 justify-between items-center">

                        <h1 className="text-2xl font-bold text-indigo-600">
                            SkillSwap Market
                        </h1>

                        <input
                            type="search"
                            placeholder="Search mentors or skills..."
                            className="border rounded-lg px-4 py-2 w-full lg:w-72"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {/* Mobile Filters Button */}

                        <Button
                            className="lg:hidden"
                            onClick={() => setOpenFilters(true)}
                        >
                            Filters
                        </Button>

                    </div>

                </header>

                <div className="flex max-w-7xl mx-auto my-6 flex-wrap px-4">

                    {/* DESKTOP SIDEBAR */}

                    <aside className="hidden lg:block w-72 bg-white p-6 rounded-xl shadow-sm mr-6 h-fit">

                        <h2 className="text-lg font-semibold mb-4">Filters</h2>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm font-medium">Category</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Tech</option>
                                    <option>Arts</option>
                                    <option>Cooking</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Language</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option>Any</option>
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Spanish</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Teacher Rating</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="Any">Any</option>
                                    <option value="4">4⭐ and above</option>
                                    <option value="3">3⭐ and above</option>
                                    <option value="2">2⭐ and above</option>
                                </select>
                            </div>

                        </div>

                    </aside>

                    {/* MENTOR CARDS */}

                    <main className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {filteredMentors.map((mentor) => (

                            <article
                                key={mentor.id}
                                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition cursor-pointer"
                                onClick={() => setSelectedMentor(mentor)}
                            >

                                <div className="flex items-center gap-4">

                                    <img
                                        src={mentor.avatar}
                                        alt={mentor.name}
                                        className="w-14 h-14 rounded-full"
                                    />

                                    <div>

                                        <h3 className="font-semibold">
                                            {mentor.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            ⭐ {mentor.rating}
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-4 text-sm">

                                    <p>
                                        <strong>Teaches:</strong> {mentor.skillOffered}
                                    </p>

                                    <p>
                                        <strong>Wants:</strong> {mentor.skillWanted}
                                    </p>

                                </div>

                                <div className="mt-4 flex justify-between items-center">

                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                        Trust {mentor.trust}%
                                    </span>

                                    <Button size="sm">
                                        Quick View
                                    </Button>

                                </div>

                            </article>

                        ))}

                    </main>

                </div>

                {/* QUICK VIEW MENTOR DIALOG */}

                <Dialog
                    open={!!selectedMentor}
                    onOpenChange={() => setSelectedMentor(null)}
                >

                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                {selectedMentor?.name}'s Availability
                            </DialogTitle>
                        </DialogHeader>

                        <div className="grid grid-cols-3 gap-3 mt-4">

                            <div className="bg-indigo-100 p-3 rounded text-center">Mon 10AM</div>
                            <div className="bg-indigo-100 p-3 rounded text-center">Tue 2PM</div>
                            <div className="bg-indigo-100 p-3 rounded text-center">Wed 6PM</div>
                            <div className="bg-indigo-100 p-3 rounded text-center">Fri 11AM</div>
                            <div className="bg-indigo-100 p-3 rounded text-center">Sat 4PM</div>

                        </div>

                        <div className="mt-6 flex justify-end">

                            <Button>
                                Request Session
                            </Button>

                        </div>

                    </DialogContent>

                </Dialog>

                {/* MOBILE FILTERS POPUP */}

                <Dialog
                    open={openFilters}
                    onOpenChange={setOpenFilters}
                >

                    <DialogContent>

                        <DialogHeader>
                            <DialogTitle>
                                Filters
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-4">

                            <div>
                                <label className="text-sm font-medium">Category</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option>All</option>
                                    <option>Tech</option>
                                    <option>Arts</option>
                                    <option>Cooking</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Language</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option>Any</option>
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Spanish</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Teacher Rating</label>

                                <select
                                    className="w-full border rounded-lg p-2 mt-1"
                                    value={rating}
                                    onChange={(e) => setRating(e.target.value)}
                                >
                                    <option value="Any">Any</option>
                                    <option value="4">4⭐ and above</option>
                                    <option value="3">3⭐ and above</option>
                                    <option value="2">2⭐ and above</option>
                                </select>
                            </div>

                            <Button
                                className="w-full"
                                onClick={() => setOpenFilters(false)}
                            >
                                Apply Filters
                            </Button>

                        </div>

                    </DialogContent>

                </Dialog>

            </div>
        </>
    );
}