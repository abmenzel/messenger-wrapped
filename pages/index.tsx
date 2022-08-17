import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Messenger Wrapped</title>
        <meta name="description" content="Messenger Wrapped" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen h-full bg-theme-primary">
        <h1 className="big-title text-center">Messenger Wrapped</h1>
        <Link href="/pick">
          <a className="btn-primary my-6">Get started</a>
        </Link>
      </div>
    </div>
  )
}

export default Home
