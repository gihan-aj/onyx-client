import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  @Input() currentPage: number = 1;
  @Input() totalCount: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  startItem: number = 0;
  endItem: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.calculatePagination();
  }

  private calculatePagination(): void {
    if(this.totalCount > 0){
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.startItem = (this.currentPage - 1) * this.pageSize + 1;
      this.endItem = Math.min(
        this.currentPage * this.pageSize,
        this.totalCount
      );
    }else{
      this.totalPages = 0;
      this.startItem = 0;
      this.endItem = 0;
    }
  }

  goToPage(page: number): void {
    if(page >= 1 && page <= this.totalPages && page !== this.currentPage){
      this.pageChange.emit(page);
    }
  }
}
