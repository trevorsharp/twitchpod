import Link from 'next/link';
import Search from './Search';
import SearchResult from './SearchResult';

type MainPageProps = {
  username?: string;
};

const MainPage = ({ username }: MainPageProps) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 text-center">
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
    <Search initialSearch={username} />
    {username && <SearchResult username={username} />}
  </div>
);

export default MainPage;
