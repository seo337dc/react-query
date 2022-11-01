import { GetServerSideProps } from 'next';
import { useQuery, dehydrate, DehydratedState, QueryClient, UseQueryResult } from '@tanstack/react-query';
import { fetchPerson } from '@src/pages/person';
import { IPerson } from '@src/lib/interface/IPerson';

// 이미 캐시에 이미 올려놓았므로 컴포넌트에 굳이 props로 받을 필요가 없다.
// 초기 데이터를 전달하기 위해 더이상 props가 필요 없다는 것

// 호출하는 동일한 쿼리가 여러개 있을 경우, 실제로 한개만 실행된다!라는 의미????
// 동일한 쿼리 캐시 데이터를 사용하기 때문!!!!
function HydrationExamplePage() {
  const { isLoading, isError, error, data } = useQuery<IPerson, Error>(['person'], fetchPerson);

  // const result: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>(['person'], fetchPerson);

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  if (isError) return <p>Boom boy: Error is -- {error?.message}</p>;

  return (
    <>
      <h1>Person</h1>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: { dehydratedState: DehydratedState };
}> => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['person'], fetchPerson);
  // 초기 실행을 위해서 pre-fetch
  // 즉, 이미 캐시에 이미 올려놓았다는 것
  return { props: { dehydratedState: dehydrate(queryClient) } };
};

export default HydrationExamplePage;
