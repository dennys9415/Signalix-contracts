export interface PaginationRequest {
  limit: number;
  cursor?: string;
}

export interface PaginationResponse {
  nextCursor?: string;
  hasMore: boolean;
}
