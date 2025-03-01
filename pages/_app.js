import Head from "next/head";
import 'styles/globals.css'
import Layout from '@components/Layout'

function Application({ Component, pageProps }) {
  return (
    <>
    <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  )
}

export default Application