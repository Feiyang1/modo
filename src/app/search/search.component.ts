import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResultItem, ItemType } from '../search.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { routeParams$ } from '../util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchResultItems$: Observable<SearchResultItem[]>;
  private searchTerm$ = new Subject<string>();
  private searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) { }

  // TODO: render movie, tv, person differently
  ngOnInit() {

    // subscribe search text update
    this.searchTerm$.pipe(
      debounceTime(300)
    ).subscribe((searchTerm) => this.router.navigate([`/search/${searchTerm}`]));

    // subscribe to url param (search term) update
    this.searchResultItems$ = routeParams$(this.route).pipe(
      tap(params => {
        // keep input box and url parameter in sync, otherwise input box will be blank if entering search directly in the url
        // use setTimeout, otherwise angular will give ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.searchTerm = params.searchterm;
        });
      }),
      switchMap(params => {
        const searchTerm = params.searchterm;
        return this.searchService.getAll({ query: searchTerm });
      }));
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }

  isMovie(item: SearchResultItem): boolean {
    return item.type === ItemType.MOVIE;
  }

}
