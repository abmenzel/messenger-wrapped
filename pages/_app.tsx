import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { InterfaceProvider } from '../context/interface'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <InterfaceProvider>
      <Component {...pageProps} />
    </InterfaceProvider>
  )
}

export default MyApp
