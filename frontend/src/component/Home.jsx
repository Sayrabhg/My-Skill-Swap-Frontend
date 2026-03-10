
import HeroSection from "./page/HeroSection";
import HowItWorks from "./page/HowItWorks";
import LiveStats from "./page/LiveStats";
import TestimonialBento from "./page/TestimonialBento";
import TrendingSwaps from "./page/TrendingSwaps";

export default function Home() {
    return (
        <>
            <HeroSection />
            <HowItWorks />
            <TrendingSwaps />
            <LiveStats />
            <TestimonialBento />
        </>
    )
}