
import React, { useState, useRef } from 'react';
import MovieCard from '../MovieCard/MovieCard';
import { Movie } from '../../types/movie.types';

interface MovieSectionProps {
    title: string;
    description?: string;
    movies: Movie[];
    loading?: boolean;
}

const MovieSection: React.FC<MovieSectionProps> = ({ title, description, movies, loading }) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-imdb-yellow"></div>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p className="text-lg">No movies found</p>
            </div>
        );
    }

    const handleScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (carouselRef.current) {
            const scrollAmount = 400;
            const newScrollLeft =
                direction === 'left'
                    ? carouselRef.current.scrollLeft - scrollAmount
                    : carouselRef.current.scrollLeft + scrollAmount;

            carouselRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth',
            });
        }
    };

    const handleCarouselWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const isScrollable = container.scrollWidth > container.clientWidth;

        // Nếu scroll dọc (deltaY) và không phải Shift+scroll
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
            // KHÔNG làm gì - để browser xử lý scroll trang bình thường
            return;
        }

        // Chỉ xử lý scroll ngang
        if (isScrollable && (e.shiftKey || Math.abs(e.deltaX) > 0)) {
            e.preventDefault();
            e.stopPropagation();
            container.scrollLeft += e.deltaX || e.deltaY;
        }
    };

    return (
        <div className="w-full" ref={containerRef}>
            {/* Section Header */}
            {title && (
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    {description && <p className="text-gray-400">{description}</p>}
                </div>
            )}

            {/* Carousel Container */}
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Left Button - Hiển thị chỉ khi hover section và có thể scroll trái */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-14 rounded-lg bg-black bg-opacity-60 border border-gray-400 flex items-center justify-center transition-all focus:outline-none ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <span className="text-gray-300 text-xl transition-colors focus:text-cyan-400">‹</span>
                    </button>
                )}

                {/* Carousel */}
                <div
                    ref={carouselRef}
                    onScroll={handleScroll}
                    onWheel={handleCarouselWheel}
                    className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
                    style={{
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {/* Right Button - Hiển thị chỉ khi hover section và có thể scroll phải */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-14 rounded-lg bg-black bg-opacity-60 border border-gray-400 flex items-center justify-center transition-all focus:outline-none ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <span className="text-gray-300 text-xl transition-colors focus:text-cyan-400">›</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MovieSection;
