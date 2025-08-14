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

export interface CreatePaperData {
  title: string;
  content?: string;
}

export interface UpdatePaperData {
  documentId: string;
  data: PaperInput;
}

export function usePapersQuery() {
  return useQuery<PapersResponse>(GET_PAPERS, {
    errorPolicy: 'all',
  });
}

export function usePaperQuery(documentId: string) {
  return useQuery<PaperDetailResponse, { documentId: string }>(GET_PAPER, {
    variables: { documentId },
    skip: !documentId,
    errorPolicy: 'all',
  });
}

export function useCreatePaperMutation() {
  const router = useRouter();

  return useMutation(CREATE_PAPER, {
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
}

export function useUpdatePaperMutation(onSuccess?: () => void) {
  return useMutation(UPDATE_PAPER, {
    onCompleted: () => {
      console.log("Paper updated")
      onSuccess?.();
    },
    onError: (error: ApolloError) => {
      console.error('Paper update failed:', error.message);
    },
    awaitRefetchQueries: true,
  });
}

export function useDeletePaperMutation(onSuccess?: () => void) {
  const router = useRouter();

  return useMutation(DELETE_PAPER, {
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
}

