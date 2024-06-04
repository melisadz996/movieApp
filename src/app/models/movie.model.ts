export class Movie {
    id: number = 0;
    name: string = '';
    genres: string = '';
    summary: string = '';
    image: string = '';
  }
  
  export class MovieDetails {
    id: number = 0;
    name: string = '';
    genres: string[] = [];
    summary: string = '';
    image: string = '';
    language: string = '';
    rating: number = 0;
    premieredFrom: string = '';
    premieredTo: string = '';
    channel: string = '';
    previousEpisodeName: string = '';
  previousEpisodeLink: string = '';
  nextEpisodeName: string = '';
  nextEpisodeLink: string = '';
  }

