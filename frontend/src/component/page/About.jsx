import { useEffect, useRef, useState } from "react";
import { Users, Globe, BookOpen, Sparkles, Star, Heart } from "lucide-react";
import Stats from "./components/Stats";

const About = () => {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`bg-gray-50 py-16 ${visible ? "show" : ""}`}
        >
            <div className="max-w-7xl mx-auto px-6">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-primary py-2 relative inline-block">
                        About Skill Swap
                        <span className="absolute left-0 -bottom-2 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient"></span>
                    </h1>
                    <p className="text-gray-600 max-w-3xl mx-auto mt-6">
                        Skill Swap is a modern peer-to-peer learning platform where people exchange knowledge instead of paying for it. Build a global community to teach what you know and learn what you love.
                    </p>
                </div>

                {/* Mission + Why Skill Swap */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-l-8 border-primary animate-fadeIn">
                        <h2 className="text-2xl font-semibold mb-4 text-dark">Our Mission</h2>
                        <p className="text-gray-600 mb-2">Make learning accessible to everyone. Connect people who want to share their skills with those who want to learn.</p>
                        <p className="text-gray-600">In 2026, Skill Swap empowers individuals to grow personally and professionally through meaningful knowledge exchange.</p>
                    </div>

                    <div className="bg-gradient-to-tr from-blue-100 via-indigo-200 to-teal-100 p-8 rounded-2xl shadow-lg animate-float">
                        <h3 className="text-xl font-semibold mb-4 text-primary">Why Skill Swap?</h3>
                        <ul className="space-y-3 text-gray-700">
                            <li>• Learn new skills from real people</li>
                            <li>• Share your expertise with the community</li>
                            <li>• Connect with learners worldwide</li>
                            <li>• Grow without expensive courses</li>
                        </ul>
                    </div>
                </div>

                {/* Feature Cards with Background Shapes */}
                <div className="grid md:grid-cols-4 gap-8 text-center mb-16 relative">
                    <div className="absolute -top-12 -left-10 w-32 h-32 bg-blue-100 rounded-full opacity-40 -z-10 animate-spin-slow"></div>
                    <div className="absolute -bottom-16 -right-10 w-48 h-48 bg-pink-200 rounded-full opacity-30 -z-10 animate-spin-slow-reverse"></div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition pop-card pop-delay-1 hover:-translate-y-2 transform">
                        <Users className="mx-auto text-primary mb-3" size={32} />
                        <h3 className="font-semibold">Community</h3>
                        <p className="text-sm text-gray-600 mt-2">Connect with learners and mentors worldwide.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition pop-card pop-delay-2 hover:-translate-y-2 transform">
                        <BookOpen className="mx-auto text-secondary mb-3" size={32} />
                        <h3 className="font-semibold">Learn Skills</h3>
                        <p className="text-sm text-gray-600 mt-2">Discover new skills from passionate individuals.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition pop-card pop-delay-3 hover:-translate-y-2 transform">
                        <Sparkles className="mx-auto text-accent mb-3" size={32} />
                        <h3 className="font-semibold">Share Knowledge</h3>
                        <p className="text-sm text-gray-600 mt-2">Teach others what you know and inspire growth.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition pop-card pop-delay-4 hover:-translate-y-2 transform">
                        <Globe className="mx-auto text-green-500 mb-3" size={32} />
                        <h3 className="font-semibold">Global Network</h3>
                        <p className="text-sm text-gray-600 mt-2">Collaborate with people across the world.</p>
                    </div>
                </div>

                {/* Stats Section */}
                <Stats />

                {/* Testimonials */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold text-primary mb-8">What Our Users Say</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
                            <Star className="text-yellow-400 mx-auto mb-3" size={28} />
                            <p className="text-gray-600">“Skill Swap helped me learn coding quickly and connect with experts!”</p>
                            <span className="text-gray-500 mt-2 block">— Sumit J.</span>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
                            <Heart className="text-red-400 mx-auto mb-3" size={28} />
                            <p className="text-gray-600">“Sharing my skills gave me confidence and expanded my network.”</p>
                            <span className="text-gray-500 mt-2 block">— Priya S.</span>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2">
                            <Users className="text-primary mx-auto mb-3" size={28} />
                            <p className="text-gray-600">“I found mentors and learners all in one place — amazing platform!”</p>
                            <span className="text-gray-500 mt-2 block">— Aniket K.</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;