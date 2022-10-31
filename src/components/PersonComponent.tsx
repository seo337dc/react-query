import { useQuery } from '@tanstack/react-query';
import { fetchPerson } from '@src/pages/person';
import type { IPerson } from '@src/lib/interface/IPerson';

function PersonComponent() {
  const { data } = useQuery<IPerson, Error>(['person'], fetchPerson);
  return (
    <div>
      <p>{data?.age}</p>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </div>
  );
}

export default PersonComponent;
