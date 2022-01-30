export interface Video {
  id: string;
  title: string;
  date: string;
  url: string;
  duration: number;
}

export interface UserData {
  id: string;
  displayName: string;
  profileImageUrl: string;
  description: string;
  videos: Video[];
}
