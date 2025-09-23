import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import FeaturedJobCard from "./FeaturedJobCard";

const FeaturedJobs = () => {
  return (
    <div className="my-4">
      <Swiper
        modules={[Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
        }}
      >
        <SwiperSlide><FeaturedJobCard /></SwiperSlide>
        <SwiperSlide><FeaturedJobCard /></SwiperSlide>
        <SwiperSlide><FeaturedJobCard /></SwiperSlide>
        <SwiperSlide><FeaturedJobCard /></SwiperSlide>
      </Swiper>
    </div>
  );
};

export default FeaturedJobs;