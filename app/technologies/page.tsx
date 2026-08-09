'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cpu } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Technology } from '@/lib/queries/types';

export default function TechnologiesPage() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTechnologies = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/technologies');
      const data = await res.json();
      if (data.success) {
        setTechnologies(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch technologies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchTechnologies} />;

  // Group technologies by category
  const grouped = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Technologies</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover all technologies, languages, and frameworks used by developers.
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, techs]) => (
          <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">{category}</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {techs.map(tech => (
                <Link key={tech.id} href={`/technologies/${tech.id}`}>
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-colors">
                    <Cpu className="h-5 w-5 text-indigo-500 mr-3" />
                    <span className="font-medium text-gray-900">{tech.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
