import '@/styles/globals.css'
import '@/styles/navbar.css'
import '@/styles/Home.module.css'
import type { AppProps } from 'next/app'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from "next-auth/react"
import 'tailwindcss/tailwind.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function App({ Component, pageProps: {session, ...pageProps } }: AppProps) {
  return(
  <>
  <SessionProvider session={session}>
  <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
  />
      <Component {...pageProps} />
    </SessionProvider>
  </>
  ) 
}
