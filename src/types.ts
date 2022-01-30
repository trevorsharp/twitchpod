export interface Video {
  id: string;
  title: string;
  date: string;
  description: string;
  duration?: number;
}

export interface UserData {
  displayName: string;
  profileImageUrl: string;
  description: string;
}
