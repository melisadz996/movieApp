import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../models/movie.model';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: MovieDetails | undefined;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    this.movieService.getMovieDetailsWithLoading(id).subscribe(
      (details: MovieDetails) => {
        this.movieDetails = details;
      },
      (error: HttpErrorResponse) => {
        this.errorMessage = 'Error fetching movie details. Please try again later.';
        this.loading = false;
      },
      () => {
        this.loading = false;
      }
    );
  }

  goBackToList(): void {
    this.router.navigate(['']);
  } 
}
