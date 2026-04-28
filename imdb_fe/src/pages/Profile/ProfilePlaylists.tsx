import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getPlaylists,
    getPlaylistMovies,
    getMovieDetails,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    toggleMovieInPlaylist,
} from '../../api/endpoints';
import { Movie } from '../../types/movie.types';

const SYSTEM_PLAYLISTS = ['My Watchlist', 'Recently Viewed', 'Watch Later'];

interface PlaylistEntry {
    id: number;
    name: string;
    movies: Movie[];
    totalMovies: number;
}

const ProfilePlaylists: React.FC = () => {
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<PlaylistEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState('');
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [removingMovie, setRemovingMovie] = useState<{ playlistId: number; movieId: number } | null>(null);

    const loadPlaylists = async () => {
        setLoading(true);
        try {
            const raw = await getPlaylists(0);
            const all: any[] = Array.isArray(raw) ? raw : raw?.data ?? [];
            const custom = all.filter((p: any) => !SYSTEM_PLAYLISTS.includes(p.name));

            const entries: PlaylistEntry[] = await Promise.all(
                custom.map(async (p: any) => {
                    const movieData = await getPlaylistMovies(p.id).catch(() => []);
                    const items: any[] = Array.isArray(movieData) ? movieData : movieData?.data ?? [];
                    const details = await Promise.all(
                        items.slice(0, 8).map((item: any) =>
                            getMovieDetails(item.movieId).catch(() => null)
                        )
                    );
                    return {
                        id: p.id,
                        name: p.name,
                        movies: details.filter(Boolean) as Movie[],
                        totalMovies: items.length,
                    };
                })
            );

            setPlaylists(entries);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPlaylists(); }, []);

    const handleCreate = async () => {
        if (!newName.trim()) return;
        setCreating(true);
        try {
            await createPlaylist(newName.trim());
            setNewName('');
            await loadPlaylists();
        } finally {
            setCreating(false);
        }
    };

    const handleRename = async (id: number) => {
        if (!editName.trim()) { setEditingId(null); return; }
        try {
            await renamePlaylist(id, editName.trim());
            setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name: editName.trim() } : p));
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        await deletePlaylist(id);
        setPlaylists(prev => prev.filter(p => p.id !== id));
        setDeletingId(null);
        if (expandedId === id) setExpandedId(null);
    };

    const handleRemoveMovie = async (playlistId: number, movieId: number) => {
        setRemovingMovie({ playlistId, movieId });
        try {
            await toggleMovieInPlaylist(playlistId, movieId);
            setPlaylists(prev => prev.map(p =>
                p.id === playlistId
                    ? { ...p, movies: p.movies.filter(m => m.id !== movieId), totalMovies: p.totalMovies - 1 }
                    : p
            ));
        } finally {
            setRemovingMovie(null);
        }
    };

    if (loading) return (
        <div className="bg-slate-900 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-imdb-yellow mx-auto" />
        </div>
    );

    return (
        <div>
            {/* Create new playlist */}
            <div className="flex gap-2 mb-6">
                <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="Tên playlist mới..."
                    className="flex-1 px-4 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:outline-none focus:border-imdb-yellow"
                />
                <button
                    onClick={handleCreate}
                    disabled={creating || !newName.trim()}
                    className="px-4 py-2 bg-imdb-yellow text-slate-900 font-bold rounded hover:bg-yellow-400 disabled:opacity-50 transition"
                >
                    {creating ? '...' : '+ Tạo'}
                </button>
            </div>

            {playlists.length === 0 ? (
                <div className="bg-slate-900 rounded-lg p-8 text-center">
                    <p className="text-slate-400">Chưa có playlist nào. Tạo playlist đầu tiên của bạn!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {playlists.map(p => (
                        <div key={p.id} className="bg-slate-900 rounded-lg overflow-hidden">
                            {/* Header row */}
                            <div className="flex items-center gap-3 px-4 py-3">
                                {editingId === p.id ? (
                                    <div className="flex items-center gap-2 flex-1">
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') handleRename(p.id);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            className="flex-1 px-2 py-1 bg-slate-700 text-white rounded border border-imdb-yellow focus:outline-none text-sm"
                                            autoFocus
                                        />
                                        <button onClick={() => handleRename(p.id)} className="text-imdb-yellow text-sm hover:text-yellow-400 font-semibold">Lưu</button>
                                        <button onClick={() => setEditingId(null)} className="text-slate-400 text-sm hover:text-white">Hủy</button>
                                    </div>
                                ) : (
                                    <button
                                        className="flex items-center gap-2 flex-1 text-left"
                                        onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                                    >
                                        <span className="text-white font-semibold hover:text-imdb-yellow transition">{p.name}</span>
                                        <span className="text-slate-400 text-sm">({p.totalMovies} phim)</span>
                                        <span className="text-slate-500 text-xs ml-1">{expandedId === p.id ? '▲' : '▼'}</span>
                                    </button>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-1 ml-auto flex-shrink-0">
                                    {editingId !== p.id && (
                                        <button
                                            onClick={() => { setEditingId(p.id); setEditName(p.name); }}
                                            className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-slate-700 transition"
                                            title="Đổi tên"
                                        >✏️</button>
                                    )}
                                    {deletingId === p.id ? (
                                        <span className="flex items-center gap-1 text-xs">
                                            <span className="text-slate-400">Xóa?</span>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 font-semibold">Có</button>
                                            <button onClick={() => setDeletingId(null)} className="text-slate-400 hover:text-white ml-1">Không</button>
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setDeletingId(p.id)}
                                            className="text-slate-400 hover:text-red-400 text-sm px-2 py-1 rounded hover:bg-slate-700 transition"
                                            title="Xóa playlist"
                                        >🗑️</button>
                                    )}
                                </div>
                            </div>

                            {/* Expanded movies grid */}
                            {expandedId === p.id && (
                                <div className="px-4 pb-4 border-t border-slate-800 pt-4">
                                    {p.movies.length === 0 ? (
                                        <p className="text-slate-500 text-sm text-center py-4">Playlist này chưa có phim nào.</p>
                                    ) : (
                                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                                            {p.movies.map(movie => (
                                                <div key={movie.id} className="group">
                                                    <div
                                                        className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] cursor-pointer"
                                                        onClick={() => navigate(`/movie/${movie.id}`)}
                                                    >
                                                        {movie.poster_path ? (
                                                            <img
                                                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                                alt={movie.title}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center p-1">
                                                                <span className="text-slate-500 text-xs text-center leading-tight">{movie.title}</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                                                        <button
                                                            onClick={e => { e.stopPropagation(); handleRemoveMovie(p.id, movie.id); }}
                                                            disabled={removingMovie?.playlistId === p.id && removingMovie?.movieId === movie.id}
                                                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-40"
                                                            title="Xóa khỏi playlist"
                                                        >×</button>
                                                    </div>
                                                    <p className="text-white text-xs text-center truncate mt-1">{movie.title}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilePlaylists;
