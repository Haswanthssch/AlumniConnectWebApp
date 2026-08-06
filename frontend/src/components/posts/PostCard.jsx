import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

const PostCard = ({ 
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onDelete,
  currentUserId 
}) => {
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUserId));
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const goToOwnerProfile = () => {
    if (post.owner?._id) navigate(`/profile/${post.owner._id}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(post._id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(post._id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post._id, commentText);
      setCommentText('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
    >
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar 
              src={post.owner?.avatar} 
              name={post.owner?.name}
              size="md"
              onClick={goToOwnerProfile}
              className="cursor-pointer"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3
                  onClick={goToOwnerProfile}
                  className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                >
                  {post.owner?.name}
                </h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full capitalize">
                  {post.owner?.role}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <span>{post.owner?.department}</span>
                <span>•</span>
                <span>{post.owner?.batch}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          {/* Post Options */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
            </motion.button>
            
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10"
              >
                <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Report Post
                </button>
                {post.owner?._id === currentUserId && (
                  <button 
                    onClick={() => onDelete(post._id)}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete Post
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {post.post}
        </p>
        
        {/* Mentions */}
        {post.mentions && post.mentions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.mentions.map((mention) => (
              <span 
                key={mention._id}
                className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-sm hover:bg-blue-100 cursor-pointer"
              >
                @{mention.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="px-6 pb-4">
          <motion.img
            src={post.image.url}
            alt="Post content"
            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-95 transition-opacity duration-200"
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              // Open image in modal
              console.log('Open image modal');
            }}
          />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-6 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.likes?.length || 0} likes</span>
          <span>{post.comments?.length || 0} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                isLiked 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              {isLiked ? (
                <HeartIconSolid className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">Like</span>
            </motion.button>

            {/* Comment Button */}
            <motion.button
              onClick={() => setShowComments(!showComments)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <ChatBubbleOvalLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Comment</span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              onClick={() => onShare(post)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
            >
              <ShareIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Share</span>
            </motion.button>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isSaved
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {isSaved ? (
              <BookmarkIconSolid className="h-5 w-5" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-100"
        >
          {/* Comments List */}
          <div className="px-6 py-4 max-h-60 overflow-y-auto">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3 mb-4">
                <Avatar 
                  src={comment.user?.avatar} 
                  name={comment.user?.name}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm text-gray-900">
                      {comment.user?.name}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {comment.comment}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-3">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <div className="px-6 py-4 border-t border-gray-100">
            <form onSubmit={handleComment} className="flex items-center space-x-3">
              <Avatar 
                src={post.currentUser?.avatar} 
                name={post.currentUser?.name}
                size="sm"
              />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!commentText.trim()}
                  className="px-4"
                >
                  Post
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;