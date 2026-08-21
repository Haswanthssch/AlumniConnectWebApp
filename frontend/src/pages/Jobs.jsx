import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import DemoBadge from '../components/common/DemoBadge';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState([]);

  // Mock job data
  const mockJobs = [
    {
      id: 1,
      title: 'Software Development Engineer',
      company: 'Google',
      location: 'Bangalore, India',
      type: 'Full-time',
      salary: '₹15-25 LPA',
      description: 'Join our team building next-generation search technologies. Looking for strong CS fundamentals and passion for scalable systems.',
      requirements: ['Bachelor\'s in Computer Science', 'Strong programming skills', 'Knowledge of data structures and algorithms'],
      postedBy: {
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6d6b3b0?w=150',
        position: 'Software Engineer at Google'
      },
      postedDate: '2025-09-15T00:00:00Z',
      applicationDeadline: '2025-10-15T00:00:00Z',
      applicants: 45,
      logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'
    },
    {
      id: 2,
      title: 'Design Engineer - Battery Technology',
      company: 'Tesla',
      location: 'Fremont, CA',
      type: 'Full-time',
      salary: '$95,000 - $150,000',
      description: 'Work on cutting-edge battery technology for electric vehicles. Be part of the sustainable transportation revolution.',
      requirements: ['Degree in Mechanical/Electrical Engineering', 'Experience with CAD software', 'Knowledge of battery systems'],
      postedBy: {
        name: 'Rahul Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        position: 'Senior Design Engineer at Tesla'
      },
      postedDate: '2025-09-14T00:00:00Z',
      applicationDeadline: '2025-10-20T00:00:00Z',
      applicants: 32,
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100'
    },
    {
      id: 3,
      title: 'Product Management Intern',
      company: 'Microsoft',
      location: 'Hyderabad, India',
      type: 'Internship',
      salary: '₹50,000/month',
      description: 'Summer internship opportunity in product management. Work on enterprise software products used by millions.',
      requirements: ['Currently pursuing Bachelor\'s/Master\'s', 'Strong analytical skills', 'Interest in technology products'],
      postedBy: {
        name: 'Vikram Singh',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        position: 'Product Manager at Microsoft'
      },
      postedDate: '2025-09-13T00:00:00Z',
      applicationDeadline: '2025-11-01T00:00:00Z',
      applicants: 78,
      logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=100'
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Flipkart',
      location: 'Bangalore, India',
      type: 'Full-time',
      salary: '₹12-18 LPA',
      description: 'Build user interfaces for India\'s leading e-commerce platform. Work with React, TypeScript, and modern web technologies.',
      requirements: ['2+ years React experience', 'TypeScript knowledge', 'Understanding of web performance'],
      postedBy: {
        name: 'Arjun Mehta',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        position: 'Tech Lead at Flipkart'
      },
      postedDate: '2025-09-12T00:00:00Z',
      applicationDeadline: '2025-10-12T00:00:00Z',
      applicants: 124,
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'
    }
  ];

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || job.location.includes(locationFilter);
    const matchesType = typeFilter === 'all' || job.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <DemoBadge label="Static demo" />
        </div>
        <p className="text-gray-600">Discover career opportunities posted by alumni (no jobs backend yet — showing demo data)</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{mockJobs.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Posted This Week</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BookmarkIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Saved Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{savedJobs.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Job Listings */}
      <div className="space-y-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {job.title}
                      </h3>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        {savedJobs.includes(job.id) ? (
                          <BookmarkIconSolid className="h-5 w-5 text-blue-600" />
                        ) : (
                          <BookmarkIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{job.type}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar
                        src={job.postedBy.avatar}
                        name={job.postedBy.name}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{job.postedBy.name}</p>
                        <p className="text-xs text-gray-500">{job.postedBy.position}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Posted {formatDate(job.postedDate)}</p>
                      <p>Deadline: {formatDate(job.applicationDeadline)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-500">{job.applicants} applicants</p>
                    <Button className="flex items-center space-x-2">
                      <span>Apply Now</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </motion.div>
      )}
    </div>
  );
};

export default Jobs;