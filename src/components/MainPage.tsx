/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SearchInput from './SearchInput';
import QualitySelection from './QualitySelection';
import RssLinks from './RssLinks';
import { Quality } from '~/types';
import { api } from '~/utils/api';

const MainPage = () => {
  const router = useRouter();
  const [qualitySelection, setQualitySelection] = useState<Quality>(Quality.Maximum);

  const searchText = router.asPath.replace('/', '').replace('[searchText]', '');

  const user = api.user.getUserData.useQuery(
    { username: searchText },
    { enabled: !!searchText, retry: false }
  );

  const { register, handleSubmit, setFocus, setValue } = useForm({
    resolver: zodResolver(z.object({ searchText: z.string() })),
    defaultValues: { searchText },
  });

  useEffect(() => setFocus('searchText'), []);
  useEffect(() => setValue('searchText', searchText), [searchText]);

  const onSubmit = handleSubmit(async (values) => {
    if (values.searchText) await router.push(values.searchText, undefined, { scroll: false });
  });

  return (
    <>
      <Head>
        <title>twitchPOD</title>
      </Head>
      <div className="flex h-full min-h-fit flex-col items-center justify-center gap-16 p-8 text-center">
        <h1 className="flex flex-col text-7xl font-bold">
          <span>Welcome to</span>
          <span className="text-twitch">
            <Link href="/">twitchPOD</Link>
          </span>
        </h1>
        <p className="flex flex-col text-2xl">
          <span>Generate podcast feeds for your</span>
          <span>
            favorite <span className="text-twitch">Twitch</span> streamers
          </span>
        </p>
        <form className="flex items-center gap-4" onSubmit={onSubmit}>
          <SearchInput {...register('searchText')} />
          <button type="submit">
            <img
              className="h-8 w-8 text-twitch"
              src={searchText && user.isLoading ? '/loading.svg' : '/next.svg'}
              alt="Submit"
            />
          </button>
        </form>
        {user.data && (
          <div className="flex flex-col items-center gap-6">
            <a className="flex items-center gap-4" target="_new" href={user.data.url}>
              <img
                className="h-16 w-16 rounded-full"
                src={user.data.profileImageUrl}
                alt="Profile"
              />
              <p className="text-4xl font-bold">{user.data.displayName}</p>
            </a>
            <QualitySelection selection={qualitySelection} onSelect={setQualitySelection} />
            <RssLinks username={user.data.username} quality={qualitySelection} />
          </div>
        )}
        {user.error && <p>{user.error.message}</p>}
      </div>
    </>
  );
};

export default MainPage;
