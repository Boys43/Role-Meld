import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

// React Icons
import { FaQuoteRight } from "react-icons/fa";

const Testimonials = () => {
    return (
        <div className="mt-4 relative z-0">
            <Swiper
                modules={[Autoplay]}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 10,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 20,
                    },
                }}
            >
                {/** Testimonial card repeated */}
                <SwiperSlide>
                    <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                        <h2 className="flex items-center gap-4 font-semibold">
                            <FaQuoteRight
                                className="text-[var(--primary-color)]"
                                size={50}
                            />
                        </h2>
                        <p className="line-clamp-5">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                            aliquam qui officia commodi mollitia tenetur explicabo quidem,
                            cupiditate quia, eaque, dolorem corrupti consectetur.
                        </p>
                        <p className="flex items-center gap-4">
                            <img
                                src="https://picsum.photos/300/300?random=1"
                                alt="Alt"
                                className="h-10 w-10 rounded-full object-cover border"
                            />{" "}
                            Nouman Tariq
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                        <h2 className="flex items-center gap-4 font-semibold">
                            <FaQuoteRight
                                className="text-[var(--primary-color)]"
                                size={50}
                            />
                        </h2>
                        <p className="line-clamp-5">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                            aliquam qui officia commodi mollitia tenetur explicabo quidem,
                            cupiditate quia, eaque, dolorem corrupti consectetur.
                        </p>
                        <p className="flex items-center gap-4">
                            <img
                                src="https://picsum.photos/300/300?random=2"
                                alt="Alt"
                                className="h-10 w-10 rounded-full object-cover border"
                            />{" "}
                            Nouman Tariq
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                        <h2 className="flex items-center gap-4 font-semibold">
                            <FaQuoteRight
                                className="text-[var(--primary-color)]"
                                size={50}
                            />
                        </h2>
                        <p className="line-clamp-5">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                            aliquam qui officia commodi mollitia tenetur explicabo quidem,
                            cupiditate quia, eaque, dolorem corrupti consectetur.
                        </p>
                        <p className="flex items-center gap-4">
                            <img
                                src="https://picsum.photos/300/300?random=3"
                                alt="Alt"
                                className="h-10 w-10 rounded-full object-cover border"
                            />{" "}
                            Nouman Tariq
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                        <h2 className="flex items-center gap-4 font-semibold">
                            <FaQuoteRight
                                className="text-[var(--primary-color)]"
                                size={50}
                            />
                        </h2>
                        <p className="line-clamp-5">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                            aliquam qui officia commodi mollitia tenetur explicabo quidem,
                            cupiditate quia, eaque, dolorem corrupti consectetur.
                        </p>
                        <p className="flex items-center gap-4">
                            <img
                                src="https://picsum.photos/300/300?random=4"
                                alt="Alt"
                                className="h-10 w-10 rounded-full object-cover border"
                            />{" "}
                            Nouman Tariq
                        </p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                        <h2 className="flex items-center gap-4 font-semibold">
                            <FaQuoteRight
                                className="text-[var(--primary-color)]"
                                size={50}
                            />
                        </h2>
                        <p className="line-clamp-5">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi
                            aliquam qui officia commodi mollitia tenetur explicabo quidem,
                            cupiditate quia, eaque, dolorem corrupti consectetur.
                        </p>
                        <p className="flex items-center gap-4">
                            <img
                                src="https://picsum.photos/300/300?random=5"
                                alt="Alt"
                                className="h-10 w-10 rounded-full object-cover border"
                            />{" "}
                            Nouman Tariq
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};

export default Testimonials;