const Img = ({ src, w, h, style, onClick }) => (
    <img
        src={src}
        alt={src}
        width={w}
        height={h}
        onClick={onClick}
        loading="lazy"
        decoding="async"
        className={style}
    />
);

export default Img