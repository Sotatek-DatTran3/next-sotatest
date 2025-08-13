'use client';

import { useAuth } from '@/contexts/AuthContext';
import { DELETE_PAPER, GET_PAPER, GET_PAPERS, PaperDetailResponse, UPDATE_PAPER } from '@/lib/apollo-client';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PaperDetailProps {
  documentId: string;
}

export default function PaperDetail({ documentId }: PaperDetailProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { data, loading, error, refetch } = useQuery<PaperDetailResponse, { documentId: string }>(GET_PAPER, {
    variables: { documentId },
  });

  const [deletePaper] = useMutation(DELETE_PAPER, {
    onCompleted: () => {
      router.push('/papers');
    },
    onError: (error) => {
      console.error('Error deleting paper:', error);
      alert('Failed to delete paper. Please try again.');
    },
    refetchQueries: [{ query: GET_PAPERS }],
    awaitRefetchQueries: true,
  });

  const [updatePaper] = useMutation(UPDATE_PAPER, {
    onCompleted: () => {
      setIsEditing(false);
      refetch();
    },
    onError: (error) => {
      console.error('Error updating paper:', error);
      alert('Failed to update paper. Please try again.');
    },
  });

  const handleEdit = () => {
    if (data?.paper) {
      setEditTitle(data.paper.title);
      setEditContent(data.paper.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    updatePaper({
      variables: {
        documentId,
        data: {
          title: editTitle,
          content: editContent,
        }
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      deletePaper({
        variables: { documentId }
      });
    }
  };

  const isAuthor = user && data?.paper?.author?.username === user.username;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h3 className="text-red-800 font-medium text-lg mb-2">Error loading paper</h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.paper) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h3 className="text-gray-600 font-medium text-lg">Paper not found</h3>
          <p className="text-gray-500">The requested paper could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <article className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
              {data.paper.title}
            </h1>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Published:</span>{' '}
              {new Date(data.paper.publishedAt).toLocaleDateString()}
            </div>
            {data.paper.author && (
              <div>
                <span className="font-medium">Author:</span>{' '}
                {data.paper.author.username}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {data.paper.content && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Content</h3>
            {isEditing ? (
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {data.paper.content}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {isAuthor && (
                  <>
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </>
                )}
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <div className="flex justify-between text-xs text-gray-500">
            <div>
              Last updated: {new Date(data.paper.updatedAt).toLocaleDateString()}
            </div>
            <div>
              Created: {new Date(data.paper.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
