enum Quality {
  Maximum = 0,
  Audio = 1,
  P480 = 2,
  P720 = 3,
  Auto = 4,
}

type User = {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  description: string;
  url: string;
};

type Video = {
  id: string;
  title: string;
  date: string;
  description: string;
  duration: number | undefined;
  url: string;
};

export { Quality };
export type { User, Video };
