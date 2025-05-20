import { useRef } from 'react';

export function DropdownMenu({
    children,
    items
}: {
    children: React.ReactNode;
    items: { label: string; onClick: () => void }[];
}) {
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative group" ref={menuRef}>
            {children}
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 z-50 pointer-events-none">
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
        </div>
    );
}