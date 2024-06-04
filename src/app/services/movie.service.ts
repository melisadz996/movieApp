import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map, finalize } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'https://api.tvmaze.com';
  private loadingSubject = new Subject<boolean>();
  private errorSubject = new Subject<string>();

  constructor(private http: HttpClient) { }

  getLoadingStatus(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  getErrorMessages(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  searchMovies(query: string): Observable<Movie[]> {
    this.loadingSubject.next(true);
    const url = `${this.baseUrl}/search/shows?q=${query}`;
    return this.http.get<any[]>(url).pipe(
      map((data: any[]) => data.map((item: any) => ({ 
        id: item.show.id,
        name: item.show.name,
        genres: item.show.genres ? item.show.genres : null,
        summary: item.show.summary ? this.stripHtmlTags(item.show.summary) : '',
        image: item.show.image ? item.show.image.medium : null,
        rating: item.show.rating ? item.show.rating.average : null
      }))),
      catchError(error => this.handleError('Error searching for movies. Please try again later.', error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  getMovies(): Observable<Movie[]> {
    this.loadingSubject.next(true);
    const url = `${this.baseUrl}/shows`;
    return this.http.get<any[]>(url).pipe(
      map((data: any[]) => data.map((item: any) => ({ 
        id: item.id,
        name: item.name,
        genres: item.genres ? item.genres : null,
        summary: item.summary ? this.stripHtmlTags(item.summary) : '',
        image: item.image ? item.image.medium : null,
        rating: item.rating ? item.rating.average : null
      }))),
      catchError(error => this.handleError('Error fetching movies. Please try again later.', error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  getMovieDetailsWithLoading(id: number): Observable<any> {
    this.loadingSubject.next(true);
    return this.getMovieDetails(id).pipe(
      catchError(error => {
        this.loadingSubject.next(false);
        return throwError(error);
      }),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private getMovieDetails(id: number): Observable<any> {
    const url = `${this.baseUrl}/shows/${id}?embed=episodes`;
    return this.http.get<any>(url).pipe(
      map((item: any) => {
        const episode = item._embedded?.episodes[0];
        return {
          id: item.id,
          name: item.name,
          genres: item.genres,
          summary: item.summary ? this.stripHtmlTags(item.summary) : '',
          image: item.image ? item.image.original : null,
          rating: item.rating ? item.rating.average : null,
          language: item.language ?? '',
          premieredFrom: item.premiered ?? '',
          premieredTo: item.ended ?? '',
          channel: item.webChannel?.name ?? '',
          previousEpisodeName: episode?.name ?? '',
          previousEpisodeLink: episode?.url ?? '',
          nextEpisodeName: null,
          nextEpisodeLink: null
        };
      }),
      catchError(error => this.handleError('Error fetching movie details. Please try again later.', error))
    );
  }

  private stripHtmlTags(html: string): string {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  }

  private handleError(errorMessage: string, error: HttpErrorResponse) {
    console.error(errorMessage, error);
    this.errorSubject.next(errorMessage);
    return throwError(errorMessage);
  }
}
