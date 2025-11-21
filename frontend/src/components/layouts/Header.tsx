'use client';

import { Bell, Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Search Bar */}
      <div className="flex flex-1 items-center">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="챌린지, 잡, 배지 검색..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="알림"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 rounded-lg px-3 py-2 hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">JD</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">John Doe</div>
              <div className="text-xs text-gray-500">개발자</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  프로필 보기
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  설정
                </a>
                <hr className="my-1 border-gray-200" />
                <button
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    // TODO: Implement logout
                    console.log('로그아웃');
                  }}
                >
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
