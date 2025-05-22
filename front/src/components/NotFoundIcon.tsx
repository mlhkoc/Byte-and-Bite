import React from 'react';
import { FileQuestion, Search, X } from 'lucide-react';

type NotFoundIconProps = {
    size?: number;
    className?: string;
};

const NotFoundIcon: React.FC<NotFoundIconProps> = ({ size = 80, className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center">
                <FileQuestion className="text-orange-700" size={size} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <Search className="text-orange-100" size={size * 0.5} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-1">
                <X className="text-orange-100" size={size * 0.25} />
            </div>
        </div>
    );
};

export default NotFoundIcon;