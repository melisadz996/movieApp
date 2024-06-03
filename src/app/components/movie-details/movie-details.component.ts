import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieDetails } from '../../models/movie.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movieDetails: MovieDetails | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private router: Router 
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovieDetails(id).subscribe((details: MovieDetails) => {
      this.movieDetails = details;
    });
  }

  goBackToList(): void {
    this.router.navigate(['']);
  }
}
