import { Component } from '@angular/core';
import { SupersetEmbedService } from './superset-embed.service';

@Component({
  selector: 'app-superset',
  standalone: true,
  templateUrl: './superset.component.html',
  styleUrls: ['./superset.component.css']
})
export class SupersetComponent {

  constructor(private embedService: SupersetEmbedService) {
    this.embedService.embedDashboard().subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}
