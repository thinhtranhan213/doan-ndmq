import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="mt-16"> {/* Offset cho fixed navbar */}
            {children}
        </main>
    );
};

export default Layout;
