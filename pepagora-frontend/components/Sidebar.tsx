'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/hooks/useAuth';
import { logoutUser } from '@/lib/api'; // adjust path
import { getUserId, clearAuthData } from '@/lib/auth'; // Your localStorage utils (if used)
import { useState } from 'react';

export default function Sidebar() {
  const { userRole } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const userId = getUserId(); // Function that retrieves userId from localStorage/token

      await logoutUser(userId ?? "");
      clearAuthData(); // Clears localStorage, tokens, etc.
      router.push('/login');
    } catch (error: any) {
      alert(error.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl z-10">
      <div className="p-6 border-b border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <img src="/pepagora_logo.jpeg" alt="Pepagora Logo" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <span className="text-xl font-bold">Pepagora</span>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h2a2 2 0 012 2v2H8V5z" />
          </svg>
          Dashboard
        </Link>
        
        <Link href="/categories" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" />
          </svg>
          Categories
        </Link>
        
        <Link href="/subcategories" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Subcategories
        </Link>
        
        <Link href="/products" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
          <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </Link>
        
        {userRole === 'admin' && (
          <div className="pt-4 mt-4 border-t border-gray-700">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Admin Only</p>
            <Link href="/AdminAccess" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
              <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add User
            </Link>
            <Link href="/viewUser" className="flex items-center px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200 group">
              <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              View Users
            </Link>
          </div>
        )}
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging out...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
