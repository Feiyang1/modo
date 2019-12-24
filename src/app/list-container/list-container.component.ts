import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListType, Visibility } from './list-container.misc';

@Component({
  selector: 'app-list-container',
  templateUrl: './list-container.component.html',
  styleUrls: ['./list-container.component.css']
})
export class ListContainerComponent implements OnInit {
  listType: ListType = ListType.Movie;
  visibility: Visibility = Visibility.All;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  onListTypeChange(e) {
    this.listType = e.value;
    this.navigate();
  }

  onVisibilityChange(e) {
    this.visibility = e.value;
    this.navigate();
  }

  private navigate() {
    this.router.navigate([`${this.listType}/${this.visibility}`], {relativeTo: this.route});
  }
}
