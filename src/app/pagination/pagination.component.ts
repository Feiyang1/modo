import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

// TODO: replace with infinite scroll
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() page: number;
  @Input() totalPages: number;
  @Input() totalCount: number;
  @Input() countPerPage: number;

  @Output() goPage = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }

    return pages;
  }

  onPage(page: number): void {
    this.goPage.emit(page);
  }

}
