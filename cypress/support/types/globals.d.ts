import { JSONPlaceholderEndpoints } from '@constants/globals';

declare type BaseEntity = {
  id?: number;
};

declare type Endpoint = keyof typeof JSONPlaceholderEndpoints;

declare type QueryMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare type ApiRepo = 'JSON_PLACEHOLDER';

declare type Query = {
  method: QueryMethod;
  repo: ApiRepo;
  endpoint?: string;
  body?: string;
};

declare type Post = BaseEntity & {
  title: string;
  body: string;
  userId: number;
};
