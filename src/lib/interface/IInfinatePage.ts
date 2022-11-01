import { ITodo } from './ITodo';

export interface IInfinatePage {
  nextCursor: number | undefined;
  page: {
    todos: ITodo[];
    hasMore: boolean;
  };
}
