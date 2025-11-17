import { Group, MapPin, Plus } from 'lucide-react'

const CompanyCard = ({ company }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg shadow-gray-200 transition-all cursor-pointer max-w-5xl w-full">
            <header className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=facearea&w=120&h=120&q=80"
                        alt={company.name}
                        className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-md font-semibold text-gray-900">{company.company}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 text-[var(--primary-color,#1dbf73)] font-medium">
                                <MapPin size={18} className="text-gray-400" />
                                {company.country}
                            </span>
                            <span className="flex items-center gap-1">
                                <Group size={18} className="text-gray-400" />
                                {company.members}
                            </span>
                        </div>
                    </div>
                </div>
                <button className="secondary-btn flex items-center gap-2">
                    <Plus size={20} />Follow
                </button>
            </header>

            <p className="mt-4 text-gray-600 text-lg leading-relaxed">{company.about}</p>

            <div className='flex items-center gap-4 justify-between'>
                <div className="mt-4 flex flex-wrap gap-3">
                    <span
                        className="rounded-full bg-[var(--accent-color)] px-4 py-1.5 text-sm font-medium text-[var(--primary-color)] "
                    >
                        {company.industry}
                    </span>
                </div>
                <div>
                    <span className='text-[var(--primary-color)] font-semibold'>{company.sentJobs.length}</span> jobs available
                </div>
            </div>
        </div>

    )
}

export default CompanyCard