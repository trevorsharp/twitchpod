enum Quality {
  Maximum = 0,
  Audio = 1,
  P480 = 2,
  P720 = 3,
}

type User = {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  description: string;
};

type Video = {
  id: string;
  title: string;
  date: string;
  description: string;
  duration: number;
  url: string;
};

export { Quality };
export type { User, Video };
