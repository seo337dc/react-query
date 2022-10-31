import Link from 'next/link';
import { useState } from 'react';
import { useQueryClient, useQuery, useQueries } from '@tanstack/react-query';
import type { IPerson } from '@src/lib//interface/IPerson';
import type { ITodo } from '@src/lib/interface/ITodo';
import PersonComponent from '@src/components/PersonComponent';

export const fetchPerson = async (): Promise<IPerson> => {
  const res = await fetch('/api/person');

  if (res.ok) return res.json();
  throw new Error('Network Response not ok');
};

export const fetchTodo = async (): Promise<ITodo> => {
  const res = await fetch('/api/todo');

  if (res.ok) return res.json();
  throw new Error('Network Response not ok');
};

function index() {
  const [enabled, setEnabled] = useState(true);
  // Error : 커스텀하여 여러에러 가지고올 수 있음 (Error | 404Error | ...)
  const {
    status,
    isLoading,
    isSuccess: personSuccess,
    error,
    isError,
    data,
  } = useQuery<IPerson, Error, IPerson>(['person'], fetchPerson, {
    enabled,
  });
  const { isSuccess: todoSuccess, data: todoData } = useQuery<ITodo, Error>(['todo'], fetchTodo, { enabled });

  const queryClient = useQueryClient();
  const userQueries = useQueries({
    queries: [1, 2, 3].map((id) => {
      return {
        queryKey: ['todo', id],
        queryFn: () => {
          return id;
        },
        // enabled,
      };
    }),
  });

  if (personSuccess && todoSuccess && enabled) {
    setEnabled(false);
  }

  // if (status === 'loading')
  if (isLoading) return <div>loading ...</div>;

  // if (status === 'error')
  if (isError) return <p>{error?.message}</p>;

  console.log('data', data);
  console.log('todoData', todoData);
  return (
    <div>
      <Link href="/">Home</Link>

      <br />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries();
          // 쿼리 검증 + 쿼리 무효화
          // 인자 없이 쿼리를 검증하는 경우, 모든 새로운 쿼리가 부실한지 확인??
        }}
      >
        Invalidate Queries
      </button>
      <br />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries(['person']); // 해당만 무효화?? 이해 못함 다시 하자
        }}
      >
        Invalidate Person
      </button>
      <br />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          // queryClient.invalidateQueries(['todo']); // 해당만 무효화
          // queryClient.invalidateQueries(['todo', '1'], { exact: true }); // 특정 키를 무효화

          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'todos',

            // 버전 달라서 아래 동작 안되!
            // predicate: (query) => {
            //   return parseInt(query.queryKey[1].page) % 2 === 1;
            // },
          });
        }}
      >
        Invalidate Todo
      </button>
      <br />

      <p>{data?.age}</p>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <h1>Person Component</h1>
      <PersonComponent />
    </div>
  );
}

export default index;
