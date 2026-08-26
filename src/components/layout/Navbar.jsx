import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '/properties' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <svg width="30" height="35" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="20" r="10" stroke="#0682ff"/>
                  <circle cx="15" cy="20" r="6" stroke="#0682ff" strokeWidth="3"/>
              </svg>  
              <span className="text-2xl font-bold text-primary-600 mt-1.5">RentVerse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-secondary-600 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="text-secondary-600 hover:text-primary-600 p-2 rounded-md"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              className="btn"
            >
              Connect
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-secondary-600 hover:text-primary-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center px-3 py-2 text-base font-medium text-secondary-600 hover:text-primary-600"
              >
                {theme === 'dark' ? <FiSun className="mr-2" size={18} /> : <FiMoon className="mr-2" size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                onClick={() => setIsOpen(false)}
              >
                Connect
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;