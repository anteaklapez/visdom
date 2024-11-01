import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-offer-container',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './offer-container.component.html',
  styleUrl: './offer-container.component.scss',
})
export class OfferContainerComponent {}
