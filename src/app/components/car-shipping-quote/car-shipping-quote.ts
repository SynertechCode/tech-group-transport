import { AfterViewInit, Component } from '@angular/core';
import { FaqsComponent } from '../../shared/faqs/faqs.component';
import { CountUpDirective } from '../../directives/count-up.directive';
import { NoNavDirective } from '../../directives/no-nav.directive';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

type StateCode =
  | 'AL'|'AK'|'AZ'|'AR'|'CA'|'CO'|'CT'|'DE'|'DC'|'FL'|'GA'|'HI'|'ID'|'IL'|'IN'|'IA'
  | 'KS'|'KY'|'LA'|'ME'|'MD'|'MA'|'MI'|'MN'|'MS'|'MO'|'MT'|'NE'|'NV'|'NH'|'NJ'
  | 'NM'|'NY'|'NC'|'ND'|'OH'|'OK'|'OR'|'PA'|'RI'|'SC'|'SD'|'TN'|'TX'|'UT'|'VT'
  | 'VA'|'WA'|'WV'|'WI'|'WY';

const STATE_NAMES: Record<StateCode, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', DC:'District Of Columbia',
  FL:'Florida', GA:'Georgia', HI:'Hawaii', ID:'Idaho', IL:'Illinois',
  IN:'Indiana', IA:'Iowa', KS:'Kansas', KY:'Kentucky', LA:'Louisiana',
  ME:'Maine', MD:'Maryland', MA:'Massachusetts', MI:'Michigan', MN:'Minnesota',
  MS:'Mississippi', MO:'Missouri', MT:'Montana', NE:'Nebraska', NV:'Nevada',
  NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico', NY:'New York',
  NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma', OR:'Oregon',
  PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina', SD:'South Dakota',
  TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont', VA:'Virginia',
  WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
};

@Component({
  selector: 'app-car-shipping-quote',
  imports: [FaqsComponent, CountUpDirective, NoNavDirective],
  templateUrl: './car-shipping-quote.html',
  styleUrl: './car-shipping-quote.scss'
})
export class CarShippingQuote implements AfterViewInit {
  swiper!: Swiper;
  swiper2!: Swiper;
  swiper3!: Swiper;
  listeners: Array<{ el: Element; type: string; handler: EventListenerOrEventListenerObject }> = [];

   ngAfterViewInit(): void {
    this.initSwiper();
    this.initMapTooltips();
  }

  ngOnDestroy(): void {
    this.listeners.forEach(({ el, type, handler }) =>
      el.removeEventListener(type, handler as EventListener)
    );
    this.listeners = [];
  }

  initSwiper() {
    this.swiper = new Swiper('.swiper-reviews', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 'auto',
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 5000 },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        type: 'bullets',
      },
      breakpoints: {
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1280: { slidesPerView: 3, spaceBetween: 30 },
        1440: { slidesPerView: 4, spaceBetween: 30 },
        1600: { slidesPerView: 5, spaceBetween: 30 },
      },
    });

    this.swiper2 = new Swiper('.swiper-testimonial', {
      modules: [Autoplay, Navigation],
      loop: true,
      slidesPerView: 1,
      spaceBetween: 16,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: '.swiper-button-next-2',
        prevEl: '.swiper-button-prev-2',
      },
    });

    this.swiper3 = new Swiper('.service-options-swiper', {
      modules: [Pagination],
      slidesPerView: 1,
      spaceBetween: 12,
      initialSlide: 1,
      pagination: {
        el: '.service-options-pagination',
        clickable: true,
      },
    });
  }

    initMapTooltips(): void {
    const tooltip = document.getElementById('tooltip') as HTMLDivElement | null;
    if (!tooltip) {
      return;
    }

    const paths = document.querySelectorAll<SVGPathElement>('path[data-id], .state[data-id]');
    paths.forEach((path) => {
      const onMove = (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const stateCode = path.getAttribute('data-id');
        tooltip.style.left = `${mouseEvent.pageX + 13}px`;
        tooltip.style.top  = `${mouseEvent.pageY - 20}px`;
        tooltip.textContent = this.getStateFullName(stateCode);
        tooltip.style.display = 'block';
      };
      const onLeave = () => { tooltip.style.display = 'none'; };

      path.addEventListener('mousemove', onMove);
      path.addEventListener('mouseleave', onLeave);
      this.listeners.push({ el: path, type: 'mousemove', handler: onMove });
      this.listeners.push({ el: path, type: 'mouseleave', handler: onLeave });
    });

    const labels = document.querySelectorAll<HTMLElement>('.external-label[data-state]');
    labels.forEach((label) => {
      const stateCode = label.dataset['state'] as StateCode | undefined;
      const relatedPath = stateCode
        ? document.querySelector<SVGPathElement>(`.state[data-id="${stateCode}"]`)
        : null;

      const onEnter = () => {
        if (relatedPath) relatedPath.classList.add('hover');

        const rect = label.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10 + window.scrollX}px`;
        tooltip.style.top  = `${rect.top + window.scrollY}px`;
        tooltip.textContent = this.getStateFullName(stateCode);
        tooltip.style.display = 'block';
      };

      const onLeave = () => {
        if (relatedPath) relatedPath.classList.remove('hover');
        tooltip.style.display = 'none';
      };

      label.addEventListener('mouseenter', onEnter);
      label.addEventListener('mouseleave', onLeave);
      this.listeners.push({ el: label, type: 'mouseenter', handler: onEnter });
      this.listeners.push({ el: label, type: 'mouseleave', handler: onLeave });
    });
  }

  getStateFullName(abbr?: string | null): string {
    if (!abbr) return '';
    const code = abbr.toUpperCase() as StateCode;
    return STATE_NAMES[code] ?? abbr;
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
        return
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  isMobile() { return window.innerWidth < 1024; }
}
