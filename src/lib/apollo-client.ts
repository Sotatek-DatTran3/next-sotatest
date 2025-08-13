import { getJWTFromCookie } from "@/utils/JWT";
import { ApolloClient, InMemoryCache, createHttpLink, from, gql } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL;

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = getJWTFromCookie();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    if ('statusCode' in networkError && networkError.statusCode === 401) {
      if (typeof window !== 'undefined') {
        document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = '/auth';
      }
    }
  }
});

export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          papers: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export const GET_PAPERS = gql`
  query Papers_connection {
    papers_connection {
      nodes {
        content
        createdAt
        documentId
        publishedAt
        title
        updatedAt
      }
      pageInfo {
        page
        pageCount
        pageSize
        total
      }
    }
  }
`;

export const GET_PAPER = gql`
  query Paper($documentId: ID!) {
    paper(documentId: $documentId) {
      author {
        username
      }
      content
      createdAt
      documentId
      publishedAt
      title
      updatedAt
    }
  }
`;

export const GET_PAPERS_BY_CATEGORY = gql`
  query GetPapersByCategory($category: String!, $pagination: PaginationArg) {
    papers(
      filters: { category: { eq: $category } }
      pagination: $pagination
      sort: ["publishedDate:desc"]
    ) {
      data {
        id
        attributes {
          title
          abstract
          authors
          publishedDate
          doi
          keywords
          status
          category
          fileUrl
          thumbnailUrl
          createdAt
          updatedAt
        }
      }
      meta {
        pagination {
          page
          pageSize
          pageCount
          total
        }
      }
    }
  }
`;

export const CREATE_PAPER = gql`
  mutation CreatePaper($data: PaperInput!) {
    createPaper(data: $data) {
      data {
        id
        attributes {
          title
          abstract
          authors
          publishedDate
          doi
          keywords
          status
          category
          fileUrl
          thumbnailUrl
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const UPDATE_PAPER = gql`
  mutation UpdatePaper($documentId: ID!, $data: PaperInput!) {
    updatePaper(documentId: $documentId, data: $data) {
      documentId
      title
      content
      publishedAt
      createdAt
      updatedAt
      author {
        username
      }
    }
  }
`;

export const DELETE_PAPER = gql`
  mutation DeletePaper($documentId: ID!) {
    deletePaper(documentId: $documentId) {
      documentId
    }
  }
`;

export interface Paper {
  id: string;
  documentId: string
  title: string;
  publishedAt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaperInput {
  title?: string;
  content?: string;
}

export interface PaperDetailResponse {
  paper: {
    documentId: string;
    title: string;
    content: string;
    publishedAt: string;
    createdAt: string;
    updatedAt: string;
    author: {
      username: string;
    };
  };
}

export interface PapersResponse {
  papers_connection: {
    nodes: Paper[];
    pageInfo: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface PaginationArg {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
}