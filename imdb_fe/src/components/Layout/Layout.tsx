import React from 'react';
import Navbar from '../Navbar/Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="mt-16"> {/* Offset cho fixed navbar */}
                {children}
            </main>
        </div>
    );
};

export default Layout;
