import type { GetServerSideProps } from 'next/types';
import MainPage from '../components/MainPage';
import type { MainPageProps } from '../components/MainPage';
import { getUserData } from '../services/twitchService';

const UserPage = ({ user, host, errorMessage }: MainPageProps) => (
  <MainPage user={user} host={host} errorMessage={errorMessage} />
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

  return { redirect: { destination: '/', permanent: false } };
};

export default UserPage;
export { getServerSideProps };
