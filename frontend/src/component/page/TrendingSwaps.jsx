import React from "react";
import { cn } from "@/lib/utils";
import { testimonials } from "./data/testimonialData";
import { Marquee } from "@/components/ui/marquee";

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({ image, name, skill, quote }) => {
    return (
        <figure
            className={cn(
                "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl border p-5",
                "border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm hover:shadow-lg"
            )}
        >
            <div className="flex items-center gap-3">
                <img
                    className="rounded-full w-10 h-10 object-cover"
                    src={image}
                    alt={name}
                />

                <div className="flex flex-col">
                    <figcaption className="text-sm font-semibold text-gray-800">
                        {name}
                    </figcaption>

                    <p className="text-xs text-indigo-500">{skill}</p>
                </div>
            </div>

            <blockquote className="mt-3 text-sm text-gray-600 leading-relaxed">
                “{quote}”
            </blockquote>
        </figure>
    );
};

const TestimonialMarquee = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-100">

            {/* Heading */}
            <div className="text-center mb-14">
                <h2 className="text-4xl font-bold text-gray-800">
                    💬 What Our Learners Say
                </h2>
                <p className="text-gray-500 mt-3">
                    Real experiences from our global SkillSwap community
                </p>
            </div>

            {/* Marquee Testimonials */}
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">

                {/* Row 1 */}
                <Marquee pauseOnHover className="[--duration:25s]">
                    {firstRow.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                    ))}
                </Marquee>

                {/* Row 2 */}
                <Marquee reverse pauseOnHover className="[--duration:25s]">
                    {secondRow.map((review, index) => (
                        <ReviewCard key={index} {...review} />
                    ))}
                </Marquee>

                {/* Gradient edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>

            </div>
        </section>
    );
};

export default TestimonialMarquee;