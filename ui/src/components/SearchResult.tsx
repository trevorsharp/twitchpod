import { indexRoute } from "@ui/routes";
import AddFeed from "@ui/components/AddFeed";

const SearchResult = () => {
  const feedData = indexRoute.useLoaderData();

  if (!feedData) return <p>Loading...</p>;
  if (feedData.error) return <p>{feedData.error}</p>;
  if (!feedData.user) return <p>Failed to search for channel</p>;

  return (
    <div className="flex flex-col items-center gap-6">
      <a
        className="flex items-center gap-4"
        target="_blank"
        rel="noreferrer"
        href={feedData.user.url}
      >
        <img className="h-16 w-16 rounded-full" src={feedData.user.profileImageUrl} alt="Profile" />
        <p className="text-4xl font-bold">{feedData.user.displayName}</p>
      </a>
      <AddFeed username={feedData.user.username} hostname={window.location.host} />
    </div>
  );
};

export default SearchResult;
