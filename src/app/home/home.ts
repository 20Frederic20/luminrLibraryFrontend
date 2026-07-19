import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
