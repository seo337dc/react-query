import { useState } from 'react';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, Hydrate } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// const reactQueryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 20 * 1000,
//     },
//     // statleTime을 통해 5초동안 최신 캐시를 확인하여 중복을 제거함
//     // >>>  localhost:3000/person --> getting person이 한번 호출 됨(staleTime이 없으면 전부 최신으로 인지하게 되어 호출되는 곳 마다 일일이 콘솔이 찍힘)
//     // 즉 같은 쿼리키를 사용하는 경우, 해당 쿼리키를 사용하는 관찰자들이 있다.
//   },
// });

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 20 * 1000,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      {/* getServerSideProps에서 react-query에서 사용하는 fetch */}
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
