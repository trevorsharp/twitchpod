export interface Feed {
  id: string;
  title: string;
  videos: Video[];
}

export interface Video {
  id: string;
  title: string;
  date: string;
  description: string;
  duration?: number;
}
