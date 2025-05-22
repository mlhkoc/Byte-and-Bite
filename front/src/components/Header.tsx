import React from 'react';
import { Package, Search, SlidersHorizontal, ShoppingCart, User, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import AvailabilityToggle from './AvailabilityToggle';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DropdownMenu } from './DropdownMenu';

const Header: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white mr-3">
              <Package size={20} />
            </div>
            <h1 className="text-lg font-semibold">Welcome, {user?.name || 'Courier'}</h1>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {navigate("/logout")}}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

        </div>

        {/* AvailabilityToggle butonuna margin-top ekledik */}
        <div className="mt-4">
          <AvailabilityToggle />
        </div>

      </header>
  );
};

export default Header;

export function CustomerHeader() {
  const navigate = useNavigate();
  const { items, setIsCartOpen } = useCart();
  const { isLoggedIn } = useAuth();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { setIsLoggedIn } = useAuth();


  return (
    <div className="flex justify-between items-center mb-8">
      <button onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="h-10 w-auto" />
      </button>
      <div className="flex gap-4">
          {isLoggedIn ? (
              <>
                  <button
                      onClick={() => setIsCartOpen(true)}
                      className="p-2 hover:bg-gray-100 rounded-full relative"
                  >
                      <ShoppingCart className="w-6 h-6" />
                      {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {cartCount}
                          </span>
                      )}
                  </button>
                  <DropdownMenu
                      items={[
                          {
                              label: 'Orders',
                              onClick: () => navigate('/orders'),
                          },
                          {
                              label: 'Profile',
                              onClick: () => navigate('/profile'),
                          },
                          {
                              label: 'Logout',
                              onClick: () => {
                                  navigate('/logout');
                              },
                          },
                      ]}
                  >
                      <button className="p-2 hover:bg-gray-100 rounded-full">
                          <User className="w-6 h-6" />
                      </button>
                  </DropdownMenu>
              </>
          ) : (
              <>
                  <Link to="/auth?mode=login">
                      <button className="p-2 px-4 hover:bg-gray-100 rounded-full font-semibold">Login</button>
                  </Link>
                  <Link to="/auth?mode=signup">
                      <button className="p-2 px-4 hover:bg-gray-100 rounded-full font-semibold">Signup</button>
                  </Link>
              </>
          )}
      </div>
    </div>
  );
}
