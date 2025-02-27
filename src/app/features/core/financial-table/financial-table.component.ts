import {Component, Input} from '@angular/core';
import {DatePipe} from '@angular/common';

export enum ColumnType {
  TEXT = 'TEXT',
  DATE = 'DATE',
  IMAGE = 'IMAGE',
}

export interface Column {
  name: string;
  label: string;
  type: ColumnType;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-financial-table',
  imports: [
    DatePipe
  ],
  templateUrl: './financial-table.component.html',
  styleUrl: './financial-table.component.css'
})

export class FinancialTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];

  public readonly columnType = ColumnType;
}
