import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import Avatar from '../components/common/Avatar';
import DemoBadge from '../components/common/DemoBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { eventService, postService } from '../services/auth';
import {
  JOB_RECOMMENDATIONS,
  TRENDING_TAGS,
  DEMO_STATS,
} from '../utils/staticData';

const Home = () => {
  const { user } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live: posts come from the backend (/api/post/all)
  const fetchPosts = async () => {
    try {
      const data = await postService.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    eventService.getAllEvents()
      .then((data) => setEvents(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch((error) => console.error('Failed to load events:', error));
  }, []);

  const handleCreatePost = async (postData) => {
    try {
      await postService.createPost(postData);
      await fetchPosts();
      setShowCreatePost(false);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
      await fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await postService.commentOnPost(postId, { comment: commentText });
      await fetchPosts();
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      await postService.savePost(postId);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      await fetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Live: connections come from the logged-in user's real follower list
  const connectionsCount = user?.followers?.length ?? 0;

  const stats = [
    {
      label: 'Connections',
      value: connectionsCount,
      icon: UserGroupIcon,
      iconWrap: 'bg-blue-100 text-blue-600',
      demo: false,
    },
    {
      label: 'Job Opportunities',
      value: DEMO_STATS.jobOpportunities,
      icon: BriefcaseIcon,
      iconWrap: 'bg-green-100 text-green-600',
      demo: true,
    },
    {
      label: 'Messages',
      value: DEMO_STATS.messages,
      icon: ChatBubbleLeftRightIcon,
      iconWrap: 'bg-purple-100 text-purple-600',
      demo: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---------------- MAIN COLUMN ---------------- */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brand / welcome header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Alumni Connect</h1>
                <p className="text-gray-500 mt-0.5">
                  Stay connected, explore opportunities, and grow your network.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.iconWrap}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                          {stat.label}
                        </p>
                        {stat.demo && <DemoBadge />}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Inline composer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex items-center space-x-3">
              <Avatar src={user?.avatar} name={user?.name} size="md" />
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex-1 text-left px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors duration-200"
              >
                What's on your mind? Share with your alumni network...
              </button>
              <motion.button
                onClick={() => setShowCreatePost(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex-shrink-0"
              >
                <PlusIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Post</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Feed */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Updates</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
                <p className="text-gray-500">
                  No posts yet. Be the first to share something with your network!
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Create a post
                </button>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={(p) => console.log('Share post:', p)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    currentUserId={user?._id}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="space-y-6">
          {/* Job Recommendations (static) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Job Recommendations</h3>
                <DemoBadge />
              </div>
              <button className="text-sm text-blue-600 hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {JOB_RECOMMENDATIONS.map((job) => (
                <div key={job.id} className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}
                  >
                    {job.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.company} • {job.location}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-blue-600 font-medium">{job.type}</span>
                      <button className="text-xs text-blue-600 font-medium hover:underline">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
              </div>
                <Link to="/events" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming events yet.</p>
              ) : events.map((event) => {
                const eventDate = new Date(event.date);
                return (
                <div key={event._id} className="flex items-start space-x-3">
                  <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] uppercase leading-none">{eventDate.toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-base font-bold leading-none">{eventDate.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </motion.div>

          {/* Trending (static) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold text-gray-900">Trending</h3>
              <DemoBadge />
            </div>
            <div className="space-y-2">
              {TRENDING_TAGS.map((tag) => (
                <button
                  key={tag}
                  className="block text-sm text-blue-600 hover:underline"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <div className="w-full max-w-lg">
            <CreatePost
              onCreatePost={handleCreatePost}
              onClose={() => setShowCreatePost(false)}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Home;