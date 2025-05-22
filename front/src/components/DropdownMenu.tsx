import { useState, useRef } from 'react';

export function DropdownMenu({
    children,
    items
}: {
    children: React.ReactNode;
    items: { label: string; onClick: () => void }[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 250); // 250ms delay before hiding
    };

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={item.onClick}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}