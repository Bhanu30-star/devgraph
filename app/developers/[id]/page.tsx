'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, Cpu, Users, ArrowLeft } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Developer, Project, Technology } from '@/lib/queries/types';

interface DeveloperDetail {
  developer: Developer;
  technologies: Technology[];
  projects: Project[];
  collaborators: Developer[];
}

export default function DeveloperDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<DeveloperDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeveloper = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/developers/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError('Failed to fetch developer details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeveloper();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDeveloper} />;
  if (!data) return <ErrorMessage message="Developer not found" />;

  const { developer, technologies, projects, collaborators } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/developers" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Developers
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <img className="h-16 w-16 rounded-full border border-gray-200 mr-4" src={developer.avatar} alt="" />
          <div>
            <h3 className="text-xl leading-6 font-bold text-gray-900">{developer.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-indigo-600 font-medium">{developer.role}</p>
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
              {developer.location}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900">{developer.bio}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Technologies */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-indigo-500" /> Known Technologies
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

        {/* Projects */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-green-500" /> Projects
          </h4>
          {projects.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {projects.map(project => (
                <li key={project.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500">{project.status}</p>
                  </div>
                  <Link href={`/projects/${project.id}`}>
                    <span className="text-sm text-indigo-600 hover:text-indigo-900">View</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No projects listed.</p>
          )}
        </div>

        {/* Collaborators */}
        <div className="bg-white shadow sm:rounded-lg p-6 sm:col-span-2">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" /> Collaborators
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Found via graph traversal: Developer &#8594; WORKED_ON &#8594; Project &#8592; WORKED_ON &#8590; Developer
          </p>
          {collaborators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {collaborators.map(collaborator => (
                <Link key={collaborator.id} href={`/developers/${collaborator.id}`}>
                  <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <img className="h-10 w-10 rounded-full" src={collaborator.avatar} alt="" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                      <p className="text-xs text-gray-500">{collaborator.role}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No collaborators found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
