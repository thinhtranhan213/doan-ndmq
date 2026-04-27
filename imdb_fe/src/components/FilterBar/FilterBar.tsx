import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Genre } from '../../types/movie.types';

interface FilterBarProps {
    onFilter: (genreIds: string, year: number | undefined, country: string) => void;
    loading?: boolean;
}

// Common movie genres (TMDB Genre IDs)
const COMMON_GENRES: Genre[] = [
    { id: 28, name: 'Hành Động' },
    { id: 12, name: 'Phiêu Lưu' },
    { id: 16, name: 'Hoạt Hình' },
    { id: 35, name: 'Hài Hước' },
    { id: 80, name: 'Hình Sự' },
    { id: 99, name: 'Tài Liệu' },
    { id: 18, name: 'Kịch Tính' },
    { id: 10751, name: 'Gia Đình' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'Lịch Sử' },
    { id: 27, name: 'Kinh Dị' },
    { id: 10402, name: 'Âm Nhạc' },
    { id: 9648, name: 'Bí Ẩn' },
    { id: 10749, name: 'Lãng Mạn' },
    { id: 878, name: 'Khoa Học Viễn Tưởng' },
    { id: 10770, name: 'Phim TV' },
    { id: 53, name: 'Ly Kỳ' },
    { id: 10752, name: 'Chiến Tranh' },
];

const FilterBar: React.FC<FilterBarProps> = ({ onFilter, loading = false }) => {
    const { t } = useTranslation();
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Generate years from current year to 1900
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    // Common countries
    const countries = [
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'FR', name: 'France' },
        { code: 'DE', name: 'Germany' },
        { code: 'JP', name: 'Japan' },
        { code: 'KR', name: 'South Korea' },
        { code: 'CN', name: 'China' },
        { code: 'IN', name: 'India' },
        { code: 'BR', name: 'Brazil' },
        { code: 'MX', name: 'Mexico' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'IT', name: 'Italy' },
        { code: 'ES', name: 'Spain' },
        { code: 'VN', name: 'Vietnam' },
    ];

    const handleGenreToggle = (genreId: number) => {
        setSelectedGenres(prev =>
            prev.includes(genreId)
                ? prev.filter(id => id !== genreId)
                : [...prev, genreId]
        );
    };

    const handleApplyFilter = () => {
        const genreIds = selectedGenres.length > 0 ? selectedGenres.join(',') : '';
        onFilter(genreIds, selectedYear, selectedCountry);
    };

    const handleReset = () => {
        setSelectedGenres([]);
        setSelectedYear(undefined);
        setSelectedCountry('');
        onFilter('', undefined, '');
    };

    return (
        <div id="filter-bar-wrapper" className="mb-8 w-full">
            {/* Filter Toggle Button */}
            <button
                onClick={() => {
                    console.log('Filter button clicked');
                    setShowFilters(!showFilters);
                }}
                className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg mb-4 shadow-lg transition-all duration-300 transform hover:scale-105 ${showFilters
                    ? 'bg-blue-500 text-white shadow-blue-400/50'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-blue-500/50'
                    }`}
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>⚙️ {t('movies.filter') || 'Lọc'}</span>
                {(selectedGenres.length > 0 || selectedYear || selectedCountry) && (
                    <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        {selectedGenres.length + (selectedYear ? 1 : 0) + (selectedCountry ? 1 : 0)}
                    </span>
                )}
            </button>

            {/* Filter Panel */}
            {showFilters && (
                <div id="filter-panel" className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Genre Filter */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">{t('navbar.genres') || 'Thể loại'}</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {COMMON_GENRES.map(genre => (
                                    <label key={genre.id} className="flex items-center gap-2 text-white cursor-pointer hover:text-imdb-yellow transition">
                                        <input
                                            type="checkbox"
                                            checked={selectedGenres.includes(genre.id)}
                                            onChange={() => handleGenreToggle(genre.id)}
                                            className="w-4 h-4 accent-imdb-yellow"
                                        />
                                        <span>{genre.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">{t('movies.year') || 'Năm'}</h3>
                            <select
                                value={selectedYear || ''}
                                onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-imdb-yellow"
                            >
                                <option value="">{t('movies.allYears') || 'Tất cả năm'}</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Country Filter */}
                        <div>
                            <h3 className="text-white font-semibold mb-3">{t('movies.country') || 'Quốc gia'}</h3>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-imdb-yellow"
                            >
                                <option value="">{t('movies.allCountries') || 'Tất cả quốc gia'}</option>
                                {countries.map(country => (
                                    <option key={country.code} value={country.code}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleApplyFilter}
                            disabled={loading}
                            className="px-6 py-2 bg-imdb-yellow text-slate-900 hover:bg-yellow-400 transition font-semibold rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('movies.loading') || 'Đang tải...' : t('movies.apply') || 'Áp dụng'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-6 py-2 bg-slate-700 text-white hover:bg-slate-600 transition font-semibold rounded"
                        >
                            {t('movies.reset') || 'Đặt lại'}
                        </button>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {(selectedGenres.length > 0 || selectedYear || selectedCountry) && (
                <div id="active-filters" className="flex flex-wrap gap-2 mt-4">
                    {selectedGenres.map(genreId => {
                        const genre = COMMON_GENRES.find(g => g.id === genreId);
                        return genre ? (
                            <span key={genreId} className="inline-flex items-center gap-2 px-3 py-1 bg-imdb-yellow text-slate-900 rounded text-sm font-medium">
                                {genre.name}
                                <button
                                    onClick={() => handleGenreToggle(genreId)}
                                    className="hover:text-slate-700"
                                >
                                    ✕
                                </button>
                            </span>
                        ) : null;
                    })}
                    {selectedYear && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-imdb-yellow text-slate-900 rounded text-sm font-medium">
                            {selectedYear}
                            <button
                                onClick={() => setSelectedYear(undefined)}
                                className="hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                    {selectedCountry && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-imdb-yellow text-slate-900 rounded text-sm font-medium">
                            {countries.find(c => c.code === selectedCountry)?.name || selectedCountry}
                            <button
                                onClick={() => setSelectedCountry('')}
                                className="hover:text-slate-700"
                            >
                                ✕
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
