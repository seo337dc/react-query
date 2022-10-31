import React, { useState, FormEventHandler } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { IPerson } from '@src/lib/interface/IPerson';
import { fetchPerson } from '@src/pages/person';

const createPerson = async (id: string, name: string, age: number) => {
  const res = await fetch('/api/person/create', {
    method: 'POST',
    body: JSON.stringify({
      id,
      name,
      age,
    }),
  });

  if (res.ok) return res.json();

  throw new Error('Erro create person');
};

interface ICreatePersonParams {
  id: string;
  name: string;
  age: number;
}

// 다른 것을 전달하는 용
interface IContext {
  // id: string;
  previousPerson: IPerson | undefined;
}

function Create() {
  const [enabled, setEnabled] = useState(false); //쿼리 실행 할지 결정
  const { data: queryData } = useQuery<IPerson, Error>(['person'], fetchPerson, { enabled });

  const queryClient = useQueryClient();
  const mutaion = useMutation<IPerson, Error, ICreatePersonParams, IContext | undefined>(
    async ({ id, name, age }) => createPerson(id, name, age),
    {
      // befor IContext
      onMutate: async (_variables: ICreatePersonParams) => {
        await queryClient.cancelQueries(['person']); // 기존 실행 취소

        // console.log('mutation variable', variables);
        // return { id: '7' };
        const previousPerson: IPerson | undefined = queryClient.getQueryData(['person']); // 기존 데이터는 캐싱에서 가지고 옴

        const newTodo: IPerson = {
          id: '123',
          age: 200,
          name: 'Lebron James',
        };

        queryClient.setQueryData(['person'], newTodo); // 새로운 파라메터로 따로 실행

        return { previousPerson };
      },
      onSuccess: (data: IPerson, _variables: ICreatePersonParams, _context: IContext | undefined) => {
        queryClient.invalidateQueries(['person']);
        // queryClient.invalidateQueries(['person', dat]); // 성공 후, 쿼리 재실행
        return console.log('mutation data', data);
      },

      onError: (error: Error, _variables: ICreatePersonParams, context: IContext | undefined) => {
        console.log('error: ', error.message);
        queryClient.setQueryData(['person'], context?.previousPerson);
        return console.log('rolling back optimistic update with id : ', context?.previousPerson?.id);
      },

      // on matter if error or success run me
      onSettled: (
        _data: IPerson | undefined,
        _error: Error | null,
        _variables: ICreatePersonParams | undefined,
        _context: IContext | undefined
      ) => {
        return console.log('complate mutation');
      },
    }
  );

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const target = e.target as typeof e.target & { name: { value: string }; age: { value: number } };
    const id = '1';
    const name = target.name.value;
    const age = target.age.value;
    mutaion.mutate({ id, name, age });
  };
  return (
    <>
      {mutaion.isLoading ? (
        <p>Adding todo</p>
      ) : (
        <>
          {mutaion.isError ? <div>An error occurred : {mutaion?.error?.message}</div> : null}
          {mutaion.isSuccess ? (
            <div>
              Todo added! Person name is {mutaion?.data?.name} and he is {mutaion?.data?.age}
            </div>
          ) : null}
        </>
      )}

      <button
        type="button"
        onClick={() => {
          setEnabled(!enabled);
          queryClient.invalidateQueries(['person']); // 쿼리 재실행하도록
        }}
      >
        Invalidate Cache
      </button>

      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name:</label>
        <br />
        <input type="text" id="name" name="name" />
        <br />

        <label htmlFor="age">Age:</label>
        <br />
        <input type="number" id="age" name="age" />

        <br />
        <br />
        <input type="submit" value="submit" />
      </form>

      {queryData && (
        <div>
          <p>Person is</p>
          <p>{queryData?.name}</p>
          <p>{queryData?.age}</p>
        </div>
      )}
    </>
  );
}

export default Create;
