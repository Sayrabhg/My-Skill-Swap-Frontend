import React from "react";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import { testimonials } from "./data/testimonialData";
import { Marquee } from "@/components/ui/marquee";

const firstRow = testimonials.slice(0, testimonials.length / 2);
const secondRow = testimonials.slice(testimonials.length / 2);

const ReviewCard = ({ image, name, skill, quote }) => {
    return (
        <article
            className={cn(
                "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl border p-5",
                "border-gray-200 bg-white hover:bg-gray-50 transition shadow-sm hover:shadow-lg"
            )}
        >
            <header className="flex items-center gap-3">
                <img
                    className="rounded-full w-10 h-10 object-cover"
                    src={image}
                    alt={`Photo of ${name}`}
                    loading="lazy"
                />
                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
                    <p className="text-xs text-indigo-500">{skill}</p>
                </div>
            </header>

            <blockquote className="mt-3 text-sm text-gray-600 leading-relaxed">
                “{quote}”
            </blockquote>
        </article>
    );
};

const TestimonialMarquee = () => {
    return (
        <section
            className="py-20 px-6 bg-gradient-to-b from-white to-gray-100"
            aria-labelledby="testimonial-heading"
        >
            {/* React Helmet for SEO */}
            <Helmet>
                <title>What Our Learners Say | SkillSwap</title>
                <meta
                    name="description"
                    content="Read real experiences from our global SkillSwap community. See what learners say about our skill-sharing platform."
                />
                <meta name="robots" content="index, follow" />
            </Helmet>

            {/* Heading */}
            <div className="text-center mb-14">
                <h2
                    id="testimonial-heading"
                    className="text-4xl font-bold text-gray-800"
                >
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