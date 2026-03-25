import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { embedDashboard } from '@superset-ui/embedded-sdk';

@Injectable({
  providedIn: 'root'
})
export class SupersetEmbed {

  private supersetUrl = 'http://SUPERSET_IP_ADDRESS';
  private supersetApiUrl = `${this.supersetUrl}/api/v1/security`;
  private dashboardId = "YOUR_DASHBOARD_EMBEDDING_ID";

  constructor(private http: HttpClient) { }

  getToken() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
    
    // Above part should be implemented in backend and should only be called here to get guest token.
    return this.http.get<any>(`YOUR_BACKEND_API_URL`, { headers }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  embedDashboard() {
    return new Observable<any>((observer) => {
      this.getToken().subscribe(
        (token) => {
          embedDashboard({
            id: this.dashboardId,
            supersetDomain: this.supersetUrl,
            mountPoint: document.getElementById('superset_embedding_div_class')!,
            fetchGuestToken: () => token["token"],
            dashboardUiConfig: {
              hideTitle: true,
              hideChartControls: true,
              hideTab: true,
              filters: {
                visible: false,
                expanded: false
              },
              urlParams: {
                standalone: "1",
                show_filters: "0",
                show_native_filters: "0"
              }
            },
          });
          // Using true here to satisfy strict TypeScript rules while keeping the original structure
          observer.next(true);
          observer.complete();
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }
}
