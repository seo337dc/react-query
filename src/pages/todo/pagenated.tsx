import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IPagenatedTodos } from '@src/lib/interface/IPaginateTodos';
import { ITodo } from '@src/lib/interface/ITodo';

function Pagenated() {
  const [page, setPage] = useState(0);

  const fetchTodos = (pageNumber = 0) => fetch(`/api/todo/${pageNumber}`).then((res) => res.json());

  const queryClient = useQueryClient();

  const { isLoading, data, isFetching, isPreviousData } = useQuery<IPagenatedTodos, Error>(
    ['todos', page], // key is ['todos', pageNumber]
    () => fetchTodos(page), // function is call fetchTodos with state page
    { keepPreviousData: true } // keepPreviousData adds cool stuff [이전 데이터를 유지할 것]
    // keepPreviouData, isPreviousData
  );

  /*
   미리데이터를 가지고 오는 것
   staleTime 20초 지정(query option)을 했으므로 20초 후에야 클릭 하면 api가 실행 된다. 그래서 api 호출이 안됨.
   미리 데이터를 가지고 와서 캐싱을 줄이는 것, 캐싱을 줄이는 것
   실시간 검색에 유용할듯...
  */

  // Prefetch the next 2 pages on every page load!
  useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery(['todos', page + 1], () => fetchTodos(page + 1));
      queryClient.prefetchQuery(['todos', page + 2], () => fetchTodos(page + 2));
    }
  }, [data, page, queryClient]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {data?.todos.map((todo) => (
        <p key={todo.id}>{todo.message}</p>
      ))}
      <span>Current Page: {page + 1}</span>
      <br />
      <button
        type="button"
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page === 0}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPreviousData && data?.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Fetch Loading...</span> : null}{' '}
    </>
  );
}

export default Pagenated;
