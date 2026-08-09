'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Briefcase, Cpu, Network, ArrowRight } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface Stats {
  developers: number;
  projects: number;
  technologies: number;
  relationships: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchStats} />;

  const statCards = [
    { name: 'Total Developers', value: stats?.developers, icon: Users, color: 'bg-blue-500' },
    { name: 'Total Projects', value: stats?.projects, icon: Briefcase, color: 'bg-green-500' },
    { name: 'Total Technologies', value: stats?.technologies, icon: Cpu, color: 'bg-purple-500' },
    { name: 'Relationships', value: stats?.relationships, icon: Network, color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of the DevGraph knowledge network.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-md ${item.color}`}>
                    <item.icon className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{item.value || 0}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Discover Connections</h2>
          <p className="text-gray-600 mb-6">
            Explore how developers, projects, and technologies are interconnected in our graph database. Find recommendations for new skills based on related technologies or discover potential collaborators based on shared projects.
          </p>
          <div className="space-y-3">
            <Link href="/graph" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
              Open Graph Explorer <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/developers" className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
              Browse Developers <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
