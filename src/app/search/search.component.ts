import { Component, OnInit } from '@angular/core';
import { Movie, SearchService } from '../search.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private movies$: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.movies$ = this.searchTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.searchService.getMovies({ query: term }))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
