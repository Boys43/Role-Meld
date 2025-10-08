import React from 'react'

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div
                className="w-8 h-8 border-6 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"
            ></div>
        </div>
    )
}

export default Loading
