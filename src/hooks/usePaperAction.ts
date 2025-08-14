'use client';

import {
  CREATE_PAPER,
  DELETE_PAPER,
  GET_PAPER,
  GET_PAPERS,
  PaperDetailResponse,
  PaperInput,
  PapersResponse,
  UPDATE_PAPER
} from "@/lib/apollo-client";
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export interface CreatePaperData {
  title: string;
  content?: string;
}

export interface UpdatePaperData {
  documentId: string;
  data: PaperInput;
}

export interface PaperQueryState {
  data: PapersResponse | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<unknown>;
}

export interface PaperDetailState {
  data: PaperDetailResponse | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  refetch: () => Promise<unknown>;
}

export interface PaperMutationState {
  loading: boolean;
  error: ApolloError | undefined;
}
// Mutation Hooks
export function useCreatePaper() {
  const router = useRouter();
  const [createMutation, { loading, error }] = useMutation(CREATE_PAPER, {
    onCompleted: () => {
      console.log('Paper created successfully');
      router.push('/papers');
    },
    onError: (error: ApolloError) => {
      console.error('Paper creation failed:', error.message);
    },
    refetchQueries: [{ query: GET_PAPERS }],
    awaitRefetchQueries: true,
  });

  const createPaper = useCallback(async (data: CreatePaperData) => {
    try {
      const result = await createMutation({
        variables: { data }
      });
      return result;
    } catch (err) {
      console.error('Create paper error:', err);
      throw err;
    }
  }, [createMutation]);

  return {
    createPaper,
    loading,
    error
  };
}

export function useUpdatePaper(onSuccess?: () => void) {
  const [updateMutation, { loading, error }] = useMutation(UPDATE_PAPER, {
    onCompleted: () => {
      console.log("Paper updated successfully");
      onSuccess?.();
    },
    onError: (error: ApolloError) => {
      console.error('Paper update failed:', error.message);
    },
    awaitRefetchQueries: true,
  });

  const updatePaper = useCallback(async (documentId: string, data: PaperInput) => {
    try {
      const result = await updateMutation({
        variables: { documentId, data }
      });
      return result;
    } catch (err) {
      console.error('Update paper error:', err);
      throw err;
    }
  }, [updateMutation]);

  return {
    updatePaper,
    loading,
    error
  };
}

export function useDeletePaper(onSuccess?: () => void) {
  const router = useRouter();
  const [deleteMutation, { loading, error }] = useMutation(DELETE_PAPER, {
    onCompleted: () => {
      console.log('Paper deleted successfully');
      onSuccess?.();
      router.push('/papers');
    },
    onError: (error: ApolloError) => {
      console.error('Paper deletion failed:', error.message);
    },
    refetchQueries: [{ query: GET_PAPERS }],
    awaitRefetchQueries: true,
  });

  const deletePaper = useCallback(async (documentId: string) => {
    try {
      const result = await deleteMutation({
        variables: { documentId }
      });
      return result;
    } catch (err) {
      console.error('Delete paper error:', err);
      throw err;
    }
  }, [deleteMutation]);

  return {
    deletePaper,
    loading,
    error
  };
}

// Compound Hooks for Paper Actions
export function usePaperActions(onUpdateSuccess?: () => void, onDeleteSuccess?: () => void) {
  const { createPaper, loading: createLoading, error: createError } = useCreatePaper();
  const { updatePaper, loading: updateLoading, error: updateError } = useUpdatePaper(onUpdateSuccess);
  const { deletePaper, loading: deleteLoading, error: deleteError } = useDeletePaper(onDeleteSuccess);

  return {
    createPaper,
    updatePaper,
    deletePaper,
    loading: {
      create: createLoading,
      update: updateLoading,
      delete: deleteLoading,
    },
    error: {
      create: createError,
      update: updateError,
      delete: deleteError,
    }
  };
}

// Paper Detail Management Hook
export function usePaperDetail(documentId: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: '', content: '' });

  const paperQuery = useQuery<PaperDetailResponse, { documentId: string }>(GET_PAPER, {
    variables: { documentId },
  });
  const { updatePaper, deletePaper, loading, error } = usePaperActions(
    () => {
      setIsEditing(false);
      paperQuery.refetch();
    }
  );

  const paper = paperQuery.data?.paper;

  const startEdit = useCallback(() => {
    if (paper) {
      setEditData({
        title: paper.title,
        content: paper.content || ''
      });
      setIsEditing(true);
    }
  }, [paper]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditData({ title: '', content: '' });
  }, []);

  const saveEdit = useCallback(async () => {
    if (!documentId) return;

    try {
      await updatePaper(documentId, {
        title: editData.title,
        content: editData.content
      });
    } catch (err) {
      console.error('Failed to save edit:', err);
    }
  }, [documentId, editData, updatePaper]);

  const handleDelete = useCallback(async () => {
    if (!documentId) return;

    if (window.confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
      try {
        await deletePaper(documentId);
      } catch (err) {
        console.error('Failed to delete paper:', err);
      }
    }
  }, [documentId, deletePaper]);

  return {
    // Paper data
    paper,
    loading: paperQuery.loading,
    error: paperQuery.error,
    refetch: paperQuery.refetch,

    // Edit state
    isEditing,
    editData,
    setEditData,

    // Actions
    startEdit,
    cancelEdit,
    saveEdit,
    handleDelete,

    // Action states
    actionLoading: loading,
    actionError: error
  };
}


