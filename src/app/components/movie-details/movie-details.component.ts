import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../models/movie.model';
import { Router } from '@angular/router';
import { Subscription, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  movieDetails: MovieDetails | undefined;
  loading: boolean = false;
  errorMessage: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.subscription.add(
      this.movieService.getMovieDetailsWithLoading(id).subscribe(
        (details: MovieDetails) => {
          this.movieDetails = details;
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = `Error fetching movie details: ${error.statusText}. Please try again later.`;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  goBackToList(): void {
    this.router.navigate(['']);
  } 
}
