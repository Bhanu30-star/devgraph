import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-gray-500">Loading data...</p>
    </div>
  );
}
