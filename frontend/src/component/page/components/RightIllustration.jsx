import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import gemini from "../../../assets/1931.png";

const RightIllustration = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2, // triggers when 20% is visible
    });

    useEffect(() => {
        if (inView) {
            controls.start({
                x: 0,
                opacity: 1,
                transition: { duration: 1, type: "spring", stiffness: 50 },
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ x: 200, opacity: 0 }} // starts off-screen right
            animate={controls}
            className="overflow-hidden rounded-3xl shadow-2xl"
        >
            <img
                src={gemini}
                alt="Skill Exchange"
                className="w-full max-w-lg object-cover"
                style={{ borderRadius: "2rem" }} // extra round corners
            />
        </motion.div>
    );
};

export default RightIllustration;