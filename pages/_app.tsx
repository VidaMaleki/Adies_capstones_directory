import '@/styles/globals.css'
import '@/styles/navbar.css'
import '@/styles/Home.module.css'
import type { AppProps } from 'next/app'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: {session, ...pageProps } }: AppProps) {
  return(
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  ) 
}
