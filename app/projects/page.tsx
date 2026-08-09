'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Activity } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Project } from '@/lib/queries/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProjects} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore all projects tracked in the knowledge graph.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-6 h-full flex flex-col">
              <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
              <p className="mt-2 text-sm text-gray-600 flex-1">{project.description}</p>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                  {project.year}
                </div>
                <div className="flex items-center text-sm">
                  <Activity className={`mr-1.5 h-4 w-4 ${project.status === 'Active' ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={project.status === 'Active' ? 'text-green-700' : 'text-gray-600'}>{project.status}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
