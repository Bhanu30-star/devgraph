'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Cpu, Users, Briefcase, ArrowLeft, Network } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { Technology, Developer, Project, Recommendation } from '@/lib/queries/types';

interface TechnologyDetail {
  technology: Technology;
  developers: Developer[];
  projects: Project[];
  relatedTechnologies: Technology[];
}

export default function TechnologyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [data, setData] = useState<TechnologyDetail | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/technologies/${id}`);
      const json = await res.json();
      
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch technology');
      }
      
      setData(json.data);
      
      // Fetch recommendations based on this technology
      const techName = json.data.technology.name;
      const recRes = await fetch(`/api/recommendations?technology=${encodeURIComponent(techName)}`);
      const recJson = await recRes.json();
      
      if (recJson.success) {
        setRecommendations(recJson.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={fetchData} />;
  if (!data) return <ErrorMessage message="Technology not found" />;

  const { technology, developers, projects, relatedTechnologies } = data;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/technologies" className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-4">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Technologies
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:px-6">
        <h3 className="text-2xl leading-6 font-bold text-gray-900 flex items-center">
          <Cpu className="mr-2 h-6 w-6 text-indigo-500" />
          {technology.name}
        </h3>
        <p className="mt-2 text-sm text-gray-500">Category: {technology.category}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Known By */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" /> Known By
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
            <p className="text-sm text-gray-500">No developers found.</p>
          )}
        </div>

        {/* Used In Projects */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Briefcase className="mr-2 h-5 w-5 text-green-500" /> Used In Projects
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
            <p className="text-sm text-gray-500">No projects found.</p>
          )}
        </div>

        {/* Related Technologies */}
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Network className="mr-2 h-5 w-5 text-purple-500" /> Related Technologies
          </h4>
          {relatedTechnologies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {relatedTechnologies.map(tech => (
                <Link key={tech.id} href={`/technologies/${tech.id}`}>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer">
                    {tech.name}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No related technologies found.</p>
          )}
        </div>

        {/* Recommended Developers (Graph Traversal) */}
        <div className="bg-white shadow sm:rounded-lg p-6 lg:col-span-2 border-2 border-indigo-100">
          <h4 className="text-lg font-medium text-indigo-900 mb-2 flex items-center">
            Recommended Developers to Learn {technology.name}
          </h4>
          <p className="text-sm text-gray-500 mb-4">
            Graph traversal recommendation: Developers who don't know {technology.name} yet, but know related technologies.
          </p>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-lg">
                  <div className="flex items-center mb-3">
                    <img className="h-10 w-10 rounded-full" src={rec.developer.avatar} alt="" />
                    <div className="ml-3">
                      <Link href={`/developers/${rec.developer.id}`}>
                        <p className="text-sm font-medium text-indigo-900 hover:underline">{rec.developer.name}</p>
                      </Link>
                      <p className="text-xs text-indigo-700">{rec.developer.role}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Knows related: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.knownTechnologies.map(kt => (
                        <span key={kt.id} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-700">
                          {kt.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recommendations available at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
}
