import { useEffect, useMemo, useState } from "react";
import { getPlaylists, toggleMovieInPlaylist, createPlaylist } from "../../api/endpoints";

interface Playlist {
    id: number;
    name: string;
    contains: boolean;
}

interface Props {
    movieId: number;
    onClose: () => void;
}

const PlaylistModal: React.FC<Props> = ({ movieId, onClose }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingIds, setLoadingIds] = useState<number[]>([]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);

        // lock scroll
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const res = await getPlaylists(movieId);
            const list = Array.isArray(res) ? res : res.data ?? [];

            setPlaylists(list);

            const selectedIds = list
                .filter((p: Playlist) => p.contains)
                .map((p: Playlist) => p.id);

            setSelected(selectedIds);

            setLoading(false);
        };

        fetch();
    }, [movieId]);

    // 🔥 Optimistic UI
    const handleToggle = async (playlistId: number) => {
        if (loadingIds.includes(playlistId)) return;

        setLoadingIds(prev => [...prev, playlistId]);

        const isSelected = selected.includes(playlistId);

        setSelected(prev =>
            isSelected
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );

        try {
            await toggleMovieInPlaylist(playlistId, movieId);
        } catch {
            setSelected(prev =>
                isSelected
                    ? [...prev, playlistId]
                    : prev.filter(id => id !== playlistId)
            );
        } finally {
            setLoadingIds(prev => prev.filter(id => id !== playlistId));
        }
    };

    const handleCreate = async () => {
        if (!newName) return;

        const res = await createPlaylist(newName);
        const created = res.data ?? res;

        setPlaylists(prev => [...prev, { ...created, contains: true }]);
        setSelected(prev => [...prev, created.id]);
        setNewName("");
    };

    const filtered = useMemo(() => {
        return playlists.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [playlists, search]);

    return (
        <div
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            {/* Modal content */}
            <div
                className="bg-slate-900 w-[500px] p-6 rounded-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl text-white mb-4">Add to Playlist</h2>

                <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
                />

                <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : (
                        filtered.map(p => {
                            const isSelected = selected.includes(p.id);

                            return (
                                <div
                                    key={p.id}
                                    onClick={() => handleToggle(p.id)}
                                    className="flex justify-between p-2 hover:bg-gray-700 cursor-pointer"
                                >
                                    <span className="text-white">{p.name}</span>
                                    <span>{isSelected ? "✔️" : "+"}</span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Create */}
                <div className="mt-4 flex gap-2">
                    <input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="New playlist"
                        className="flex-1 p-2 bg-gray-700 text-white rounded"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-imdb-yellow px-3 rounded"
                    >
                        Create
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 text-gray-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default PlaylistModal;