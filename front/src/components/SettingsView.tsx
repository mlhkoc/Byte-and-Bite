import React, { useState } from 'react';
import { Save } from 'lucide-react';

const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState({
        platformFee: 10,
        minimumOrderValue: 15,
        maxDeliveryDistance: 10,
        platformName: 'Byte and Bite',
        supportEmail: 'support@byteandbite.com',
        notifyNewRestaurant: true,
        notifyNewCourier: true,
        autoApproveUsers: false,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
        });

        if (saved) setSaved(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // In a real app, you would save to the backend here
        console.log('Saving settings:', settings);

        // Show success message
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Platform Settings</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">General Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Platform Name
                                    </label>
                                    <input
                                        type="text"
                                        name="platformName"
                                        value={settings.platformName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Support Email
                                    </label>
                                    <input
                                        type="email"
                                        name="supportEmail"
                                        value={settings.supportEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Platform Fee (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="platformFee"
                                        value={settings.platformFee}
                                        min="0"
                                        max="30"
                                        step="0.1"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Order Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Order Value ($)
                                    </label>
                                    <input
                                        type="number"
                                        name="minimumOrderValue"
                                        value={settings.minimumOrderValue}
                                        min="0"
                                        step="0.01"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Maximum Delivery Distance (miles)
                                    </label>
                                    <input
                                        type="number"
                                        name="maxDeliveryDistance"
                                        value={settings.maxDeliveryDistance}
                                        min="1"
                                        max="50"
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4">Notifications</h2>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="notifyNewRestaurant"
                                        name="notifyNewRestaurant"
                                        checked={settings.notifyNewRestaurant}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="notifyNewRestaurant" className="ml-2 block text-sm text-gray-700">
                                        Notify on new restaurant registration
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="notifyNewCourier"
                                        name="notifyNewCourier"
                                        checked={settings.notifyNewCourier}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="notifyNewCourier" className="ml-2 block text-sm text-gray-700">
                                        Notify on new courier application
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="autoApproveUsers"
                                        name="autoApproveUsers"
                                        checked={settings.autoApproveUsers}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="autoApproveUsers" className="ml-2 block text-sm text-gray-700">
                                        Auto-approve new customer accounts
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center"
                        >
                            <Save size={18} className="mr-2" />
                            Save Settings
                        </button>
                    </div>

                    {saved && (
                        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                            Settings saved successfully!
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SettingsView;