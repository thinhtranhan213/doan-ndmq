import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopbar from '../components/Admin/AdminTopbar';

const AdminLayout: React.FC = () => (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    </div>
);

export default AdminLayout;