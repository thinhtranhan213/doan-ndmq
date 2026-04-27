import React, { useState } from 'react';

interface Props {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    danger?: boolean;
    withReason?: boolean;
    reasonPlaceholder?: string;
    loading?: boolean;
    onConfirm: (reason?: string) => void;
    onClose: () => void;
}

const ConfirmDialog: React.FC<Props> = ({
    isOpen, title, message, confirmLabel = 'Xác nhận', danger = false,
    withReason = false, reasonPlaceholder = 'Lý do (tuỳ chọn)...', loading = false,
    onConfirm, onClose,
}) => {
    const [reason, setReason] = useState('');
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(withReason ? reason : undefined);
        setReason('');
    };

    const handleClose = () => {
        onClose();
        setReason('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <h3 className={`text-lg font-bold mb-2 ${danger ? 'text-red-400' : 'text-yellow-400'}`}>
                    {title}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{message}</p>
                {withReason && (
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={reasonPlaceholder}
                        rows={2}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none mb-4"
                    />
                )}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4 py-2 text-sm rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 ${
                            danger
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-yellow-500 hover:bg-yellow-400 text-black'
                        }`}
                    >
                        {loading ? 'Đang xử lý...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;