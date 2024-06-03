import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://api.tvmaze.com';

  constructor(private http: HttpClient) { }

  searchMovies(query: string): Observable<Movie[]> {
    const url = `${this.baseUrl}/search/shows?q=${query}`;
    return this.http.get<any[]>(url).pipe(
      map((data: any[]) => data.map((item: any) => ({ 
        id: item.show.id,
        name: item.show.name,
        genres: item.show.genres ? item.show.genres : null,
        summary: item.show.summary ? this.stripHtmlTags(item.show.summary) : '',
        image: item.show.image ? item.show.image.medium : null,
        rating: item.show.rating ? item.show.rating.average : null
      })))
    );
  }

  getMovies(): Observable<Movie[]> {
    const url = `${this.baseUrl}/shows`;
    return this.http.get<any[]>(url).pipe(
      map((data: any[]) => data.map((item: any) => ({ 
        id: item.id,
        name: item.name,
        genres: item.genres ? item.genres : null,
        summary: item.summary ? this.stripHtmlTags(item.summary) : '',
        image: item.image ? item.image.medium : null,
        rating: item.rating ? item.rating.average : null
      })))
    );
  }

  getMovieDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/shows/${id}`;
    return this.http.get<any>(url).pipe(
      map((item: any) => ({
        id: item.id,
        name: item.name,
        genres: item.genres,
        summary: item.summary ? this.stripHtmlTags(item.summary) : '',
        image: item.image ? item.image.original : null,
        rating: item.rating ? item.rating.average : null,
        premiered: item.premiered,
        language: item.language
      }))
    );
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  }
}
