const Img = ({ src, alt = "image", w, h, style }) => (
    <img
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading="lazy"
        decoding="async"
        className={style}
    />
);

export default Img