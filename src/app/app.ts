import { CommonModule } from '@angular/common';
import { Component, HostListener, Renderer2, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  isBurgerActive: boolean = false;
  isWhyModalActive: boolean = false;
  isPopupActive: boolean = false;
  isSaveButtonVisible: boolean = true;
  currentYear = new Date().getFullYear();

  quoteBtn: HTMLElement | null = null;
  private hasShownExitPopup: boolean = false;

  constructor(private r: Renderer2, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    this.quoteBtn = document.querySelector('.header-quote-button');
    this.updateQuoteBtn(window.scrollY > 600);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateQuoteBtn(window.scrollY > 600);
  }

  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    if (event.clientY <= 0 && !this.hasShownExitPopup && !this.isPopupActive) {
      this.showPopup();
      this.hasShownExitPopup = true;
    }
  }

  updateQuoteBtn(isVisible: boolean) {
    if (!this.quoteBtn) return;
    if (isVisible) this.r.addClass(this.quoteBtn, 'visible');
    else this.r.removeClass(this.quoteBtn, 'visible');
  }

  toggleBurger() {
    this.isBurgerActive = !this.isBurgerActive;
  }

  toggleWhyModal() {
    this.isWhyModalActive = !this.isWhyModalActive;
  }

  showPopup() {
    this.isPopupActive = true;
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    this.isPopupActive = false;
    document.body.style.overflow = '';
  }

  onPopupBackgroundClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('popup')) {
      this.closePopup();
    }
  }

  onNoThanks() {
    this.closePopup();
  }

  onGetDiscount() {
    this.closePopup();
  }

  scrollToSections(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (sectionId === 'quote') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if(window.innerWidth < 1024 && element) {
        const rect = element.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + rect.top - 60, behavior: 'smooth' });
      }
    }
    this.isBurgerActive = false;
    this.isWhyModalActive = false;
  }

  isMobile() { return window.innerWidth < 1024; }

  scrollToTop() {
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.isBurgerActive = false;
    this.isWhyModalActive = false;
  }
}
