import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTableActions]',
  standalone: true
})
export class DataTableActionDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
