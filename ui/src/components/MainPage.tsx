import { indexRoute } from "../routes";
import Search from "./Search";
import SearchResult from "./SearchResult";

const MainPage = () => {
  const { _splat: username } = indexRoute.useParams();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-16 p-8 text-center">
      <h1 className="flex flex-col text-7xl font-bold">
        <span>Welcome to</span>
        <span className="text-twitch">
          <a href="/">twitchPOD</a>
        </span>
      </h1>
      <p className="flex flex-col text-2xl">
        <span>Generate podcast feeds for your</span>
        <span>
          favorite <span className="text-twitch">Twitch</span> streamers
        </span>
      </p>
      <Search initialSearch={username} />
      {username && <SearchResult />}
    </div>
  );
};

export default MainPage;
