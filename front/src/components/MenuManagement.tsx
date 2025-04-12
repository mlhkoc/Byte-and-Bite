import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { MenuItem } from '../types';
import { MenuItemModal } from './MenuItemModal';

export function MenuManagement() {
    const [items, setItems] = useState<MenuItem[]>([
        {
            id: '1',
            name: 'Margherita Pizza',
            price: 14.99,
            description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
            image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
            available: true,
        },
        {
            id: '2',
            name: 'Carbonara',
            price: 16.99,
            description: 'Spaghetti with eggs, pecorino cheese, pancetta, black pepper',
            image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
            available: true,
        },
        {
            id: '3',
            name: 'Tiramisu',
            price: 8.99,
            description: 'Classic Italian dessert with coffee, mascarpone, and cocoa',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
            available: false,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddItem = (item: MenuItem) => {
        setItems([...items, { ...item, id: Date.now().toString() }]);
        setIsModalOpen(false);
    };

    const handleEditItem = (item: MenuItem) => {
        setItems(items.map((i) => (i.id === item.id ? item : i)));
        setEditingItem(null);
    };

    const handleDeleteItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const filteredAvailableItems = items.filter(
        (item) =>
            item.available &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUnavailableItems = items.filter(
        (item) =>
            !item.available &&
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Menu Items</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                        <Plus size={20} className="mr-2" />
                        Add New Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {filteredAvailableItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <p className="text-lg font-semibold mt-2">${item.price.toFixed(2)}</p>
                        <div className="flex space-x-2 mt-4">
                            <button
                                onClick={() => setEditingItem(item)}
                                className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                            >
                                <Edit2 size={16} className="mr-2" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                                <Trash2 size={16} className="mr-2" />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredUnavailableItems.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-lg font-semibold mb-4">Non-available Items</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredUnavailableItems.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 opacity-70">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="font-semibold">{item.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                <p className="text-lg font-semibold mt-2">${item.price.toFixed(2)}</p>
                                <div className="flex space-x-2 mt-4">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
                                    >
                                        <Edit2 size={16} className="mr-2" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="flex items-center px-3 py-2 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                                    >
                                        <Trash2 size={16} className="mr-2" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <MenuItemModal
                isOpen={isModalOpen || !!editingItem}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingItem(null);
                }}
                onSave={editingItem ? handleEditItem : handleAddItem}
                item={editingItem}
            />
        </div>
    );
}
