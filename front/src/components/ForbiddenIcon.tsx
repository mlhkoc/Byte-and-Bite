import React from 'react';
import { Lock, AlertTriangle, Shield } from 'lucide-react';

type ForbiddenIconProps = {
    size?: number;
    className?: string;
};

const ForbiddenIcon: React.FC<ForbiddenIconProps> = ({ size = 80, className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="text-orange-700" size={size} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <AlertTriangle className="text-orange-100" size={size * 0.5} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pt-1">
                <Lock className="text-orange-100" size={size * 0.25} />
            </div>
        </div>
    );
};

export default ForbiddenIcon;