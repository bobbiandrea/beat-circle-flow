// Sample YouTube music videos for testing
// These are publicly available music videos
export interface YoutubeSong {
  id: number;
  title: string;
  artist: string;
  youtubeId: string;
  duration: string;
  coverUrl: string;
}

export const youtubeSongs: YoutubeSong[] = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    youtubeId: "4NRXx6U8ABQ",
    duration: "3:20",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    youtubeId: "JGwWNGJdvx8",
    duration: "3:53",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Someone Like You",
    artist: "Adele",
    youtubeId: "hLQl3WQQoQ0",
    duration: "4:45",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 4,
    title: "Levitating",
    artist: "Dua Lipa",
    youtubeId: "TUVcZfQe-Kw",
    duration: "3:23",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 5,
    title: "Bad Guy",
    artist: "Billie Eilish",
    youtubeId: "DyDfgMOUjCI",
    duration: "3:14",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 6,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    youtubeId: "fJ9rUzIMcZQ",
    duration: "5:55",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 7,
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    youtubeId: "OPf0YbXqDm0",
    duration: "4:30",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 8,
    title: "Rolling in the Deep",
    artist: "Adele",
    youtubeId: "rYEDA3JcQqw",
    duration: "3:48",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 9,
    title: "Happier",
    artist: "Marshmello ft. Bastille",
    youtubeId: "m7Bc3pLyij0",
    duration: "3:34",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 10,
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    youtubeId: "kTJczUoc26U",
    duration: "2:21",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 11,
    title: "Peaches",
    artist: "Justin Bieber",
    youtubeId: "tQ0yjYUFKAE",
    duration: "3:18",
    coverUrl: "/placeholder.svg"
  },
  {
    id: 12,
    title: "Save Your Tears",
    artist: "The Weeknd",
    youtubeId: "XXYlFuWEuKI",
    duration: "3:35",
    coverUrl: "/placeholder.svg"
  }
];

// Function to get random songs
export const getRandomSongs = (count: number = 6): YoutubeSong[] => {
  const shuffled = [...youtubeSongs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
