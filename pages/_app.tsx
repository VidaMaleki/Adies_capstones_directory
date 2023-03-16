import '@/styles/globals.css'
import '@/styles/navbar.css'
import '@/styles/Home.module.css'
import type { AppProps } from 'next/app'
import { BrowserRouter } from 'react-router-dom'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
