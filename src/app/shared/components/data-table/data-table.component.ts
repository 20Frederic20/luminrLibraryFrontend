import { Component, Input, ContentChild, TemplateRef, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColumnDef } from './data-table.model';
import { DataTableActionDirective } from './data-table-action.directive';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent<T extends { id?: string | number }> {
  @Input({ required: true }) data: T[] = [];
  @Input({ required: true }) columns: ColumnDef<T>[] = [];

  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() emptyMessage = 'Aucune donnée trouvée.';

  // Signal contentChild moderne pour récupérer le template d'actions
  actionsTemplate = contentChild(DataTableActionDirective, { read: TemplateRef });

  getCellValue(row: T, key: string): any {
    return key.split('.').reduce((acc: any, part) => acc && acc[part], row);
  }

  protected readonly Math = Math;
}
