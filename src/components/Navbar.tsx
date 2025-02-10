'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsProfileOpen(false); // Close dropdown on sign out
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-6 w-6 text-green-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">WellSync</h1>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {['/', '/health-activity', '/nutrition', '/sleep'].map((path) => (
                <Link
                  key={path}
                  href={path}
                  className={`${
                    pathname === path
                      ? 'border-green-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  {path.replace('/', '') || 'Home'}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-green-100 group-hover:ring-green-200 transition-all">
                  <Image
                    src="/default-avatar.png"
                    alt="Profile"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 bg-white/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 transform transition-all">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)} // Close dropdown on selection
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
