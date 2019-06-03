import { Component, OnInit } from '@angular/core';
import { Movie, SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private movies: Movie[] = [];
  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.movies = this.searchService.getMovies({
      query: ''
    });
  }

}
