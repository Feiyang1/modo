import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TvService, TvDetail } from '../tv.service';
import { ListsService } from '../lists.service';
import { Observable } from 'rxjs';
import { posterPath } from '../util';

@Component({
  selector: 'app-tv-detail',
  templateUrl: './tv-detail.component.html',
  styleUrls: ['./tv-detail.component.css']
})
export class TvDetailComponent implements OnInit {
  tv$: Observable<TvDetail>;
  constructor(
    private route: ActivatedRoute,
    private tvService: TvService,
    private listsService: ListsService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.tv$ = this.tvService.getTv(id);
  }

  posterPath(tv: TvDetail) {
    return posterPath(tv.poster_path);
  }

}
