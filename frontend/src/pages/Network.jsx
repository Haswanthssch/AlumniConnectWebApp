import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AlumniCard from '../components/network/AlumniCard';
import ConnectionCard from '../components/network/ConnectionCard';
import Button from '../components/common/Button';
import DemoBadge from '../components/common/DemoBadge';
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

const Network = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Mock alumni data with enhanced fields
  const mockAlumni = [
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'alumni',
      batch: '2018-22',
      department: 'Computer Science',
      currentPosition: 'Software Engineer at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6d6b3b0?w=150',
      location: 'Bangalore, India',
      connections: 245,
      isConnected: false,
      isOnline: true,
      bio: 'Passionate about technology and helping students navigate their career journey.',
      skills: ['JavaScript', 'React', 'Machine Learning', 'Python'],
      mutualConnections: 5,
      lastActivity: {
        type: 'post',
        timestamp: '2025-09-17T10:30:00Z'
      }
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      role: 'alumni',
      batch: '2016-20',
      department: 'Mechanical Engineering',
      currentPosition: 'Senior Design Engineer at Tesla',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      location: 'San Francisco, USA',
      connections: 189,
      isConnected: true,
      isOnline: false,
      bio: 'Automotive enthusiast working on sustainable transportation solutions.',
      skills: ['CAD Design', 'Battery Technology', 'Project Management'],
      mutualConnections: 8,
      lastActivity: {
        type: 'comment',
        timestamp: '2025-09-16T14:20:00Z'
      }
    },
    {
      id: 3,
      name: 'Ananya Patel',
      role: 'student',
      batch: '2022-26',
      department: 'Computer Science',
      currentPosition: 'Final Year Student',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      location: 'Mumbai, India',
      connections: 87,
      isConnected: false,
      isOnline: true,
      bio: 'Final year CS student interested in AI/ML and software development.',
      skills: ['Python', 'Data Science', 'Machine Learning'],
      mutualConnections: 12,
      lastActivity: {
        type: 'login',
        timestamp: '2025-09-17T16:45:00Z'
      }
    },
    {
      id: 4,
      name: 'Vikram Singh',
      role: 'alumni',
      batch: '2015-19',
      department: 'Business Administration',
      currentPosition: 'Product Manager at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      location: 'Seattle, USA',
      connections: 312,
      isConnected: false,
      isOnline: true,
      bio: 'Product management professional with expertise in enterprise software.',
      skills: ['Product Strategy', 'Data Analysis', 'Leadership'],
      mutualConnections: 3,
      lastActivity: {
        type: 'post',
        timestamp: '2025-09-16T09:15:00Z'
      }
    },
    {
      id: 5,
      name: 'Sneha Gupta',
      role: 'student',
      batch: '2023-27',
      department: 'Electrical Engineering',
      currentPosition: 'Second Year Student',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      location: 'Delhi, India',
      connections: 45,
      isConnected: true,
      isOnline: false,
      bio: 'Second year EE student passionate about renewable energy and power systems.',
      skills: ['Circuit Design', 'Power Systems', 'Arduino'],
      mutualConnections: 7,
      lastActivity: {
        type: 'comment',
        timestamp: '2025-09-15T11:30:00Z'
      }
    }
  ];

  const [people, setPeople] = useState(mockAlumni);

  const handleConnect = async (userId) => {
    // Simulate API call
    console.log('Connecting to user:', userId);
    setPeople(people.map(person =>
      person.id === userId
        ? { ...person, isConnected: !person.isConnected }
        : person
    ));
  };

  const handleDisconnect = async (userId) => {
    // Simulate API call
    console.log('Disconnecting from user:', userId);
    setPeople(people.map(person =>
      person.id === userId
        ? { ...person, isConnected: false }
        : person
    ));
  };

  const handleMessage = (userId) => {
    console.log('Starting conversation with user:', userId);
    navigate('/messages');
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const departments = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Business Administration'];

  const filteredPeople = people.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.currentPosition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         person.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || person.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || person.department === filterDepartment;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const discoverPeople = filteredPeople.filter(p => !p.isConnected);
  const connectedPeople = filteredPeople.filter(p => p.isConnected);

  const tabs = [
    { id: 'discover', name: 'Discover People', count: discoverPeople.length },
    { id: 'connections', name: 'My Connections', count: connectedPeople.length },
    { id: 'requests', name: 'Requests', count: 3 },
    { id: 'suggestions', name: 'Suggestions', count: 8 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Network</h1>
          <DemoBadge label="Static demo" />
        </div>
        <p className="text-gray-600">Connect with alumni and fellow students to expand your professional network (directory is demo data — the backend has follow/unfollow but no user-listing endpoint yet)</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Connections</p>
              <p className="text-2xl font-bold text-gray-900">{connectedPeople.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Alumni Network</p>
              <p className="text-2xl font-bold text-gray-900">
                {people.filter(p => p.role === 'alumni').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">
                {people.filter(p => p.role === 'student').length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search people by name, position, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="alumni">Alumni</option>
            <option value="student">Students</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 py-0.5 px-2 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'discover' && (
            <div>
              {discoverPeople.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {discoverPeople.map((person, index) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AlumniCard
                        alumni={person}
                        onConnect={handleConnect}
                        onMessage={handleMessage}
                        onViewProfile={handleViewProfile}
                        isConnected={person.isConnected}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No people found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'connections' && (
            <div>
              {connectedPeople.length > 0 ? (
                <div className="space-y-4">
                  {connectedPeople.map((person, index) => (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ConnectionCard
                        connection={person}
                        onMessage={handleMessage}
                        onDisconnect={handleDisconnect}
                        onViewProfile={handleViewProfile}
                        layout="horizontal"
                        showLastActivity={true}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <UserPlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                  <p className="text-gray-500 mb-4">Start building your network by connecting with alumni and students</p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover People
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlusIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-500">Connection requests will appear here when you receive them</p>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Suggestions Coming Soon</h3>
              <p className="text-gray-500">We'll suggest people you might know based on your interests and connections</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Network;