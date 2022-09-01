import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.description}>
          <p >
            Task nr 1 
          </p>
          <p>Create input  where you will write the random name of the country and  return you will show the weather for that country's capital
            e.g, I will write : Poland
            I should get Warsaw and the weather  information for the capital.</p>
        </div>





      </main>


    </div>
  )
}
