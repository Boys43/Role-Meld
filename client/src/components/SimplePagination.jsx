import React, { useState } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SimplePagination = ({ children, pageSize = 4 }) => {
    const [current, setCurrent] = useState(1);

    // Flatten children if it's a single wrapper with children
    const allChildren = React.Children.toArray(
        React.Children.only(children).props.children
    );

    const total = allChildren.length;
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    const visibleChildren = allChildren.slice(start, end);

    // Clone the original wrapper and inject visible children
    const wrapper = React.cloneElement(
        React.Children.only(children),
        {},
        visibleChildren
    );

    return (
        <div className="flex items-center flex-col">
            <div className="min-h-[82vh]">
                {wrapper}
            </div>
            <div
                className="mt-5"
            >
                <Pagination
                    current={current}
                    total={total}
                    pageSize={pageSize}
                    onChange={(page) => setCurrent(page)}
                    prevIcon={<ChevronLeft />} // your 
                    nextIcon={<ChevronRight />} // your 
                    
                />
            </div>
        </div>
    );
};

export default SimplePagination;