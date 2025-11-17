import React from 'react'
import { MapPin, Plus, Star } from 'lucide-react'

const CandidateCards = ({candidate}) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg shadow-gray-200 transition-all cursor-pointer max-w-5xl w-full">
            <header className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&w=120&h=120&q=80"
                        alt={candidate.name}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-md font-semibold text-gray-900">{candidate.name}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="text-[var(--primary-color,#1dbf73)] font-medium">{candidate.role}</span>
                            <span className="flex items-center gap-1">
                                <MapPin size={16} className="text-gray-400" />
                                {candidate.city}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="secondary-btn flex items-center gap-2">
                    <Plus size={20} />Follow
                </button>
            </header>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">{candidate.about}</p>

            <div className='flex items-center gap-4 justify-between'>
                <div className="mt-4 flex flex-wrap gap-3">
                    {candidate.skills.map((skill) => (
                        <span
                            key={skill}
                            className="rounded-full bg-[var(--accent-color)] px-4 py-1.5 text-sm font-medium text-[var(--primary-color)] "
                        >
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="mt-5 flex items-center gap-2 justify-end">
                    <span className="text-2xl text-[var(--primary-color)] font-semibold">{candidate.rate}/{candidate.rateType || 'Day'}</span> 
                </div>
            </div>
        </div>

    )
}

export default CandidateCards