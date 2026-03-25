import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';


import { embedDashboard } from '@superset-ui/embedded-sdk';

@Injectable({
  providedIn: 'root'
})
export class SupersetEmbedService {

  private supersetUrl = 'http://SUPERSET_IP_ADDRESS'
  private supersetApiUrl = `${this.supersetUrl}/api/v1/security`
  private dashboardId = "6ce53370-9d60-439f-a337-0459416a4832"

  constructor(private http: HttpClient) { }

  getToken() {
    //calling login to get access token
    const body = {
      "password": "", // TODO: Enter your password here locally (DO NOT PUSH TO GITHUB)
      "provider": "db",
      "refresh": true,
      "username": "embedding-admin"
    };

    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.post(`${this.supersetApiUrl}/login`, body, { headers }).pipe(
      catchError((error) => {
        console.error(error);
        return throwError(error);
      }),
      switchMap((accessToken: any) => {
        const body = {
          "resources": [
            {
              "type": "dashboard",
              "id": this.dashboardId,
            }
          ],
          "rls": [],
          "user": {
            "username": "report-viewer",
            "first_name": "report-viewer",
            "last_name": "report-viewer",
          }
        };

        const acc = accessToken["access_token"];
        const headers = new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": `Bearer ${acc}`,
        });

        return this.http.post<any>(`${this.supersetApiUrl}/guest_token/`, body, { headers });
      }));
  }




  embedDashboard() {
    return new Observable<void>((observer) => {
      this.getToken().subscribe({
        next: (token: any) => {
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
          observer.next();
          observer.complete();
        },
        error: (error: any) => {
          observer.error(error);
        }
      });
    });
  }
}
