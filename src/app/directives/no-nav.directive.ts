// src/app/shared/directives/no-nav.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoNav]'
})
export class NoNavDirective {
  @HostListener('click', ['$event'])
  onClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
}
