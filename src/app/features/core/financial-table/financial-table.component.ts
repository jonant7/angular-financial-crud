import {Component, Input, OnChanges} from '@angular/core';
import {APP_LOCALE} from '../../../app.constants';

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
    imports: [],
    templateUrl: './financial-table.component.html',
    styleUrl: './financial-table.component.css'
})

export class FinancialTableComponent implements OnChanges {
    @Input() columns: Column[] = [];
    @Input() data: any[] = [];

    public readonly columnType = ColumnType;

    public filteredData: any[] = [];
    public searchTerm: string = '';
    public highlightedData: any[] = [];

    public ngOnChanges(): void {
        this.filteredData = [...this.data];
        this.highlightedData = this.getHighlightedData(this.filteredData);
    }


    public onSearch(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (!inputElement) return;
        this.searchTerm = inputElement.value.trim().toLowerCase();

        if (!this.searchTerm) {
            this.filteredData = [...this.data];
        } else {
            this.filteredData = this.data.filter(row =>
                this.columns.some(col => {
                    const cellValue = row[col.name];
                    if (!cellValue) return false;
                    let valueToCompare = cellValue.toString().toLowerCase();
                    if (col.type === ColumnType.DATE) {
                        valueToCompare = new Date(cellValue).toLocaleDateString(APP_LOCALE);
                    }
                    return valueToCompare.includes(this.searchTerm);
                })
            );
        }

        this.highlightedData = this.getHighlightedData(this.filteredData);
    }


    public getHighlightedData(data: any[]): any[] {
        return data.map(row => {
            const highlightedRow = {...row};
            this.columns.forEach(col => {
                if (!highlightedRow[col.name]) return;
                if (col.type === ColumnType.IMAGE) return;
                let valueToCompare = highlightedRow[col.name].toString();
                if (col.type === ColumnType.DATE) {
                    valueToCompare = new Date(highlightedRow[col.name]).toLocaleDateString(APP_LOCALE);
                }
                highlightedRow[col.name] = this.applyHighlight(valueToCompare, this.searchTerm);
            });
            return highlightedRow;
        });
    }


    public applyHighlight(value: string, term: string): string {
        if (!term || !value) return value;
        const regex = new RegExp(`(${term})`, 'gi');
        return value.replace(regex, `<mark>$1</mark>`);
    }

}
