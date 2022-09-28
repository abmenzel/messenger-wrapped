import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Layout from '../components/Layout/Layout'
import { InterfaceProvider } from '../context/interface'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Messenger Wrapped</title>
        <meta name="description" content="Messenger Wrapped" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-col items-center">
          <h1 className="big-title text-center">Messenger Wrapped</h1>
          <Link href="/wrap">
            <a className="btn-primary my-6">Get started</a>
          </Link>
        </div>
      </Layout>
    </>
  )
}

export default Home
