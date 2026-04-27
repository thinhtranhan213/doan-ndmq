import React, { useState } from 'react';
import { createReport, ReportTargetType, ReportType } from '../../api/reportService';

interface Props {
    targetId: number;
    targetType: ReportTargetType;
    onClose: () => void;
}

const REPORT_TYPES: { value: ReportType; label: string }[] = [
    { value: 'SPAM', label: 'Spam' },
    { value: 'HATE_SPEECH', label: 'Ngôn từ thù ghét' },
    { value: 'SPOILER', label: 'Spoiler' },
    { value: 'INAPPROPRIATE', label: 'Nội dung không phù hợp' },
    { value: 'OTHER', label: 'Khác' },
];

const ReportDialog: React.FC<Props> = ({ targetId, targetType, onClose }) => {
    const [type, setType] = useState<ReportType>('SPAM');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            await createReport(targetId, targetType, type, description || undefined);
            setDone(true);
        } catch (e: unknown) {
            const err = e as { response?: { status?: number } };
            if (err?.response?.status === 409) {
                setError('Bạn đã báo cáo nội dung này rồi.');
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-white font-bold text-lg mb-4">Báo cáo nội dung</h3>

                {done ? (
                    <div className="text-center py-4">
                        <p className="text-green-400 mb-4">Báo cáo đã được gửi. Cảm ơn bạn!</p>
                        <button onClick={onClose} className="px-5 py-2 rounded bg-slate-600 text-white hover:bg-slate-500 cursor-pointer">
                            Đóng
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm block mb-2">Lý do</label>
                            <select
                                value={type}
                                onChange={e => setType(e.target.value as ReportType)}
                                className="w-full bg-slate-700 text-white rounded px-3 py-2"
                            >
                                {REPORT_TYPES.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-400 text-sm block mb-2">Mô tả (tùy chọn)</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-700 text-white rounded px-3 py-2 resize-none"
                                placeholder="Thêm thông tin..."
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                        <div className="flex gap-3 justify-end">
                            <button onClick={onClose} className="px-4 py-2 rounded bg-slate-600 text-white hover:bg-slate-500 cursor-pointer">
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-4 py-2 rounded bg-yellow-500 text-black font-semibold hover:bg-yellow-400 cursor-pointer disabled:opacity-50"
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportDialog;
