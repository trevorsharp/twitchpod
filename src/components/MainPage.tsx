import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SearchInput from './SearchInput';
import QualitySelection from './QualitySelection';
import RssLinks from './RssLinks';
import { Quality, User } from '../types';

type MainPageProps = {
  user?: User;
  errorMessage?: string;
  host?: string;
};

const MainPage = ({ user, errorMessage, host }: MainPageProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qualitySelection, setQualitySelection] = useState<Quality>(Quality.Maximum);

  const { register, handleSubmit, setFocus } = useForm({
    resolver: zodResolver(z.object({ username: z.string() })),
    defaultValues: { username: user?.username },
  });

  useEffect(() => {
    setFocus('username');
  }, []);

  const onSubmit = handleSubmit((values) => {
    if (values.username) {
      setIsLoading(true);
      router.push(values.username, undefined, { scroll: false }).then(() => setIsLoading(false));
    }
  });

  return (
    <>
      <Head>
        <title>twitchPOD</title>
        <meta name="description" content="Create podcast feeds from Twitch VODs" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
      </Head>

      <main className="h-full min-h-fit bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
        <div className="flex flex-col items-center justify-center gap-16 p-8 h-full min-h-fit">
          <div className="flex flex-col items-center gap-16 text-center max-w-md">
            <h1 className="text-7xl font-bold">
              Welcome to{' '}
              <span className="text-twitch">
                <Link href="/">twitchPOD</Link>
              </span>
            </h1>
            <p className="text-2xl">
              <span className="inline-block">Generate podcast feeds for your&nbsp;</span>
              <span className="inline-block">
                favorite <span className="text-twitch">Twitch</span> streamers
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-12 items-center transition duration-200">
            <form className="flex gap-4 items-center" onSubmit={onSubmit}>
              <SearchInput {...register('username')} />
              <button type="submit">
                <img
                  className="w-8 h-8"
                  src={isLoading ? '/loading.gif' : '/next.svg'}
                  alt="Submit"
                />
              </button>
            </form>

            {(user || errorMessage) && (
              <div className="flex flex-col gap-6 items-center">
                {user && (
                  <>
                    <a
                      className="flex gap-4 items-center"
                      target="_new"
                      href={`https://twitch.tv/${user.username}`}
                    >
                      <img
                        className="rounded-full w-16 h-16"
                        src={user.profileImageUrl}
                        alt="Profile"
                      />
                      <p className="text-4xl font-bold">{user.displayName}</p>
                    </a>
                    <QualitySelection selection={qualitySelection} onSelect={setQualitySelection} />
                    <RssLinks
                      host={host ?? window.location.host}
                      username={user.username}
                      quality={qualitySelection}
                    />
                  </>
                )}
                {errorMessage && <p>{errorMessage}</p>}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default MainPage;
export type { MainPageProps };
