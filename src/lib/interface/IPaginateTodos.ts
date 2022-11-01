import { ITodo } from './ITodo';

export interface IPagenatedTodos {
  todos: ITodo[];
  hasMore: boolean;
}
