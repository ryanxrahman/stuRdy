"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SidebarLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
}

export default function SidebarLink({ href, children, className }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname === decodeURIComponent(href);

    return (
        <Link 
            href={href}
            className={`
                ${className} 
                transition-all duration-200
                ${isActive 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'text-base-content/60 hover:text-base-content hover:bg-base-content/5'}
            `}
        >
            {children}
        </Link>
    );
}
