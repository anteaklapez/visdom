import { inject, NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@NgModule({
  imports: [MatIconModule],
})
export class IconsModule {
  private readonly _matIconRegistry = inject(MatIconRegistry);
  private readonly _domSanitizer = inject(DomSanitizer);

  readonly iconMap = new Map<string, string>([
    ['engine', '../../assets/icons/engine.svg'],
    ['calendar', '../../assets/icons/calendar.svg'],
    ['electricity', '../../assets/icons/electricity.svg'],
    ['fuel', '../../assets/icons/fuel.svg'],
    ['hybrid', '../../assets/icons/hybrid.svg'],
    ['road', '../../assets/icons/road.svg'],
    ['transmission', '../../assets/icons/transmission.svg'],
    ['location-pin', '../../assets/icons/location-pin.svg'],
  ]);

  constructor() {
    this.iconMap.forEach((value, key) => {
      this._matIconRegistry.addSvgIcon(
        key,
        this._domSanitizer.bypassSecurityTrustResourceUrl(value)
      );
    });
  }
}
