import type { GetServerSideProps } from 'next/types';
import MainPage from '../components/MainPage';
import type { MainPageProps } from '../components/MainPage';
import { getUserData } from '../services/twitchService';

const UserPage = (props: MainPageProps) => <MainPage {...props} />;

const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req, res } = context;
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
      res.setHeader('Cache-Control', 's-maxage=86400');
      return { props: { user, host, username } };
    } catch (errorMessage) {
      return { props: { errorMessage, username } };
    }
  }

  return { redirect: { destination: '/', permanent: false } };
};

export default UserPage;
export { getServerSideProps };
