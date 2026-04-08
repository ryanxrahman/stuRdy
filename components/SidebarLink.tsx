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
            className={`${className} ${isActive ? 'bg-base-300 shadow-sm border border-base-300/50' : ''}`}
        >
            {children}
        </Link>
    );
}
