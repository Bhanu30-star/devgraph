'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Developer } from '@/lib/queries/types';

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDevelopers = async (query = '') => {
    try {
      setLoading(true);
      setError(null);
      const url = query ? `/api/developers?q=${encodeURIComponent(query)}` : '/api/developers';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setDevelopers(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch developers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchDevelopers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDevelopers(searchTerm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Developers</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find and connect with developers across the network.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by developer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Search
        </button>
      </form>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorMessage message={error} onRetry={() => fetchDevelopers(searchTerm)} />
      ) : developers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No developers found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {developers.map((developer) => (
            <Link key={developer.id} href={`/developers/${developer.id}`}>
              <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center">
                    <img className="h-12 w-12 rounded-full border border-gray-200" src={developer.avatar} alt="" />
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{developer.name}</h3>
                      <p className="text-sm text-indigo-600 font-medium">{developer.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {developer.location}
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{developer.bio}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
