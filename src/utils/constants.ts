
// Image size constants
export const IMAGE_SIZES = {
    POSTER_SMALL: 'w185',
    POSTER_MEDIUM: 'w342',
    POSTER_LARGE: 'w500',
    BACKDROP_SMALL: 'w300',
    BACKDROP_MEDIUM: 'w780',
    BACKDROP_LARGE: 'w1280',
    PROFILE_SMALL: 'w45',
    PROFILE_MEDIUM: 'w185',
    PROFILE_LARGE: 'h632',
} as const;

// TMDb image base URL
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

// Helper function to build image URL
export const getImageUrl = (path: string | null, size: string = IMAGE_SIZES.POSTER_MEDIUM): string => {
    if (!path) {
        // Return a placeholder SVG if no image path
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="342" height="513"%3E%3Crect fill="%231a1a1a" width="342" height="513"/%3E%3Ctext fill="%23666" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image Available%3C/text%3E%3C/svg%3E';
    }

    // Use env variable if available, otherwise use default
    const baseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE || TMDB_IMAGE_BASE_URL;
    const imageUrl = `${baseUrl}${size}${path}`;

    return imageUrl;
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Helper function to format runtime
export const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(amount);
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};
