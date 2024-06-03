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
    premiered: string = '';
    language: string = '';
    rating: number = 0;
  }