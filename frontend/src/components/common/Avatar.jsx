import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '', showStatus = false, isOnline = false, onClick }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const baseClasses = `${sizes[size]} rounded-full flex items-center justify-center font-medium relative ${className}`;

  return (
    <div className="relative inline-block" onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${baseClasses} object-cover border-2 border-white shadow-sm`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div 
        className={`${baseClasses} bg-gradient-to-r from-blue-500 to-purple-600 text-white ${src ? 'hidden' : ''}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {getInitials(name)}
      </div>

      {/* Online Status Indicator */}
      {showStatus && (
        <span 
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            isOnline ? 'bg-green-400' : 'bg-gray-300'
          } ${
            size === 'xs' ? 'w-2 h-2' :
            size === 'sm' ? 'w-2.5 h-2.5' :
            size === 'md' ? 'w-3 h-3' :
            size === 'lg' ? 'w-3.5 h-3.5' :
            'w-4 h-4'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;