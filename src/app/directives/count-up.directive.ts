import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appCountUp]'
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input() duration = 2000; // мс
  @Input() once = true;     // анімація один раз

  private observer?: IntersectionObserver;
  private animated = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    // Якщо елемент уже у вʼюпорті при завантаженні — все одно пройдемо через IO
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && (!this.animated || !this.once)) {
            this.start();
            if (this.once) {
              this.animated = true;
              this.observer?.unobserve(this.el.nativeElement);
            }
          }
        });
      },
      { root: null, threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private start(): void {
    const node = this.el.nativeElement;
    const original = (node.textContent || '').trim();

    // Витягуємо число і все, що після нього як суфікс (наприклад "k+","%","+")
    // Приклад матчів: "150k+" -> ["150k+","150","k+"]
    const match = original.match(/^([\d,]+)(.*)$/);
    if (!match) return;

    const endRaw = match[1].replace(/,/g, '');
    const suffix = match[2] ?? '';

    const end = Number.parseInt(endRaw, 10);
    if (Number.isNaN(end)) return;

    const start = 0;
    const duration = this.duration;

    let startTs: number | null = null;

    const step = (ts: number) => {
      if (startTs == null) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      node.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
