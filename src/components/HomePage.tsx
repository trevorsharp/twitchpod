import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { User } from '../services/twitchService';
import { Quality } from '../types';
import SearchInput from './SearchInput';
import QualitySelection from './QualitySelection';
import RssLinks from './RssLinks';

type HomePageProps = {
  user?: User;
  errorMessage?: string;
  host?: string;
};

const HomePage = ({ user, errorMessage, host }: HomePageProps) => {
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
    <div className="flex flex-col items-center justify-center gap-16 p-8 h-full min-h-fit">
      <div className="flex flex-col items-center gap-16 text-center max-w-md">
        <h1 className="text-7xl font-bold">
          Welcome to <span className="text-twitch">twitchPOD</span>
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
            <img className="w-8 h-8" src={isLoading ? '/loading.gif' : '/next.svg'} alt="Submit" />
          </button>
        </form>

        {(user || errorMessage) && (
          <div className="flex flex-col gap-6 items-center">
            {user && (
              <>
                <div className="flex gap-4 items-center">
                  <img
                    className="rounded-full w-16 h-16"
                    src={user.profileImageUrl}
                    alt="Profile"
                  />
                  <p className="text-4xl font-bold">{user.displayName}</p>
                </div>
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
  );
};

export default HomePage;
