# Sequence Diagrams - Movie Review App

## 1. Luồng Tải Trang Home (Home Page Loading Flow)

```mermaid
sequenceDiagram
    participant User
    participant Home as Home Component
    participant Hook as useMultipleMovieSections
    participant API as TMDB API
    participant Store as movieStore
    participant VideoHero as VideoHero
    participant MovieSection as MovieSection

    User->>Home: Truy cập trang chủ
    Home->>Hook: Gọi hook để tải dữ liệu
    Hook->>Store: Gọi setLoading(true)

    par Tải song song 3 loại phim
        Hook->>API: getTrendingMovies('week')
        Hook->>API: getTopRatedMovies(1)
        Hook->>API: getPopularMovies(1)
    end

    API-->>Hook: Trả về dữ liệu trending
    API-->>Hook: Trả về dữ liệu top rated
    API-->>Hook: Trả về dữ liệu popular

    Hook->>Store: setLoading(false)<br/>Update state với 3 danh sách
    Hook-->>Home: Return {trending, topRated, popular, loading, error}

    Home->>VideoHero: Hiển thị VideoHero với phim đầu tiên từ trending
    VideoHero->>API: Tải video URL cho phim
    API-->>VideoHero: Video URL
    VideoHero-->>Home: Render VideoHero

    Home->>MovieSection: Render Trending section
    Home->>MovieSection: Render Top Rated section
    Home->>MovieSection: Render Popular section

    MovieSection->>MovieSection: Hiển thị danh sách phim
    MovieSection-->>Home: Render xong
    Home-->>User: Hiển thị trang home với 3 sections
```

## 2. Luồng Tìm Kiếm Phim (Movie Search Flow)

```mermaid
sequenceDiagram
    participant User
    participant SearchBar as SearchBar Component
    participant Search as Search Page
    participant Hook as useMovieSearch Hook
    participant API as TMDB API
    participant MovieList as MovieList Component

    User->>SearchBar: Nhập từ khóa tìm kiếm
    SearchBar->>Search: onChange event
    Search->>Hook: Gọi useMovieSearch(searchQuery)

    Note over Hook: Debounce hoặc instant search
    Hook->>API: searchMovies(searchQuery)

    alt Nếu có kết quả
        API-->>Hook: Trả về mảng kết quả phim
        Hook->>Hook: setResults(results)<br/>setLoading(false)
    else Nếu lỗi
        API-->>Hook: Error
        Hook->>Hook: setError(error message)<br/>setLoading(false)
    end

    Hook-->>Search: Return {results, loading, error}
    Search->>MovieList: Truyền danh sách phim tìm được
    MovieList->>MovieList: Render danh sách kết quả
    MovieList-->>Search: UI render xong
    Search-->>User: Hiển thị kết quả tìm kiếm
```

## 3. Luồng Xem Chi Tiết Phim (Movie Detail Page Flow)

```mermaid
sequenceDiagram
    participant User
    participant MovieCard
    participant MovieDetail as MovieDetail Page
    participant Hook as useMovieDetail Hook
    participant API as TMDB API
    participant Credits as Credits
    participant Similar as Similar Movies

    User->>MovieCard: Click vào phim
    MovieCard->>MovieDetail: Navigate đến /movie/:id

    MovieDetail->>Hook: useMovieDetail(movieId)

    par Tải dữ liệu song song
        Hook->>API: getMovieDetail(id)
        Hook->>API: getMovieCredits(id)
        Hook->>API: getSimilarMovies(id)
        Hook->>API: getRecommendations(id)
        Hook->>API: getMovieReviews(id)
    end

    API-->>Hook: Movie detail data
    API-->>Hook: Credits (cast, crew)
    API-->>Hook: Similar movies
    API-->>Hook: Recommendations
    API-->>Hook: Reviews

    Hook-->>MovieDetail: Return {movie, credits, similarMovies, recommendations, reviews, loading}

    MovieDetail->>MovieDetail: Xử lý dữ liệu<br/>- Lấy director từ credits<br/>- Format ngày tháng, runtime, tiền tệ

    MovieDetail->>Credits: Render cast & crew info
    MovieDetail->>Similar: Render similar movies section
    MovieDetail->>Similar: Render recommendations section
    MovieDetail->>MovieDetail: Render reviews section

    MovieDetail-->>User: Hiển thị trang chi tiết phim
```

## 4. Luồng Lọc Phim Theo Thể Loại (Genre Filter Flow)

```mermaid
sequenceDiagram
    participant User
    participant Navbar as Navbar Component
    participant GenrePage as GenrePage
    participant Hook as useGenreMovies Hook
    participant API as TMDB API
    participant Pagination as Pagination

    User->>Navbar: Click vào thể loại
    Navbar->>GenrePage: Navigate đến /genre/:genreId

    GenrePage->>Hook: useGenreMovies(genreId, page)
    Hook->>Hook: Initialize state (page, movies, totalPages)

    Note over Hook: Khi page thay đổi, useEffect trigger
    Hook->>API: getMoviesByGenre(genreId, page)

    API-->>Hook: {results, total_pages}
    Hook->>Hook: setMovies(results)<br/>setTotalPages(Math.min(total_pages, 500))
    Hook->>Hook: setLoading(false)

    Hook-->>GenrePage: Return {movies, totalPages, page, loading}

    GenrePage->>GenrePage: Render danh sách phim
    GenrePage->>Pagination: Render pagination component
    Pagination->>Pagination: Hiển thị nút prev/next/page numbers

    GenrePage-->>User: Hiển thị phim theo thể loại với phân trang

    User->>Pagination: Click chuyển trang
    Pagination->>Hook: goToPage(pageNumber)
    Hook->>Hook: setPage(pageNumber)
    Note over Hook: useEffect trigger lại do page dependency
    Hook->>API: Fetch lại dữ liệu trang mới
    API-->>Hook: Dữ liệu trang mới
    Hook-->>GenrePage: Update movies
    GenrePage-->>User: Cập nhật danh sách phim trang mới
```

## 5. Luồng API Call & Error Handling (API Call Flow)

```mermaid
sequenceDiagram
    participant Hook as Custom Hook
    participant API as tmdbApi (Axios Instance)
    participant Interceptor as Request/Response Interceptor
    participant TMDB as TMDB Server
    participant Store as movieStore

    Hook->>API: Gọi API endpoint
    API->>Interceptor: Request Interceptor
    Interceptor->>Interceptor: Log request URL<br/>Thêm headers (Auth token, Content-Type)
    Interceptor-->>API: Return config

    API->>TMDB: Gửi HTTP request

    alt Thành công (2xx)
        TMDB-->>API: Response với status 200
        API->>Interceptor: Response Interceptor
        Interceptor->>Interceptor: Log response thành công
        Interceptor-->>API: Return response
        API-->>Hook: Trả về data
        Hook->>Store: setLoading(false)<br/>setError(null)
        Hook->>Hook: Xử lý dữ liệu
    else Lỗi Server (4xx/5xx)
        TMDB-->>API: Error response
        API->>Interceptor: Response Error Interceptor
        Interceptor->>Interceptor: Log error<br/>error.response.status
        Interceptor-->>API: Reject promise
        API-->>Hook: Throw error
        Hook->>Hook: Catch error
        Hook->>Store: setLoading(false)<br/>setError('Failed to fetch...')
    else Network Error
        TMDB--XHook: Network timeout
        API->>Interceptor: Error Interceptor<br/>(No response)
        Interceptor->>Interceptor: Log network error
        Interceptor-->>API: Reject promise
        API-->>Hook: Throw error
        Hook->>Hook: Catch error
        Hook->>Store: setError('Network error')
    end

    Hook-->>Hook: Return {data, loading, error}
```

## 6. Luồng Quản Lý Trạng Thái (State Management Flow)

```mermaid
sequenceDiagram
    participant Component as React Component
    participant Hook as Custom Hook
    participant Store as movieStore (Zustand)
    participant LocalState as useState

    Component->>Hook: Sử dụng custom hook

    Hook->>LocalState: useState(page, movies, etc.)
    Hook->>Store: useMovieStore() - Global state

    Note over Store: Global state<br/>- loading: boolean<br/>- error: string | null<br/>- setLoading<br/>- setError

    Hook->>Hook: useEffect để fetch dữ liệu
    Hook->>Store: setLoading(true)
    Hook->>Hook: Gọi API

    alt Nếu API thành công
        Hook->>Hook: setCurrentPageMovies(data)
        Hook->>Hook: setTotalPages(data.total_pages)
        Hook->>Store: setLoading(false)
        Hook->>Store: setError(null)
    else Nếu API thất bại
        Hook->>Store: setError('Error message')
        Hook->>Store: setLoading(false)
    end

    Hook-->>Component: Return updated state
    Component->>Component: Re-render với state mới
    Component-->>User: Hiển thị UI cập nhật
```

## 7. Luồng Navigation & Routing (Navigation Flow)

```mermaid
sequenceDiagram
    participant User
    participant UI as UI Components
    participant Router as React Router
    participant Layout as Layout Component
    participant Pages as Page Components

    User->>UI: Click link hoặc input URL
    UI->>Router: Trigger route change
    Router->>Router: Match URL với route

    alt Trang Home
        Router->>Pages: Load Home.tsx
        Pages->>Pages: Render trang chủ
    else Trang Search
        Router->>Pages: Load Search.tsx
        Pages->>Pages: Render trang tìm kiếm
    else Trang Chi Tiết Phim
        Router->>Pages: Load MovieDetail.tsx
        Pages->>Pages: Render trang chi tiết
    else Trang Lọc Theo Thể Loại
        Router->>Pages: Load GenrePage.tsx
        Pages->>Pages: Render phim theo thể loại
    end

    Pages->>Layout: Wrap trang với Layout
    Layout->>Layout: Render header, footer, layout structure
    Layout-->>Pages: Render trang đã wrap
    Pages-->>Router: Route rendered
    Router-->>User: Hiển thị trang mới

    Note over User: URL đổi, trang load, components mount<br/>useEffect trigger để tải dữ liệu
```

## Tóm tắt Cấu trúc Ứng dụng

```
┌─────────────────────────────────────────────────────┐
│                   User Interface                    │
│  (Navbar, MovieCard, SearchBar, Pagination, etc.)   │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼───┐            ┌───▼────┐
    │ Pages │            │Hooks   │ (Data Fetching & Logic)
    │       │            │        │
    │ Home  │            │useMovies
    │Search │            │useMovieDetail
    │Detail │            │useGenreMovies
    │Genre  │            │useMultipleMovieSections
    └───┬───┘            └───┬────┘
        │                    │
        └────────┬───────────┘
                 │
            ┌────▼─────┐
            │   API    │
            │ Endpoints│
            │          │
            │endpoints.│
            │tmdb.ts   │
            └────┬─────┘
                 │
          ┌──────▼──────┐
          │  TMDB API   │
          │  (axios)    │
          └─────────────┘

    ┌──────────────────────────┐
    │  Global State Store      │
    │  (Zustand)               │
    │  - loading               │
    │  - error                 │
    │  - setLoading()          │
    │  - setError()            │
    └──────────────────────────┘
```

---

## Ghi chú quan trọng:

1. **Parallel API Calls**: Ứng dụng sử dụng `Promise.all()` để tải nhiều dữ liệu song song, giảm thời gian loading.

2. **Global State Management**: `movieStore` (Zustand) quản lý trạng thái loading và error toàn cục.

3. **Error Handling**: Mỗi hook đều có try-catch để xử lý lỗi từ API.

4. **Request Interceptor**: Tự động thêm authorization token vào mỗi request.

5. **Response Interceptor**: Xử lý lỗi API và network errors.

6. **Debounce Search**: Có thể implement debounce cho search để giảm số API calls.

7. **Pagination**: Hỗ trợ phân trang với tối đa 500 trang (giới hạn từ TMDB).
