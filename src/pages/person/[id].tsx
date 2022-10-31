import { useRouter } from 'next/dist/client/router';
import { useQuery } from '@tanstack/react-query';
import { IPerson } from '@src/lib/interface/IPerson';

async function getPersonById(id: string | string[] | undefined): Promise<IPerson> {
  if (typeof id === 'string') {
    const res = await fetch(`/api/person/${id}`);

    if (res.ok) return res.json();
    throw new Error('error fetching user with id');
  }
  throw new Error(`Invalid id`);
}

function PersonPage() {
  const {
    query: { id },
  } = useRouter();

  const { isLoading, isError, error, data } = useQuery<IPerson, Error>(['person', id], () => getPersonById(id), {
    enabled: !!id,
  });
  return (
    <div>
      <p>{data?.age}</p>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </div>
  );
}

export default PersonPage;
