import { useQuery } from '@tanstack/react-query';
import type { IPerson } from '@src/lib//interface/IPerson';
import PersonComponent from '@src/components/PersonComponent';

export const fetchPerson = async (): Promise<IPerson> => {
  const res = await fetch('/api/person');

  if (res.ok) {
    return res.json();
  }

  throw new Error('Network Response not ok');
};

function index() {
  // Error : 커스텀하여 여러에러 가지고올 수 있음 (Error | 404Error | ...)
  const { status, isLoading, error, isError, data } = useQuery<IPerson, Error, IPerson>(['person'], fetchPerson);

  // if (status === 'loading')
  if (isLoading) {
    return <div>loading ...</div>;
  }

  // if (status === 'error')
  if (isError) {
    return <p>{error?.message}</p>;
  }

  return (
    <div>
      <p>{data?.age}</p>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <h1>Person Component</h1>
      <PersonComponent />
    </div>
  );
}

export default index;
