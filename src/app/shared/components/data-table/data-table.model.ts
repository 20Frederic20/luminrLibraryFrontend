import { TemplateRef } from '@angular/core';

export interface ColumnDef<T> {
  key: string;                               // Clé de l'objet (ex: 'name', 'description')
  header: string;                            // Libellé de l'en-tête
  cellTemplate?: TemplateRef<any>;          // Optionnel : Template personnalisé pour le rendu
  class?: string;                            // Classes CSS optionnelles pour la colonne
}

export interface TableActionEvent<T> {
  action: string;
  row: T;
}
