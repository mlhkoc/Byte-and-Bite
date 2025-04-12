import { ShoppingBag, Clock, Bike } from 'lucide-react';

export function Stats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Today's Orders</p>
                        <h3 className="text-xl font-semibold">142</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                        <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Active Orders</p>
                        <h3 className="text-xl font-semibold">18</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <Bike className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                        <p className="text-sm text-gray-500">Available Couriers</p>
                        <h3 className="text-xl font-semibold">7</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}