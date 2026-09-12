import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  BriefcaseIcon as BriefcaseIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Network',
      path: '/network',
      icon: UserGroupIcon,
      iconSolid: UserGroupIconSolid,
    },
    {
      name: 'Jobs',
      path: '/jobs',
      icon: BriefcaseIcon,
      iconSolid: BriefcaseIconSolid,
    },
    {
      name: 'Events',
      path: '/events',
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightIconSolid,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Alumni Connect
              </span>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search alumni, students, posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </form>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = isActive ? item.iconSolid : item.icon;
              
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs mt-1 font-medium">{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}

            {/* Notifications */}
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar 
                  src={user?.avatar} 
                  name={user?.name} 
                  size="sm"
                />
                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                  {user?.name}
                </span>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 capitalize">{user?.role} • {user?.batch}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                      View Profile
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;