import React, { useState } from 'react';
import { BarChart as BarChartIcon, PieChart as PieChartIcon, CalendarRange } from 'lucide-react';

const ReportsView: React.FC = () => {
    const [timeRange, setTimeRange] = useState('week');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Reports</h1>
                <div className="flex items-center">
                    <CalendarRange size={20} className="mr-2 text-gray-500" />
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <BarChartIcon size={24} className="mr-3 text-blue-500" />
                        <h2 className="text-xl font-semibold">Orders</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold">1,247</p>
                            <p className="text-xs text-green-600 mt-1">↑ 12% from previous period</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Order Value</p>
                            <p className="text-2xl font-bold">$18,432</p>
                            <p className="text-xs text-green-600 mt-1">↑ 8% from previous period</p>
                        </div>
                    </div>

                    <div className="h-60 flex items-center justify-center border border-gray-200 rounded-lg">
                        <div className="text-center text-gray-500">
                            <BarChartIcon size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>Order chart visualization would appear here</p>
                        </div>
                    </div>
                </div>

                {/* Users Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center mb-4">
                        <PieChartIcon size={24} className="mr-3 text-indigo-500" />
                        <h2 className="text-xl font-semibold">Users</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Customers</p>
                            <p className="text-2xl font-bold">3,842</p>
                            <p className="text-xs text-green-600 mt-1">↑ 5%</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Restaurants</p>
                            <p className="text-2xl font-bold">124</p>
                            <p className="text-xs text-green-600 mt-1">↑ 2%</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Couriers</p>
                            <p className="text-2xl font-bold">78</p>
                            <p className="text-xs text-green-600 mt-1">↑ 10%</p>
                        </div>
                    </div>

                    <div className="h-60 flex items-center justify-center border border-gray-200 rounded-lg">
                        <div className="text-center text-gray-500">
                            <PieChartIcon size={48} className="mx-auto mb-2 text-gray-300" />
                            <p>User distribution chart would appear here</p>
                        </div>
                    </div>
                </div>

                {/* Revenue Stats */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Revenue</h2>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Total Revenue</p>
                                <p className="text-2xl font-bold">$124,751</p>
                            </div>
                            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                ↑ 15%
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="font-medium">$37,425</span>
                                </div>
                                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '30%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Restaurant Revenue</span>
                                    <span className="font-medium">$74,851</span>
                                </div>
                                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Courier Earnings</span>
                                    <span className="font-medium">$12,475</span>
                                </div>
                                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '10%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Popular Items */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Top Ordered Items</h2>

                    <div className="space-y-4">
                        {[
                            { name: 'Pepperoni Pizza', restaurant: 'Pizza Paradise', orders: 342 },
                            { name: 'Beef Burger', restaurant: 'Burger Heaven', orders: 287 },
                            { name: 'California Roll', restaurant: 'Sushi Express', orders: 245 },
                            { name: 'Pad Thai', restaurant: 'Thai Delight', orders: 213 },
                            { name: 'Chicken Pasta', restaurant: 'Pasta Palace', orders: 198 },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-xs text-gray-500">{item.restaurant}</p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                                    {item.orders} orders
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;