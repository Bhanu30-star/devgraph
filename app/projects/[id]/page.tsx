'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Activity, Cpu, Users, ArrowLeft } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Project, Developer, Technology } from '@/lib/queries/types';

interface ProjectDetail {
  project: Project;
  developers: Developer[];
  technologies: Technology[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/projects/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchProject} />;
  if (!data) return <ErrorMessage message="Project not found" />;

  const { project, developers, technologies } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Projects
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-xl leading-6 font-bold text-gray-900">{project.name}</h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">{project.description}</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Activity className="mr-2 h-4 w-4" /> Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{project.status}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Year
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{project.year}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technologies */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-indigo-500" /> Technologies Used
          </h4>
          {technologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {technologies.map(tech => (
                <Link key={tech.id} href={`/technologies/${tech.id}`}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 cursor-pointer">
                    {tech.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No technologies listed.</p>
          )}
        </div>

        {/* Developers */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-green-500" /> Team Members
          </h4>
          {developers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {developers.map(developer => (
                <Link key={developer.id} href={`/developers/${developer.id}`}>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <img className="h-10 w-10 rounded-full" src={developer.avatar} alt="" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{developer.name}</p>
                      <p className="text-xs text-gray-500">{developer.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No team members listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
