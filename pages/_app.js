import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import GlobalStyle from "../styles";
import dayjs from "dayjs";
import "dayjs/locale/de";

dayjs.locale("de");

async function fetcher(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <GlobalStyle />
      <SessionProvider session={session}>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </SessionProvider>
    </>
  );
}
