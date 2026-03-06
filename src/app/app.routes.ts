import { Routes } from '@angular/router';
import { Main } from './components/main/main';
import { TermsAndConditions } from './components/terms-and-conditons/terms-and-conditions';
import { PrivacyPolicy } from './components/privacy-policy/privacy-policy';
import { CarShippingQuote } from './components/car-shipping-quote/car-shipping-quote';

export const routes: Routes = [
  { path: '', component: Main },
  { path: 'car-shipping-quote', component: CarShippingQuote },
  { path: 'terms-and-conditions', component: TermsAndConditions },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: '**', component: Main }
];
