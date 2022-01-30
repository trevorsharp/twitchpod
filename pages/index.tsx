import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { User } from '../services/twitchService';

const Home: NextPage = () => {
  const [inputPlaceholder, setInputPlaceholder] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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
  ];

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
    if (usernameInput !== '') {
      setIsLoading(true);
      fetch(`/api/user/${usernameInput}`)
        .then(async (response) => {
          if (response.status !== 200) throw await response.text();
          return response.json();
        })
        .then((data) => {
          setUser(data);
          setErrorMessage(undefined);
        })
        .catch((error: string) => {
          setUser(undefined);
          setErrorMessage(error);
        })
        .finally(() => setIsLoading(false));
    }
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
          Generate podcast feeds for your <br />
          favorite <span className={styles.purple}>Twitch</span> streamers
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
              layout="fixed"
            />
          </button>
        </form>

        {user && (
          <div className={styles.userContainer}>
            <Image
              className={styles.userImage}
              src={user.profileImageUrl}
              alt="Profile"
              width={50}
              height={50}
              layout="fixed"
            />
            <p className={styles.userTitle}>{user.displayName}</p>
            <div className={styles.podcastIconContainer}>
              <a href={`podcast://${window.location.host}/${user.username}`}>
                <Image
                  src="/applepodcasts.svg"
                  alt="apple podcasts"
                  height={40}
                  width={40}
                  layout="fixed"
                />
              </a>
              <a href={`pktc://subscribe/${window.location.host}/${user.username}`}>
                <Image
                  className={styles.clickable}
                  src="/pocketcasts.svg"
                  alt="pocket casts"
                  height={40}
                  width={40}
                  layout="fixed"
                  onClick={() => {}}
                />
              </a>
              <a href={`/${user.username}`}>
                <Image
                  className={styles.clickable}
                  src="/rss.svg"
                  alt="rss"
                  height={40}
                  width={40}
                  layout="fixed"
                  onClick={() => {}}
                />
              </a>
            </div>
          </div>
        )}

        {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
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
