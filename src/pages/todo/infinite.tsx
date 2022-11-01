import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import type { IInfinatePage } from '@src/lib/interface/IInfinatePage';
import React from 'react';

const fetchTodos = ({ pageParam = 0 }: QueryFunctionContext) =>
  fetch(`/api/todo/infinite/${pageParam}`).then((res) => res.json());

function PaginatedTodoPage() {
  // 무한 스크롤
  const { data, hasNextPage, fetchNextPage, hasPreviousPage, isFetchingNextPage } = useInfiniteQuery<
    IInfinatePage,
    Error
  >(['infinite'], fetchTodos, {
    getNextPageParam: (lastPage) => lastPage.nextCursor, // <-- hasNextPage
    getPreviousPageParam: (firstPage) => firstPage.nextCursor, // <-- hasPreviousPage
  });

  return (
    <>
      {data?.pages.map((infinitePage, i) => {
        return (
          <React.Fragment key={i}>
            {infinitePage.page.todos.map((todo) => (
              <p key={todo.id}>{todo.message}</p>
            ))}
          </React.Fragment>
        );
      })}

      <button type="button" onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more ...' : hasNextPage ? 'Load More' : 'Nothing more to load'}
      </button>
    </>
  );
}

export default PaginatedTodoPage;
