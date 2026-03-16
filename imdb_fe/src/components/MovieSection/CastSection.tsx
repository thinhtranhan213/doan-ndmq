import React from 'react';
import { useExpandableList } from '../../hooks/useExpandableList';
import { getImageUrl, IMAGE_SIZES } from '../../utils/constants';
import { Cast } from '../../types/movie.types';
interface Props {
    cast: Cast[];
}

const CastSection: React.FC<Props> = ({ cast }) => {
    const castList = useExpandableList(cast, 6);

    if (cast.length === 0) return null;

    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">👥 Top Cast</h2>

            {/* Cast list */}
            <div
                className={`
                                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
                                transition-all duration-300
                                ${castList.expanded ? '' : 'max-h-[160px] overflow-hidden relative'}
                            `}
            >
                {castList.visibleItems.map((member: Cast) => (
                    <div key={member.id} className="flex items-center gap-4">
                        <img
                            src={getImageUrl(member.profile_path, IMAGE_SIZES.PROFILE_MEDIUM)}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover bg-imdb-gray"
                        />

                        <div>
                            <p className="text-white font-semibold leading-tight">
                                {member.name}
                            </p>
                            <p className="text-gray-400 text-sm leading-tight">
                                {member.character}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Fade bottom */}
                {!castList.expanded && castList.canToggle && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-imdb-dark to-transparent" />
                )}
            </div>

            {/* Toggle button */}
            {castList.canToggle && (
                <div className="mt-4 text-center">
                    <button
                        onClick={castList.toggle}
                        className="
                                    text-gray-400
                                    bg-gradient-to-b from-gray-400/40 to-gray-400/80
                                    bg-clip-text text-transparent
                                    transition-all duration-300
                                    hover:from-gray-200 hover:to-gray-200
                                    hover:text-gray-200
                                "
                    >
                        <i
                            className={`fa-solid ${castList.expanded ? 'fa-angles-up' : 'fa-angles-down'
                                }`}
                        />
                    </button>
                </div>
            )}
        </section>
    );
};

export default CastSection;
