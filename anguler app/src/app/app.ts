import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupersetComponent } from './superset-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SupersetComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('anguler-app');
}
