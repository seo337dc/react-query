import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const reactQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
    // statleTime을 통해 5초동안 최신 캐시를 확인하여 중복을 제거함
    // >>>  localhost:3000/person --> getting person이 한번 호출 됨(staleTime이 없으면 전부 최신으로 인지하게 되어 호출되는 곳 마다 일일이 콘솔이 찍힘)
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
