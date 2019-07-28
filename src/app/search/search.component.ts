import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchService, SearchResultItem, ItemType, SearchResult } from '../search.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap, throttleTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { routeParams$ } from '../util';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  infiniteResult: SearchResultItem[] = [];
  searchResult: SearchResult;
  searchTerm = '';
  private searchTerm$ = new Subject<string>();
  private loadNextPage$ = new Subject<boolean>();
  // do not send searching request if a search is in flight
  // only for infinite scroll
  private isSearching: boolean;
  // this component is cached by route-reuse-strategy
  // remember the scroll position and restore it when navigating back to the search screen
  // we have to do it manually because the scrollbar goes to the top when the component is reattached.
  private scrollPosition: number;


  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;

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

    this.loadNextPage$.pipe(
      throttleTime(1000)
    ).subscribe(() => {
      // request is already in flight
      if (this.isSearching) {
        return;
      }

      const nextPage = this.searchResult.page + 1;
      if (nextPage > this.searchResult.total_pages) {
        return;
      }

      this.loadPage(nextPage);
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
        this.infiniteResult = [...this.infiniteResult, ...result.results];
      });
  }

  search(term: string): void {
    this.searchTerm$.next(term);
  }

  isMovie(item: SearchResultItem): boolean {
    return item.type === ItemType.MOVIE;
  }

  scrollIndexChanged(currentIndex: number): void {
    const end = this.viewport.getRenderedRange().end;
    this.scrollPosition = currentIndex;

    // load nextPage after virtual scrolling has rendered the last data point
    if (end !== 0 && end === this.infiniteResult.length) {
      this.loadNextPage$.next(true);
    }
  }

  loadPage(page: number): void {
    this.isSearching = true;
    this.searchService.getAll({ query: this.searchTerm, page }).subscribe(result => {
      this.searchResult = result;
      this.infiniteResult = [...this.infiniteResult, ...result.results];
      this.isSearching = false;
    });
  }

  // hook called when route-reuse-strategy re-attaches the component
  onAttach(){
    // scroll to the previous scroll position
    this.viewport.scrollToIndex(this.scrollPosition);
  }

}
