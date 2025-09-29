import { useEffect } from "react";

const useGlobalLazyImages = () => {
  useEffect(() => {
    const imgs = document.querySelectorAll("img");
    imgs.forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    });
  }, []);
};

export default useGlobalLazyImages;