// Client
export interface ClientOptions {
  endpoint: string;
  secret?: string;
  debug?: boolean;
}

// API
export interface Success {
  RowAffected: number;
}

export type DateTime = Date | string;

export interface LatestOutput {
  Id: string;
  Score: number;
}

export interface PopularOutput {
  Id: string;
  Score: number;
}

export interface PopularOptions {
  category?: string;
  cursorOptions?: OffsetCursorOptions;
}

export interface RecommendOptions {
  userId: string;
  category?: string;
  writeBackType?: string;
  writeBackDelay?: string;
  cursorOptions?: OffsetCursorOptions;
}

export interface ItemNeighborsOptions {
  itemId: string;
  category?: string;
  cursorOptions?: OffsetCursorOptions;
}

export interface UserNeighborsOptions {
  userId: string;
  cursorOptions?: OffsetCursorOptions;
}

export interface FeedbackFilter<T> {
  type: T;
  userId: string;
  itemId: string;
}

export interface FeedbackTypeFilter<T> {
  type: T;
  cursorOptions?: CursorOptions;
}

export interface FeedbackOptions<T> extends FeedbackFilter<T> {
  cursorOptions?: CursorOptions;
}

// Entities
export interface User {
  UserId: string;
  Comment?: string;
  Labels?: string[];
}

export interface Item {
  ItemId: string;
  Comment?: string;
  IsHidden: boolean;
  Timestamp: DateTime;
  Categories?: string[];
  Labels?: string[];
}

export interface Feedback<K extends string> {
  FeedbackType: K;
  UserId: string;
  ItemId: string;
  Timestamp: DateTime;
}

// Cursors

export interface BasicCursorOptions {
  n?: number;
}

export interface OffsetCursorOptions extends BasicCursorOptions {
  offset?: number;
}

export interface CursorOptions extends BasicCursorOptions {
  Cursor?: string;
}

export interface ItemCursor {
  Cursor: string;
  Items: Item[];
}

export interface UserCursor {
  Cursor: string;
  Users: User[];
}

export interface FeedbackCursor<K extends string> {
  Cursor: string;
  Feedbacks: Feedback<K>[];
}
