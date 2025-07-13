import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

// Define the configuration for a single column in the table
export interface TableColumn<T> {
  key: keyof T | string; // Key of the property in the data object
  title: string; // The header text to display
  customTpl?: TemplateRef<any>; // Optional template for custom cell rendering
}

@Component({
  selector: 'app-data-table',
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> {
  @Input() data: T[] | null = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() isLoading: boolean = false;

  // A helper method to safely get a value from an object, even with nested keys.
  // For now, we'll keep it simple. It can be expanded later.
  getCellValue(item: T , key: keyof T | string): any {
    return item[key as keyof T];
  }
}
