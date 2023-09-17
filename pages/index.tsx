import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { SearchDialog } from '@/components/SearchDialog'
import { PasswordForm } from '@/components/PasswordForm'
import Image from 'next/image'
import Link from 'next/link'
import {useState} from 'react'
import {sha512} from 'js-sha512'
import {test} from '@/lib/solar-estimator/test'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  console.log(process.env.TEST_KEY);
  test();
  const MainContent = () => (
    <main className={styles.main}>
      <div className={styles.center}>
        <SearchDialog />
      </div>

      <div className="py-8 w-full flex items-center justify-center space-x-6">
        <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
          <Link href="https://www.tech.gov.sg/capability-centre-dsaid/" className="flex items-center justify-center">
            <p className="text-base mr-2">© 2023 Data Science and Artificial Intelligence Division, GovTech</p>
            <Image src={'/dsaid.svg'} width="60" height="26" alt="DSAID logo" />
          </Link>
        </div>
      </div>
    </main>
  );
  
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const password = "31ef787487d5681cbf2e99e2da18144c261968baffb7e698e0519411639fc68053cbc0832a376c453e6ff2c1857c416098063d847118000ba544b092eaf580dc"; // Replace with your desired password
    const enteredPassword = event.target.passwordInput.value;
    const sha512Password = sha512(enteredPassword);

    if (sha512Password === password) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
    }
  };
  
  return (
    <>
      <Head>
        <title>Ask Jamie SUN - EMA Document-Grounded Generation & Search</title>
        <meta
          name="description"
          content="This RAG Search runs on Next.js, Supabase, GPT-3, and a lotta coffee ☕."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {authenticated ? <MainContent /> : <PasswordForm onSubmit={handleSubmit} />}
      </div>
    </>
  )
}
