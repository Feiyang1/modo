import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResultItem, ItemType } from '../search.service';
import { Subject, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { routeParams$ } from '../util';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private searchResultItems$: Observable<SearchResultItem[]>;
  private searchTerms = new Subject<string>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) { }

  // TODO: render movie, tv, person differently
  ngOnInit() {

    console.log('search init')

    // subscribe search text update
    this.searchTerms.pipe(
      debounceTime(300)
    ).subscribe((searchTerm) => this.router.navigate([`/search/${searchTerm}`]));

    // subscribe to url param (search term) update
    this.searchResultItems$ = routeParams$(this.route).pipe(switchMap(params => {
      console.log('searrrch')
      const searchTerm = params.searchterm;
      return this.searchService.getAll({ query: searchTerm });
    }));
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  isMovie(item: SearchResultItem): boolean {
    return item.type === ItemType.MOVIE;
  }

}
