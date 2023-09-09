import { headers } from 'next/headers';
import { getUserData } from '~/services/twitchService';
import AddFeed from './AddFeed';

type SearchResultProps = {
  username: string;
};

const SearchResult = async ({ username }: SearchResultProps) => {
  try {
    const user = await getUserData(username);

    return (
      <div className="flex flex-col items-center gap-6">
        <a className="flex items-center gap-4" target="_new" href={user.url}>
          <img className="h-16 w-16 rounded-full" src={user.profileImageUrl} alt="Profile" />
          <p className="text-4xl font-bold">{user.displayName}</p>
        </a>
        <AddFeed username={user.username} hostname={headers().get('host') ?? ''} />
      </div>
    );
  } catch (errorMessage) {
    return <p>{errorMessage as string}</p>;
  }
};

export default SearchResult;
