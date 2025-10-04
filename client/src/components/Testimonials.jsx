import React, { useContext, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

// React Icons
import { FaQuoteRight } from "react-icons/fa";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "./Loading";
import NotFound404 from "./NotFound404";

const Testimonials = () => {
    const { backendUrl } = useContext(AppContext);
    const [testimonials, setTestimonials] = useState([])

    const [getReviewsLoading, setGetReviewsLoading] = useState(false)
    const getReviews = async () => {
        setGetReviewsLoading(true)
        try {
            const { data } = await axios.get(`${backendUrl}/api/reviews/get-reviews`)

            if (data.success) {
                setTestimonials(data.reviews);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setGetReviewsLoading(false)
        }
    }

    useEffect(() => {
        getReviews();
    }, [])
    
    if (getReviewsLoading) {
        return <Loading />
    }

    return (
        <div className="mt-4 relative z-0">
            <Swiper
                modules={[Autoplay]}
                loop={testimonials.length >= 3} // <-- dynamic
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 10 },
                    640: { slidesPerView: 2, spaceBetween: 15 },
                    1024: { slidesPerView: 3, spaceBetween: 20 },
                }}
            >

                {testimonials?.length === 0 ? <NotFound404 value={"No Testimonals Yet"} margin={"mt-5"} /> :testimonials?.slice(0, 10)?.map((e, i) => (
                    <SwiperSlide key={i}>
                        <div className="p-8 max-w-[400px] flex flex-col gap-4 rounded-2xl border shadow-xl bg-white">
                            <h2 className="flex items-center gap-4 font-semibold">
                                <FaQuoteRight
                                    className="text-[var(--primary-color)]"
                                    size={50}
                                />
                            </h2>
                            <p className="line-clamp-5 min-h-[100px]">
                                {e.review}
                            </p>
                            <p className="flex items-center gap-4">
                                <img
                                    loading="lazy"
                                    src={e.profilePicture.includes("picsum") ? e.profilePicture : backendUrl + "/uploads/" + e.profilePicture}
                                    alt={String(i)}
                                    className="h-10 w-10 rounded-full object-cover border"
                                />{" "}
                                {e.name}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Testimonials;