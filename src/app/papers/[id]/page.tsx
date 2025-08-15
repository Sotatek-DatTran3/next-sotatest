'use client';

import PaperDetail from '@/components/papers/PaperDetail';
import Link from 'next/link';
import { use } from 'react';

interface PaperPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PaperPage({ params }: PaperPageProps) {
  const { id } = use(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/papers"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Papers
        </Link>
      </div>
      <PaperDetail documentId={id} />
    </div>
  );
}
