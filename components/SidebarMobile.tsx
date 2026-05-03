'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggleFixed } from './ThemeToggle';

interface SidebarMobileProps {
    children: React.ReactNode;
}

export default function SidebarMobile({ children }: SidebarMobileProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint
                setIsOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-base-100 border border-base-300 rounded-xl shadow-lg text-base-content"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
             <button 
                className="lg:hidden fixed top-4 left-16 z-50 "
                aria-label="Toggle Menu"
            >
               <ThemeToggleFixed />
            </button>




            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:fixed lg:w-64
            `}>
                {children}
            </div>
        </>
    );
}
