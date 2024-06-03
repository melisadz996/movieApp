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
  moviesPerPage: number = 5;
  currentPage: number = 1;
  sortOrder: string = 'asc'; // Default sort order

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
        this.currentPage = 1; // Reset current page when applying filter
      });
    } else {
      this.filteredMovies = this.movies;
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/movie-details', id]);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get totalPages() {
    return Math.ceil(this.filteredMovies.length / this.moviesPerPage);
  }

  get paginatedMovies() {
    const startIndex = (this.currentPage - 1) * this.moviesPerPage;
    return this.filteredMovies.slice(startIndex, startIndex + this.moviesPerPage);
  }

  applySorting() {
    if (this.sortOrder === 'asc') {
      this.filteredMovies.sort((a, b) => (a.name > b.name) ? 1 : -1);
    } else {
      this.filteredMovies.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }
  }
}
