import { useRef, useEffect, useState } from "react";

export default function VerticalScroller({ cards }) {
    const listRef = useRef(null);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        if (listRef.current) {
            setListHeight(listRef.current.offsetHeight);
        }
    }, [cards]);

    return (
        <div className="relative h-[730px] overflow-hidden group">
            <div
                className="scroll-vertical group-hover:[animation-play-state:paused]"
                style={{
                    animationDuration: `${listHeight / 40}s`, // adjust speed here
                    "--scroll-height": `${listHeight}px`,
                }}
            >
                <div ref={listRef} className="flex flex-col gap-6">
                    {cards}
                </div>

                {/* Duplicate list for infinite loop */}
                <div className="flex flex-col gap-6">
                    {cards}
                </div>
            </div>
        </div>
    );
}
