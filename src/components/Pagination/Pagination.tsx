
import React from 'react';

interface PaginationProps {
    currentPage: number;
    maxPages: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, maxPages, onPageChange, loading }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < maxPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Tính toán phạm vi trang hiển thị (show 5 pages around current page)
    const getPageRange = () => {
        const range = 5;
        let start = Math.max(1, currentPage - Math.floor(range / 2));
        let end = Math.min(maxPages, start + range - 1);

        if (end - start < range - 1) {
            start = Math.max(1, end - range + 1);
        }

        return { start, end };
    };

    const { start, end } = getPageRange();

    const renderPageButtons = () => {
        const buttons = [];

        // Thêm nút "First" nếu không phải trang đầu
        if (start > 1) {
            buttons.push(
                <button
                    key="first"
                    onClick={() => onPageChange(1)}
                    disabled={loading}
                    className="hidden md:inline-block px-3 py-2 rounded-lg font-semibold transition bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                >
                    1
                </button>
            );

            if (start > 2) {
                buttons.push(
                    <span key="ellipsis-start" className="px-2 text-gray-400">
                        ...
                    </span>
                );
            }
        }

        // Hiển thị các số trang trong phạm vi
        for (let i = start; i <= end; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-bold transition whitespace-nowrap ${i === currentPage
                        ? 'bg-imdb-yellow text-white shadow-lg shadow-imdb-yellow/50 border-2 border-blue-300'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {i}
                </button>
            );
        }

        // Thêm nút "Last" nếu không phải trang cuối
        if (end < maxPages) {
            if (end < maxPages - 1) {
                buttons.push(
                    <span key="ellipsis-end" className="px-2 text-gray-400">
                        ...
                    </span>
                );
            }

            buttons.push(
                <button
                    key="last"
                    onClick={() => onPageChange(maxPages)}
                    disabled={loading}
                    className="hidden md:inline-block px-3 py-2 rounded-lg font-semibold transition bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-50"
                >
                    {maxPages}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="flex flex-col items-center gap-4 py-12 px-4 w-full">
            {/* Previous Button | Page Numbers | Next Button */}
            <div className="flex justify-center items-center gap-2 flex-wrap">
                {/* Previous Button */}
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || loading}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${currentPage === 1
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                        } ${loading ? 'opacity-50' : ''}`}
                >
                    ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1 flex-wrap justify-center">
                    {renderPageButtons()}
                </div>

                {/* Next Button */}
                <button
                    onClick={handleNext}
                    disabled={currentPage === maxPages || loading}
                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${currentPage === maxPages
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                        } ${loading ? 'opacity-50' : ''}`}
                >
                    Next →
                </button>
            </div>

            {/* Page Info */}
            <div className="text-gray-400 text-sm">
                <span>Page {currentPage} of {maxPages}</span>
            </div>
        </div>
    );
};

export default Pagination;
