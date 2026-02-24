import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() image: string = '';
  @Input() linkText: string = 'Get Started';

  @Input() isReversed: boolean = false;
  
  
}
