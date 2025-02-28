import {Component, Input, OnChanges} from '@angular/core';
import {APP_LOCALE, DEFAULT_PAGE_SIZE_OPTION, PAGE_SIZE_OPTIONS} from '../../../app.constants';
import {RouterLink} from "@angular/router";

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
        RouterLink
    ],
    templateUrl: './financial-table.component.html',
    styleUrl: './financial-table.component.css'
})

export class FinancialTableComponent implements OnChanges {
    @Input() columns: Column[] = [];
    @Input() data: any[] = [];
    @Input() buttonLink: string = '';

    public readonly columnType = ColumnType;

    public filteredData: any[] = [];
    public searchTerm: string = '';
    public highlightedData: any[] = [];
    public pageSizeOption: number = DEFAULT_PAGE_SIZE_OPTION;
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public totalCount: number = 0;

    public ngOnChanges(): void {
        this.filteredData = [...this.data];
        this.highlightedData = this.getHighlightedData(this.filteredData);
        this.updateDisplayedData();
    }

    public onSearch(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerm = inputElement.value.trim().toLowerCase();
        this.filteredData = this.searchTerm
            ? this.data.filter(row =>
                this.columns.some(col => {
                    const cellValue = row[col.name];
                    return cellValue && cellValue.toString().toLowerCase().includes(this.searchTerm);
                })
            )
            : [...this.data];

        this.updateDisplayedData();
    }

    public onRecordsChange(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.pageSizeOption = parseInt(selectElement.value, 10);
        this.updateDisplayedData();
    }

    private updateDisplayedData(): void {
        this.totalCount = this.filteredData.length > this.pageSizeOption ? this.pageSizeOption : this.filteredData.length;
        this.highlightedData = this.getHighlightedData(this.filteredData.slice(0, this.pageSizeOption));
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
