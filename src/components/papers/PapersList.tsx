'use client';

import { GET_PAPERS, Paper, PapersResponse } from '@/lib/apollo-client';
import { useQuery } from '@apollo/client';
import Link from 'next/link';

export default function PapersList() {
  const { data, loading, error, refetch } = useQuery<PapersResponse>(GET_PAPERS);

  const papers = data?.papers_connection;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading papers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <h3 className="text-red-800 font-medium">Error loading papers</h3>
        <p className="text-red-600 text-sm mt-1">
          {error.message || 'Something went wrong'}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!papers || !papers.nodes || papers.nodes.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-gray-600 font-medium">No papers found</h3>
        <p className="text-gray-500 text-sm mt-1">
          There are no papers available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Papers List */}
      <div className="grid gap-4">
        {papers.nodes.map((paper: Paper) => (
          <div
            key={paper.documentId}
            className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <Link href={`/papers/${paper.documentId}`} className="block p-6">
              {/* Paper Title */}
              <h3 className="text-lg font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors mb-2">
                {paper.title}
              </h3>

              {paper.content && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {paper.content.length > 150
                    ? `${paper.content.substring(0, 150)}...`
                    : paper.content
                  }
                </p>
              )}

              {/* Paper Details */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div>
                  Published: {new Date(paper.publishedAt).toLocaleDateString()}
                </div>
                <div>
                  Updated: {new Date(paper.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* View Details Button */}
              <div className="flex justify-end">
                <span className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  View Details →
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Simple Results Info */}
      <div className="text-center text-sm text-gray-500">
        Showing {papers.nodes.length} papers
        {papers.pageInfo && papers.pageInfo.total && (
          <span> of {papers.pageInfo.total} total</span>
        )}
      </div>
    </div>
  );
}