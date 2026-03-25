import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupersetEmbedService } from './superset-embed.service';

@Component({
  selector: 'app-superset',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superset.component.html',
  styleUrls: ['./superset.component.css']
})
export class SupersetComponent implements OnChanges, OnDestroy {
  @Input() dashboardId!: string;
  @ViewChild('dashboardContainer', { static: true }) dashboardContainer!: ElementRef<HTMLDivElement>;

  isLoading: boolean = true;

  constructor(
    private embedService: SupersetEmbedService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['dashboardId'] && this.dashboardId) {
      await this.loadDashboard();
    }
  }

  private async loadDashboard() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    // Clean up previous instance properly using the ViewChild ref
    if (this.dashboardContainer?.nativeElement) {
      this.dashboardContainer.nativeElement.innerHTML = '';
    }

    try {
      await this.embedService.embedDashboard(this.dashboardId, this.dashboardContainer.nativeElement);
      console.log(`Successfully embedded dashboard: ${this.dashboardId}`);
      
      // Give the iframe a tiny bit of time to render its content before hiding the spinner
      setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges(); // <-- FORCE ANGULAR TO UPDATE THE VIEW
      }, 600);
      
    } catch (error) {
      console.error('Failed to embed dashboard:', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    // Release iframe resources from memory when component unmounts
    if (this.dashboardContainer?.nativeElement) {
      this.dashboardContainer.nativeElement.innerHTML = '';
    }
  }
}
