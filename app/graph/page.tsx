'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';

// Dynamically import ForceGraph2D to avoid SSR issues with canvas
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { 
  ssr: false,
  loading: () => <Loading />
});

export default function GraphExplorerPage() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fgRef = useRef<any>(null);

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/graph');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError(json.error);
      }
    } catch (err) {
      setError('Failed to load graph data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const getNodeColor = (node: any) => {
    switch (node.type) {
      case 'Developer': return '#6366f1'; // Indigo
      case 'Project': return '#22c55e'; // Green
      case 'Technology': return '#a855f7'; // Purple
      default: return '#9ca3af'; // Gray
    }
  };

  const handleNodeClick = useCallback((node: any) => {
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(2, 2000);
    }
  }, []);

  if (error) return <ErrorMessage message={error} onRetry={fetchGraphData} />;

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Graph Explorer</h1>
        <p className="mt-1 text-sm text-gray-500">
          Interactive visualization of the developer knowledge graph.
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>Developer</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>Project</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>Technology</div>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden relative">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10"><Loading /></div>}
        
        {typeof window !== 'undefined' && data.nodes.length > 0 && (
          <ForceGraph2D
            ref={fgRef}
            graphData={data}
            nodeLabel="label"
            nodeColor={getNodeColor}
            nodeRelSize={6}
            linkColor={() => '#cbd5e1'}
            linkWidth={1}
            linkDirectionalArrowLength={3.5}
            linkDirectionalArrowRelPos={1}
            onNodeClick={handleNodeClick}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
          />
        )}
      </div>
    </div>
  );
}
