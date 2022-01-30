import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const topStreamers = [
    'xQcOW',
    'HasanAbi',
    'GeorgeNotFound',
    'Mizkif',
    'tommyinnit',
    'shroud',
    'Sykkuno',
    'DisguisedToast',
    'pokimane',
    'Amouranth',
    'dakotaz',
    'GMHikaru',
  ].map((s) => s.toLowerCase());

  const animatePlaceholderText = () => {
    const streamerList = topStreamers.sort(() => 0.5 - Math.random());
    let timeout = 0;
    streamerList.forEach((streamer) => {
      streamer.split('').forEach((_, i) => {
        setTimeout(() => setInputPlaceholder(streamer.substring(0, i + 1)), timeout);
        timeout += 200;
      });
      timeout += 2000;
    });
    setTimeout(() => animatePlaceholderText(), timeout);
  };

  useEffect(animatePlaceholderText, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(usernameInput);
    setIsLoading(true);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>twitchPOD</title>
        <meta name="description" content="Create podcast feeds from Twitch VODs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.purple}>twitchPOD</span>
        </h1>

        <p className={styles.description}>
          Get started by entering a <span className={styles.purple}>Twitch</span> username
        </p>

        <form className={styles.formContainer} onSubmit={(e) => onSubmit(e)}>
          <input
            className={styles.field}
            type="text"
            placeholder={inputPlaceholder}
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
          />
          <button className={styles.button} type="submit">
            <Image
              src={isLoading ? '/loading.gif' : '/next.svg'}
              alt="Vercel Logo"
              width={35}
              height={35}
            />
          </button>
        </form>
      </main>

      <footer className={styles.footer}>
        <a href="https://trvr.sh" target="_blank" rel="noopener noreferrer">
          Created by&nbsp;<span className={styles.purple}>Trevor Sharp</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
