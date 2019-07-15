import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResultItem, ItemType, SearchResult } from '../search.service';
import { Subject, Observable, combineLatest } from 'rxjs';
import { debounceTime, switchMap, tap, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { routeParams$ } from '../util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult: SearchResult;
  searchTerm = '';
  private searchTerm$ = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) { }

  ngOnInit() {

    // subscribe search text update
    this.searchTerm$.pipe(
      debounceTime(300)
    ).subscribe((searchTerm) => {
      this.router.navigate([`/search/${searchTerm}`])
    });

    // subscribe to url param (search term) update
    routeParams$(this.route).pipe(
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
      })).subscribe(result => {
        this.searchResult = result;
      });
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }

  isMovie(item: SearchResultItem): boolean {
    return item.type === ItemType.MOVIE;
  }

  goToPage(page: number): void {
    this.searchService.getAll({ query: this.searchTerm, page }).subscribe(result => {
      this.searchResult = result;
    });
  }

}
