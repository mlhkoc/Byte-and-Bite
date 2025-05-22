import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ForbiddenPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
            <div className="w-full max-w-lg">
                <div
                    className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all animate-fade-in"
                    style={{
                        animation: 'fadeIn 0.6s ease-out',
                    }}
                >
                    <div className="bg-gradient-to-r from-amber-600 to-orange-700 p-6">
                        <div className="flex items-center justify-center">
                            <ShieldAlert className="text-white h-16 w-16 opacity-90" />
                        </div>
                    </div>

                    <div className="p-8">
                        <h1 className="text-4xl font-bold text-orange-800 mb-4 text-center">403 Forbidden</h1>
                        <div className="h-1 w-24 bg-orange-600 mx-auto mb-6 rounded-full"></div>

                        <p className="text-gray-600 text-center mb-6">
                            You don't have permission to access this resource. Please check your credentials or contact the administrator if you believe this is an error.
                        </p>

                        <div className="flex justify-center mt-8">
                            <button
                                className="flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg font-medium transition-all hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                                onClick={() => window.location.href = '/'}
                            >
                                <ArrowLeft className="mr-2 h-5 w-5" />
                                Return to Home
                            </button>
                        </div>
                    </div>

                    <div className="bg-amber-50 px-8 py-4 text-center">
                        <p className="text-amber-800 text-sm">
                            If you continue experiencing problems, please contact support.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-amber-800 text-sm opacity-75">
                    &copy; {new Date().getFullYear()} Byte&Bite. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ForbiddenPage;