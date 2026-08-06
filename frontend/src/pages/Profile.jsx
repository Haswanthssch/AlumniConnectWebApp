import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import PostCard from '../components/posts/PostCard';
import { postService, authService } from '../services/auth';
import {
  PencilIcon,
  MapPinIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  HandThumbUpIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';

const emptyProject = { title: '', description: '', tags: '', status: 'Live', link: '' };

const Profile = () => {
  const { user, setUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isOwnProfile = !id || id === user?._id;

  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [showAllConnections, setShowAllConnections] = useState(false);

  // Edit modal state
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    bio: '',
    about: '',
    location: '',
    skills: [],
    projects: [],
  });
  const [skillInput, setSkillInput] = useState('');

  // Live: fetch the profile owner's real account data from the backend.
  useEffect(() => {
    const loadProfileUser = async () => {
      if (isOwnProfile) {
        setOtherUser(null);
        return;
      }
      try {
        const data = await authService.getUserProfile(id);
        setOtherUser(data);
        setIsFollowing(!!data?.followers?.some((f) => (f?._id || f) === user?._id));
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };
    loadProfileUser();
  }, [id, user, isOwnProfile]);

  useEffect(() => {
    setActiveTab('posts');
  }, [id]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const profileId = id || user?._id;
        const allPosts = await postService.getAllPosts();
        setUserPosts(allPosts.filter((p) => p.owner?._id === profileId));
        if (isOwnProfile) {
          const saved = await postService.getSavedPosts();
          setSavedPosts(saved);
        }
      } catch (error) {
        console.error('Failed to load profile posts:', error);
      }
    };
    if (user) loadPosts();
  }, [id, user, isOwnProfile]);

  const handleLike = async (postId) => {
    try {
      await postService.likePost(postId);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    try {
      await postService.commentOnPost(postId, { comment: commentText });
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };

  const handleSave = async (postId) => {
    try {
      await postService.savePost(postId);
      const saved = await postService.getSavedPosts();
      setSavedPosts(saved);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setUserPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Real account data for the profile owner (own profile → auth user, else fetched)
  const account = isOwnProfile ? user : otherUser;

  // Normalize skills: own profile skills carry an endorsedBy array, public
  // profile skills carry a pre-computed endorsements count + endorsedByMe flag.
  const skills = (account?.skills || []).map((s) => ({
    name: s.name,
    endorsements: s.endorsements ?? s.endorsedBy?.length ?? 0,
    endorsedByMe: s.endorsedByMe ?? false,
  }));

  const projects = isOwnProfile ? account?.projects || [] : [];

  const followersList = Array.isArray(account?.followers) ? account.followers : [];
  const followersCount = followersList.length;
  const followingCount = Array.isArray(account?.following) ? account.following.length : 0;

  // Joined date derives from the account creation timestamp (read-only).
  const joinedDate = account?.createdAt
    ? format(new Date(account.createdAt), 'MMMM yyyy')
    : '';

  const profileUser = {
    name: account?.name || 'Loading...',
    role: account?.role || '',
    batch: account?.batch || '',
    department: account?.department || '',
    avatar: account?.avatar,
    coverImage: account?.coverImage,
    bio: account?.bio || '',
    about: isOwnProfile ? account?.about || '' : '',
    location: account?.location || '',
    currentPosition:
      account?.currentEmploymentStatus ||
      (account?.role === 'alumni' ? 'Alumnus' : 'Student'),
  };

  const handleFollow = async () => {
    const targetId = id || account?._id;
    if (!targetId) return;
    setIsFollowing((prev) => !prev);
    try {
      await authService.followUser(targetId);
    } catch (error) {
      console.error('Failed to follow user:', error);
      setIsFollowing((prev) => !prev);
    }
  };

  // ---- Edit profile ----
  const openEdit = () => {
    setForm({
      bio: account?.bio || '',
      about: account?.about || '',
      location: account?.location || '',
      skills: (account?.skills || []).map((s) => s.name),
      projects: (account?.projects || []).map((p) => ({
        title: p.title || '',
        description: p.description || '',
        tags: (p.tags || []).join(', '),
        status: p.status || 'Live',
        link: p.link || '',
      })),
    });
    setSkillInput('');
    setIsEditing(true);
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (form.skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setSkillInput('');
      return;
    }
    setForm((f) => ({ ...f, skills: [...f.skills, value] }));
    setSkillInput('');
  };

  const removeSkill = (name) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== name) }));
  };

  const updateProjectField = (index, field, value) => {
    setForm((f) => ({
      ...f,
      projects: f.projects.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const addProject = () => {
    setForm((f) => ({ ...f, projects: [...f.projects, { ...emptyProject }] }));
  };

  const removeProject = (index) => {
    setForm((f) => ({ ...f, projects: f.projects.filter((_, i) => i !== index) }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const payload = {
        bio: form.bio,
        about: form.about,
        location: form.location,
        skills: form.skills,
        projects: form.projects.map((p) => ({
          title: p.title,
          description: p.description,
          tags: p.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          status: p.status,
          link: p.link,
        })),
      };
      const res = await authService.updateProfile(payload);
      if (res?.user) setUser(res.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEndorse = async (skillName) => {
    if (isOwnProfile) return;
    try {
      const res = await authService.endorseSkill(id, skillName);
      setOtherUser((prev) => ({
        ...prev,
        skills: (prev?.skills || []).map((s) =>
          s.name === skillName
            ? { ...s, endorsements: res.endorsements, endorsedByMe: res.endorsedByMe }
            : s
        ),
      }));
    } catch (error) {
      console.error('Failed to endorse skill:', error);
    }
  };

  // Other users only expose public sections (Posts + Skills).
  const tabs = isOwnProfile
    ? [
        { id: 'posts', name: 'Posts', count: userPosts.length },
        { id: 'saved', name: 'Saved', count: savedPosts.length },
        { id: 'about', name: 'About', count: null },
        { id: 'projects', name: 'Projects', count: projects.length },
        { id: 'skills', name: 'Skills', count: skills.length },
      ]
    : [
        { id: 'posts', name: 'Posts', count: userPosts.length },
        { id: 'skills', name: 'Skills', count: skills.length },
      ];

  const visibleConnections = showAllConnections ? followersList : followersList.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
      >
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          {profileUser.coverImage && (
            <img
              src={profileUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          {isOwnProfile && (
            <button
              onClick={openEdit}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 relative">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar
                src={profileUser.avatar}
                name={profileUser.name}
                size="2xl"
                className="border-4 border-white shadow-lg"
              />
            </div>

            {/* Profile Details */}
            <div className="flex-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {/* Name, branch and batch are read-only account data */}
                  <h1 className="text-2xl font-bold text-gray-900">{profileUser.name}</h1>
                  <p className="text-lg text-gray-600">{profileUser.currentPosition}</p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <AcademicCapIcon className="h-4 w-4" />
                      <span>{profileUser.department} • {profileUser.batch}</span>
                    </span>
                    {profileUser.location && (
                      <span className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{profileUser.location}</span>
                      </span>
                    )}
                    {joinedDate && (
                      <span className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Joined {joinedDate}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  {!isOwnProfile ? (
                    <>
                      <Button
                        onClick={handleFollow}
                        variant={isFollowing ? 'secondary' : 'primary'}
                        className="flex items-center space-x-2"
                      >
                        <UserPlusIcon className="h-4 w-4" />
                        <span>{isFollowing ? 'Following' : 'Follow'}</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        <span>Message</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={openEdit}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <div className="mt-4">
                  <p className="text-gray-700 leading-relaxed">{profileUser.bio}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{userPosts.length}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{followersCount}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-900">{followingCount}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Connections (own profile) — show up to 3 with a View All toggle */}
      {isOwnProfile && followersCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Connections</h3>
            {followersCount > 3 && (
              <button
                onClick={() => setShowAllConnections((v) => !v)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {showAllConnections ? 'Show less' : 'View all'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {visibleConnections.map((c) => {
              const connId = c?._id || c;
              return (
                <button
                  key={connId}
                  onClick={() => navigate(`/profile/${connId}`)}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-left"
                >
                  <Avatar src={c?.avatar} name={c?.name} size="md" />
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{c?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {c?.department}{c?.batch ? ` • ${c.batch}` : ''}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Profile Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                {tab.count !== null && (
                  <span className="ml-2 py-0.5 px-2 bg-gray-100 text-gray-600 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={() => {}}
                    onSave={handleSave}
                    onDelete={handleDeletePost}
                    currentUserId={user?._id}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && isOwnProfile && (
            <div className="space-y-6">
              {savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={() => {}}
                    onSave={handleSave}
                    onDelete={handleDeletePost}
                    currentUserId={user?._id}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved posts yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && isOwnProfile && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                {profileUser.about ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {profileUser.about}
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Add an About section to tell others about yourself.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'projects' && isOwnProfile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Featured Projects</h3>
                <Button size="sm" variant="outline" onClick={openEdit}>
                  <PencilIcon className="h-4 w-4 mr-1" /> Manage
                </Button>
              </div>
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        {project.status && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {project.status}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                      )}
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-3"
                        >
                          View project <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No projects yet. Use “Manage” to add your featured projects.
                </p>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills &amp; Endorsements</h3>
                {isOwnProfile && (
                  <Button size="sm" variant="outline" onClick={openEdit}>
                    <PencilIcon className="h-4 w-4 mr-1" /> Manage
                  </Button>
                )}
              </div>
              {skills.length > 0 ? (
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{skill.name}</p>
                        <p className="text-xs text-gray-500">
                          {skill.endorsements} endorsement{skill.endorsements === 1 ? '' : 's'}
                        </p>
                      </div>
                      {!isOwnProfile && (
                        <button
                          onClick={() => handleEndorse(skill.name)}
                          className={`inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                            skill.endorsedByMe
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <HandThumbUpIcon className="h-4 w-4" />
                          {skill.endorsedByMe ? 'Endorsed' : 'Endorse'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  {isOwnProfile
                    ? 'No skills added yet. Use “Manage” to add your skills.'
                    : 'No skills to show.'}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Read-only account details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                    <input
                      value={profileUser.name}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Branch</label>
                    <input
                      value={profileUser.department}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Batch</label>
                    <input
                      value={profileUser.batch}
                      disabled
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <input
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    placeholder="A short headline about you"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                  <textarea
                    value={form.about}
                    onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                    rows={4}
                    placeholder="Tell others about yourself"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                  <div className="flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill and press Enter"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button type="button" variant="secondary" onClick={addSkill}>
                      Add
                    </Button>
                  </div>
                  {form.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button onClick={() => removeSkill(skill)}>
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Projects */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Featured Projects
                    </label>
                    <Button type="button" size="sm" variant="outline" onClick={addProject}>
                      <PlusIcon className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {form.projects.map((project, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Project {index + 1}
                          </span>
                          <button
                            onClick={() => removeProject(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          value={project.title}
                          onChange={(e) => updateProjectField(index, 'title', e.target.value)}
                          placeholder="Project title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) =>
                            updateProjectField(index, 'description', e.target.value)
                          }
                          rows={2}
                          placeholder="Short description"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            value={project.tags}
                            onChange={(e) => updateProjectField(index, 'tags', e.target.value)}
                            placeholder="Tags (comma separated)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            value={project.status}
                            onChange={(e) =>
                              updateProjectField(index, 'status', e.target.value)
                            }
                            placeholder="Status (e.g. Live, In Progress)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <input
                          value={project.link}
                          onChange={(e) => updateProjectField(index, 'link', e.target.value)}
                          placeholder="Project link (optional)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 sticky bottom-0 bg-white">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} loading={saving}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
