import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchText: string = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies() {
    this.movieService.getMovies().subscribe((data: any[]) => {
      this.movies = data;
      this.filteredMovies = data;
    });
  }

  applyFilter() {
    if (this.searchText) {
      this.movieService.searchMovies(this.searchText).subscribe((data: any[]) => {
        this.filteredMovies = data;
      });
    } else {
      this.filteredMovies = this.movies;
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/movie-details', id]);
  }
}
