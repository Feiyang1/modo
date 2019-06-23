import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResultItem, ItemType } from '../search.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchResultItems$: Observable<SearchResultItem[]>;
  private searchTerms = new Subject<string>();
  constructor(private searchService: SearchService) { }
  // TODO: render movie, tv, person differently
  ngOnInit() {
    this.searchResultItems$ = this.searchTerms.pipe(
      debounceTime(300),
      switchMap((term: string) => this.searchService.getAll({ query: term }))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  isMovie(item: SearchResultItem): boolean {
    return item.type === ItemType.MOVIE;
  }

}
