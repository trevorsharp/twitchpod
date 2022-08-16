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
    resolver: zodResolver(z.object({ searchText: z.string() })),
    defaultValues: { searchText: user?.username },
  });

  useEffect(() => {
    setFocus('searchText');
  }, []);

  const onSubmit = handleSubmit((values) => {
    if (values.searchText) {
      setIsLoading(true);
      router.push(values.searchText, undefined, { scroll: false }).then(() => setIsLoading(false));
    }
  });

  return (
    <>
      <Head>
        <title>twitchPOD</title>
        <meta name="description" content="Create podcast feeds from Twitch VODs" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
      </Head>

      <main className="h-full min-h-fit bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
        <div className="flex h-full min-h-fit flex-col items-center justify-center gap-16 p-8">
          <div className="flex max-w-md flex-col items-center gap-16 text-center">
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
          <div className="flex flex-col items-center gap-12">
            <form className="flex items-center gap-4" onSubmit={onSubmit}>
              <SearchInput {...register('searchText')} />
              <button type="submit">
                <img
                  className="h-8 w-8 text-twitch"
                  src={isLoading ? '/loading.svg' : '/next.svg'}
                  alt="Submit"
                />
              </button>
            </form>

            {(user || errorMessage) && (
              <div className="flex flex-col items-center gap-6">
                {user && (
                  <>
                    <a className="flex items-center gap-4" target="_new" href={user.url}>
                      <img
                        className="h-16 w-16 rounded-full"
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
