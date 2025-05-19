import React from 'react';
import { Link } from 'react-router-dom';

const TopHeader = () => {
  // TODO: Replace with dynamic logo src from admin panel
  const logoSrc = '/placeholder-logo.png';
  // TODO: Replace with dynamic story data from API
  const stories = [
    { id: 1, avatar: '/story1.png', username: 'user1' },
    { id: 2, avatar: '/story2.png', username: 'user2' },
    { id: 3, avatar: '/story3.png', username: 'user3' },
    { id: 4, avatar: '/story4.png', username: 'user4' },
  ];

  return (
    <header className="bg-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <img
            src={logoSrc}
            alt="Brand Logo"
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="bg-white">
            <h1 className="text-xl font-bold text-[#075E37]">
              ShivExa Global Pro
            </h1>
            <p className="text-sm text-[#7B3F00]">ShivExa Global</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/cart">
            <img
              src="/cart-icon.png"
              alt="Cart"
              className="h-8 w-8"
            />
          </Link>
          <Link to="/activity">
            <img
              src="/like-comment-icon.png"
              alt="Activity"
              className="h-8 w-8"
            />
          </Link>
          <Link to="/messages">
            <img
              src="/sms-chat-icon.png"
              alt="Messages"
              className="h-8 w-8"
            />
          </Link>
          <Link to="/settings">
            <img
              src="/burger-icon.png"
              alt="Settings"
              className="h-8 w-8"
            />
          </Link>
        </div>
      </div>
      <hr className="border-t border-gray-200" />
      <div className="px-4 py-3">
        <h2 className="mb-2 text-lg font-semibold">My Story</h2>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex-shrink-0"
            >
              <div className="relative h-14 w-14">
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="absolute inset-0 rounded-full border-2 border-[#075E37]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
