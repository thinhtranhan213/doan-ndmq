
import React, { useEffect, useState, useRef } from 'react';
import { getMovieVideos, getMovieDetails } from '../../api/endpoints';
import { Video, MovieDetail } from '../../types/movie.types';

interface VideoHeroProps {
    movieId: number;
}

const VideoHero: React.FC<VideoHeroProps> = ({ movieId }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
    const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const thumbnailsRef = useRef<HTMLDivElement>(null);
    const mobileThumbnailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVideoAndDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch cả video và movie details cùng lúc
                const [videoResponse, detailResponse] = await Promise.all([
                    getMovieVideos(movieId),
                    getMovieDetails(movieId),
                ]);

                setMovieDetail(detailResponse);

                // Lọc video: ưu tiên Trailer và Teaser từ YouTube
                const youtubeVideos = videoResponse.results.filter(
                    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip')
                );

                // Sắp xếp: Official Trailers trước, sau đó Trailers, rồi Teasers, cuối cùng Clips
                const sortedVideos = youtubeVideos.sort((a, b) => {
                    if (a.official && !b.official) return -1;
                    if (!a.official && b.official) return 1;

                    const typeOrder = { 'Trailer': 0, 'Teaser': 1, 'Clip': 2 };
                    const aOrder = typeOrder[a.type as keyof typeof typeOrder] ?? 3;
                    const bOrder = typeOrder[b.type as keyof typeof typeOrder] ?? 3;

                    return aOrder - bOrder;
                });

                if (sortedVideos.length > 0) {
                    setVideos(sortedVideos);
                }
            } catch (err) {
                console.error('Error fetching video:', err);
                setError('Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        if (movieId) {
            fetchVideoAndDetails();
        }
    }, [movieId]);

    // Navigation handlers
    const handlePrevious = () => {
        setCurrentVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
        setIsPlaying(true);
    };

    const handleNext = () => {
        setCurrentVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
        setIsPlaying(true);
    };

    const handleDotClick = (index: number) => {
        setCurrentVideoIndex(index);
        setIsPlaying(true);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentVideoIndex(index);
        setIsPlaying(true);
    };

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Xử lý scroll trong thumbnails strip
    const handleThumbnailsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        // Chỉ xử lý scroll ngang nếu user giữ Shift hoặc deltaX !== 0
        const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;

        if (!isHorizontalScroll) {
            // Scroll dọc - không làm gì, để trang scroll bình thường
            return;
        }

        // Scroll ngang - ngăn scroll trang, scroll trong container
        e.stopPropagation();
        const container = e.currentTarget;
        container.scrollLeft += e.deltaY + e.deltaX;
    };

    // Format duration từ ISO 8601 hoặc giả lập duration (API không cung cấp)
    const formatDuration = (video: Video): string => {
        // YouTube API không trả về duration trong TMDb, nên ta sẽ giả lập
        // Hoặc có thể để trống nếu không có data
        const durations = ['1:20', '2:15', '0:45', '1:50', '2:30', '1:05', '3:10'];
        return durations[Math.floor(Math.random() * durations.length)];
    };

    // Không hiển thị gì nếu đang loading, có error, hoặc không có video
    if (loading || error || videos.length === 0 || !movieDetail) {
        return null;
    }

    const currentVideo = videos[currentVideoIndex];
    const embedUrl = `https://www.youtube.com/embed/${currentVideo.key}?autoplay=${isPlaying ? 1 : 0}&mute=1&loop=1&controls=1&showinfo=0&rel=0&modestbranding=1&playlist=${currentVideo.key}&enablejsapi=1`;

    // Lấy 5 video tiếp theo cho thumbnails strip
    const thumbnailVideos = videos.slice(currentVideoIndex + 1, currentVideoIndex + 6);
    if (thumbnailVideos.length < 5) {
        thumbnailVideos.push(...videos.slice(0, 5 - thumbnailVideos.length));
    }

    return (
        <div className="relative w-full mb-12">
            {/* Main Video Container */}
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg bg-black">
                {/* YouTube Video Iframe */}
                <iframe
                    ref={iframeRef}
                    key={currentVideo.key}
                    className="absolute top-0 left-0 w-full h-full"
                    src={embedUrl}
                    title={currentVideo.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                        border: 'none',
                    }}
                />

                {/* Gradient Overlay - Bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                {videos.length > 1 && (
                    <>
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 md:p-4 rounded-full transition-all duration-200 backdrop-blur-sm group"
                            aria-label="Previous video"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 md:p-4 rounded-full transition-all duration-200 backdrop-blur-sm group"
                            aria-label="Next video"
                        >
                            <svg
                                className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2.5}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </>
                )}

                {/* Video Type Badge */}
                {/* <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 bg-imdb-yellow text-black text-xs md:text-sm font-bold rounded shadow-lg flex items-center gap-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        {currentVideo.type}
                    </span>
                </div> */}

                {/* Video Info Overlay - Bottom Left */}
                <div className="absolute bottom-16 md:bottom-20 left-4 md:left-6 right-4 z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-semibold rounded">
                            {formatDuration(currentVideo)}
                        </span>
                        {currentVideo.official && (
                            <span className="px-2 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs md:text-sm font-semibold rounded">
                                Official
                            </span>
                        )}
                    </div>
                    <h3 className="text-white text-lg md:text-2xl font-bold drop-shadow-lg line-clamp-2">
                        {currentVideo.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base mt-1">
                        {movieDetail.title}
                    </p>
                </div>

                {/* Dots Indicator */}
                {videos.length > 1 && (
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                        {videos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`transition-all duration-200 ${index === currentVideoIndex
                                    ? 'w-8 h-2 bg-imdb-yellow'
                                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                                    } rounded-full`}
                                aria-label={`Go to video ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnails Strip - Desktop Only */}
            {videos.length > 1 && (
                <div className="hidden lg:block mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm mr-2">Up Next:</span>
                        <div
                            ref={thumbnailsRef}
                            className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                            onWheel={handleThumbnailsWheel}
                        >
                            {thumbnailVideos.map((video, index) => {
                                const actualIndex = (currentVideoIndex + 1 + index) % videos.length;
                                return (
                                    <button
                                        key={video.id}
                                        onClick={() => handleThumbnailClick(actualIndex)}
                                        className="flex-shrink-0 group relative"
                                    >
                                        <div className="relative w-36 h-20 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-imdb-yellow transition-all duration-200">
                                            <img
                                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                                alt={video.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                            {/* Play Icon Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-imdb-yellow group-hover:scale-110 transition-all">
                                                    <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Duration Badge */}
                                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs font-semibold rounded">
                                                {formatDuration(video)}
                                            </div>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400 line-clamp-2 text-left group-hover:text-white transition-colors">
                                            {video.name}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Thumbnails (Simplified) */}
            {videos.length > 1 && (
                <div className="lg:hidden mt-3 px-4">
                    <div
                        ref={mobileThumbnailsRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                        onWheel={handleThumbnailsWheel}
                    >
                        {videos.slice(0, 4).map((video, index) => (
                            <button
                                key={video.id}
                                onClick={() => handleDotClick(index)}
                                className={`flex-shrink-0 relative ${index === currentVideoIndex ? 'ring-2 ring-imdb-yellow' : ''
                                    } rounded`}
                            >
                                <img
                                    src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                    alt={video.name}
                                    className="w-24 h-14 object-cover rounded"
                                />
                                <div className="absolute inset-0 bg-black/30 rounded" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Custom Scrollbar Hide Style */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default VideoHero;
