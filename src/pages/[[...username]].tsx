import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import HomePage from '../components/HomePage';
import { getUserData } from '../services/twitchService';
import type { User } from '../services/twitchService';
import Head from 'next/head';

type UserPageProps = {
  user?: User;
  errorMessage?: string;
  host?: string;
};

const UserPage: NextPage<UserPageProps> = ({ user, errorMessage, host }) => (
  <>
    <Head>
      <title>twitchPOD</title>
      <meta name="description" content="Create podcast feeds from Twitch VODs" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="112x112" href="/apple-touch-icon.png" />
    </Head>

    <main className="h-full min-h-fit bg-white text-neutral-800 dark:bg-neutral-900 dark:text-white">
      <HomePage user={user} errorMessage={errorMessage} host={host} />
    </main>
  </>
);

const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context;
  const { headers } = req;
  const { host } = headers;

  const username = !Array.isArray(query.username)
    ? query.username
    : query.username.length > 0
    ? query.username[0]
    : undefined;

  if (username) {
    try {
      const user = await getUserData(username);
      return { props: { user, host } };
    } catch (errorMessage) {
      return { props: { errorMessage } };
    }
  }

  return { props: {} };
};

export default UserPage;
export { getServerSideProps };
