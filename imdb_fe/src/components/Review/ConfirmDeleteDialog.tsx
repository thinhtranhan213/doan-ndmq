import React from 'react';

interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDeleteDialog: React.FC<Props> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <p className="text-white text-center mb-6">{message}</p>
            <div className="flex gap-3 justify-center">
                <button
                    onClick={onCancel}
                    className="px-5 py-2 rounded bg-slate-600 text-white hover:bg-slate-500 transition cursor-pointer"
                >
                    Hủy
                </button>
                <button
                    onClick={onConfirm}
                    className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-500 transition cursor-pointer"
                >
                    Xóa
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmDeleteDialog;
