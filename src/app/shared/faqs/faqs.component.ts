import { Component, AfterViewInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements AfterViewInit, OnDestroy {
  private removeFns: Array<() => void> = [];

  constructor(private host: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngAfterViewInit(): void {
    const headers = this.host.nativeElement.querySelectorAll<HTMLElement>('.accordion-header');

    headers.forEach((header) => {
      const off = this.r.listen(header, 'click', () => {
        const content = header.nextElementSibling as HTMLElement | null;
        const arrowIcon = header.querySelector('img') as HTMLImageElement | null;

        if (header.classList.contains('active')) {
          header.classList.remove('active');
          if (content) content.style.maxHeight = '';
          if (arrowIcon) arrowIcon.style.transform = 'rotate(-90deg)';
          return;
        }

        headers.forEach((h) => {
          h.classList.remove('active');
          const c = h.nextElementSibling as HTMLElement | null;
          if (c) c.style.maxHeight = '';
          const ic = h.querySelector('img') as HTMLImageElement | null;
          if (ic) ic.style.transform = 'rotate(-90deg)';
        });

        header.classList.add('active');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
      });
      this.removeFns.push(off);
    });

    // Обробник для data-scroll елементів
    const clickHandler = this.r.listen(this.host.nativeElement, 'click', (event: Event) => {
      const target = event.target as HTMLElement;
      const scrollElement = target.closest('[data-scroll]') as HTMLElement | null;

      if (scrollElement) {
        event.preventDefault();
        event.stopPropagation();
        const sectionId = scrollElement.getAttribute('data-scroll');
        if (sectionId) {
          this.scrollToSections(sectionId);
        }
      }
    });
    this.removeFns.push(clickHandler);
  }

  ngOnDestroy(): void {
    this.removeFns.forEach(fn => fn());
    this.removeFns = [];
  }

  scrollToSections(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (sectionId === 'quote') {
      if(window.innerWidth < 1024 && element) {
        const rect = element.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top - 60, behavior: 'smooth' });
        return;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
