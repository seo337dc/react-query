import { GetServerSideProps } from 'next';
import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { IPerson } from '@src/lib/interface/IPerson';
import { fetchPerson } from '@src/pages/person';

interface InitialDataExamplePageProps {
  person: IPerson;
}

function InitialDataExamplePage({ person }: InitialDataExamplePageProps) {
  const { isLoading, isError, error, data }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>(
    ['person'],
    fetchPerson,
    { initialData: person } // 서버사이드에서 초기 실행할 때, 데이터를 넣음
  );

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

export const getServerSideProps: GetServerSideProps = async (): Promise<{ props: { person: IPerson } }> => {
  // const person = await fetchPerson(); // url이 아니므로 에러

  const person = await fetch('http://localhost:3000/api/person').then((res) => res.json());
  return { props: { person } };
};
export default InitialDataExamplePage;
