/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { User } from '../services/twitchService';
import { Quality } from '../utilities/types';

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

const Home: NextPage = () => {
  const router = useRouter();

  const [inputPlaceholder, setInputPlaceholder] = useState<string>('');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [qualitySelection, setQualitySelection] = useState<Quality>(Quality.Maximum);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [copiedText, setCopiedText] = useState<string | undefined>(undefined);
  const [didShowResults, setDidShowResults] = useState<boolean>(false);

  const input = useRef<HTMLInputElement | null>(null);

  const onSubmit = (customValue: string | undefined = undefined) => {
    const username = customValue ?? usernameInput;

    if (username !== '') {
      setIsLoading(true);
      setUser(undefined);
      setErrorMessage(undefined);

      fetch(`/api/user/${username}`)
        .then(async (response) => {
          if (response.status !== 200) throw await response.text();
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error: string) => setErrorMessage(error))
        .finally(() => {
          setIsLoading(false);
          setDidShowResults(true);
        });
    }
  };

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

  const handleInitialParameter = () => {
    const username =
      router.query.username &&
      typeof router.query.username !== 'string' &&
      router.query.username.length > 0
        ? router.query.username[0]
        : '';

    setUsernameInput(username);
    onSubmit(username);
    input.current?.focus();
  };

  const prefetchAssets = () => {
    setTimeout(() => {
      fetch('/loading.gif');
      fetch('/placeholder.webp');
    }, 2000);
  };

  useEffect(animatePlaceholderText, []);
  useEffect(handleInitialParameter, [router.query]);
  useEffect(prefetchAssets, []);

  const getRssLink = () =>
    `${window.location.host}/api/${user?.username}?quality=${qualitySelection}`;

  const copyRssLink = () => {
    navigator.clipboard.writeText(`http://${getRssLink()}`);
    setCopiedText('Copied link to RSS feed 🎉');
    setTimeout(() => setCopiedText(undefined), 2000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>twitchPOD</title>
        <meta name="description" content="Create podcast feeds from Twitch VODs" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.purple}>twitchPOD</span>
        </h1>

        <p className={styles.description}>
          <span className={styles.line}>Generate podcast feeds for your&nbsp;</span>
          <span className={styles.line}>
            favorite <span className={styles.purple}>Twitch</span> streamers
          </span>
        </p>

        <form
          className={styles.formContainer}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <input
            ref={input}
            className={styles.field}
            type="text"
            placeholder={inputPlaceholder}
            onChange={(e) => setUsernameInput(e.target.value)}
            value={usernameInput}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          <button className={styles.button} type="submit">
            <Image
              src={isLoading ? '/loading.gif' : '/next.svg'}
              alt="Next"
              width={35}
              height={35}
              layout="fixed"
            />
          </button>
        </form>

        <div className={`${styles.resultContainer} ${didShowResults ? styles.fixedHeight : ''}`}>
          {user && (
            <>
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
              </div>
              <div className={styles.qualityContainer}>
                <label className={styles.clickable}>
                  <input
                    type="radio"
                    id="Maximum"
                    name="quality"
                    value={Quality.Maximum}
                    checked={qualitySelection === Quality.Maximum}
                    onClick={() => setQualitySelection(Quality.Maximum)}
                  />
                  <span>Best Video</span>
                </label>
                <label className={styles.clickable}>
                  <input
                    type="radio"
                    id="720p"
                    name="quality"
                    value={Quality.P720}
                    checked={qualitySelection === Quality.P720}
                    onClick={() => setQualitySelection(Quality.P720)}
                  />
                  <span>720p</span>
                </label>
                <label className={styles.clickable}>
                  <input
                    type="radio"
                    id="480p"
                    name="quality"
                    value={Quality.P480}
                    checked={qualitySelection === Quality.P480}
                    onClick={() => setQualitySelection(Quality.P480)}
                  />
                  <span>480p</span>
                </label>
                <label className={styles.clickable}>
                  <input
                    type="radio"
                    id="Audio"
                    name="quality"
                    value={Quality.Audio}
                    checked={qualitySelection === Quality.Audio}
                    onClick={() => setQualitySelection(Quality.Audio)}
                  />
                  <span>Audio Only</span>
                </label>
              </div>
              <div className={styles.podcastIconContainer}>
                <a href={`podcast://${getRssLink()}`}>
                  <Image
                    src="/applepodcasts.svg"
                    alt="apple podcasts"
                    height={40}
                    width={40}
                    layout="fixed"
                  />
                </a>
                <a href={`pktc://subscribe/${getRssLink()}`}>
                  <Image
                    src="/pocketcasts.svg"
                    alt="pocket casts"
                    height={40}
                    width={40}
                    layout="fixed"
                  />
                </a>
                <Image
                  className={styles.clickable}
                  src="/rss.svg"
                  alt="rss"
                  height={40}
                  width={40}
                  layout="fixed"
                  onClick={copyRssLink}
                />
              </div>
              {copiedText && <p className={styles.copiedText}>{copiedText}</p>}
            </>
          )}
          {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
        </div>
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
