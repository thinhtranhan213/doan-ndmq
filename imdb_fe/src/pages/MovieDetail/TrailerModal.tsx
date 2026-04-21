import React, { useEffect, useState } from 'react';
import { getMovieVideos } from '../../api/endpoints';
import { Video } from '../../types/movie.types';

interface Props {
    movieId: number;
    onClose: () => void;
}

const TrailerModal: React.FC<Props> = ({ movieId, onClose }) => {
    const [video, setVideo] = useState<Video | null>(null);

    useEffect(() => {
    let isMounted = true;

    const fetchTrailer = async () => {
        try {
            const res = await getMovieVideos(movieId);

            if (!isMounted) return;

            const youtubeVideos = res.results.filter(
                (v) =>
                    v.site === 'YouTube' &&
                    (v.type === 'Trailer' || v.type === 'Teaser')
            );

            const sorted = youtubeVideos.sort((a, b) => {
                if (a.official && !b.official) return -1;
                if (!a.official && b.official) return 1;
                return 0;
            });

            if (sorted.length > 0) {
                setVideo(sorted[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    fetchTrailer();

    return () => {
        isMounted = false;
    };
}, [movieId]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!video) {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center text-white"
        onClick={onClose}>
            Loading trailer...
        </div>
    );
}




    const embedUrl = `https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`;

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-6 text-white text-3xl"
            >
                ✕
            </button>

            {/* Video */}
            <div className="w-[90%] md:w-[70%] lg:w-[60%] aspect-video" onClick={(e) => e.stopPropagation()}>
                <iframe
                    className="w-full h-full rounded-lg"
                    src={embedUrl}
                    title={video.name}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default TrailerModal;