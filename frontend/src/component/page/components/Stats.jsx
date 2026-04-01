import { useEffect, useRef, useState } from "react";

const Stats = () => {
    const sectionRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // Counters state
    const [learners, setLearners] = useState(0);
    const [skills, setSkills] = useState(0);
    const [countries, setCountries] = useState(0);
    const [exchanges, setExchanges] = useState(0);

    // Target numbers
    const TARGETS = {
        learners: 10000,
        skills: 5000,
        countries: 50,
        exchanges: 20000
    };

    // Trigger animation when visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);

        return () => {
            if (sectionRef.current) observer.unobserve(sectionRef.current);
        };
    }, []);

    // Animate counters
    useEffect(() => {
        if (!visible) return;

        const duration = 2000; // 2 seconds
        const steps = 100; // more steps for smooth counting
        const intervalTime = duration / steps;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            setLearners(Math.min(Math.floor((TARGETS.learners * currentStep) / steps), TARGETS.learners));
            setSkills(Math.min(Math.floor((TARGETS.skills * currentStep) / steps), TARGETS.skills));
            setCountries(Math.min(Math.floor((TARGETS.countries * currentStep) / steps), TARGETS.countries));
            setExchanges(Math.min(Math.floor((TARGETS.exchanges * currentStep) / steps), TARGETS.exchanges));

            if (currentStep >= steps) clearInterval(interval);
        }, intervalTime);

        return () => clearInterval(interval);
    }, [visible]);

    // Format numbers with K+ dynamically
    const formatNumber = (num) => {
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
        return num;
    };

    return (
        <div
            ref={sectionRef}
            className="bg-gradient-to-r relative z-0 from-blue-800 via-indigo-600 to-purple-600 text-white rounded-2xl py-12 px-6 mt-16 shadow-lg"
        >
            <div className="grid md:grid-cols-4 text-center gap-8">
                <div>
                    <span className="text-3xl font-bold">{formatNumber(learners)}</span>
                    <p className="text-sm">Active Learners</p>
                </div>

                <div>
                    <span className="text-3xl font-bold">{formatNumber(skills)}</span>
                    <p className="text-sm">Skills Shared</p>
                </div>

                <div>
                    <span className="text-3xl font-bold">{formatNumber(countries)}</span>
                    <p className="text-sm">Countries</p>
                </div>

                <div>
                    <span className="text-3xl font-bold">{formatNumber(exchanges)}</span>
                    <p className="text-sm">Skill Exchanges</p>
                </div>
            </div>
        </div>
    );
};

export default Stats;