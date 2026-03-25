import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { embedDashboard } from '@superset-ui/embedded-sdk';

export interface LoginResponse {
  access_token: string;
}

export interface GuestTokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupersetEmbedService {
  private supersetUrl = 'http://127.0.0.1:5000/';
  private supersetApiUrl = `${this.supersetUrl}api/v1/security`;

  constructor(private http: HttpClient) { }

  /**
   * WARNING: CRITICAL SECURITY RISK
   * In a production environment, NEVER expose credentials over the frontend like this.
   * Superset credentials must be securely stored on a backend server (Node, Python, Java).
   * Your Angular app should call your backend API to retrieve the guest token seamlessly.
   */
  async getGuestToken(dashboardId: string): Promise<string> {
    const loginBody = {
      "password": "root", // DO NOT PUSH TO GITHUB/PRODUCTION
      "provider": "db",
      "refresh": true,
      "username": "admin"
    };

    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    // 1. Authenticate with Superset to get an Admin Access Token
    const loginResponse = await lastValueFrom(
      this.http.post<LoginResponse>(`${this.supersetApiUrl}/login`, loginBody, { headers })
    );

    const accessToken = loginResponse.access_token;
    if (!accessToken) throw new Error("Failed to retrieve access token");

    // 2. Request a Guest Token specific to this Dashboard ID
    const guestBody = {
      "resources": [
        {
          "type": "dashboard",
          "id": dashboardId,
        }
      ],
      "rls": [],
      "user": {
        "username": "report-viewer",
        "first_name": "report-viewer",
        "last_name": "report-viewer",
      }
    };

    const guestHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    });

    const guestResponse = await lastValueFrom(
      this.http.post<GuestTokenResponse>(`${this.supersetApiUrl}/guest_token/`, guestBody, { headers: guestHeaders })
    );

    return guestResponse.token;
  }

  /**
   * Mounts the Superset SDK cleanly within the provided Angular ViewChild element.
   */
  async embedDashboard(dashboardId: string, mountPoint: HTMLElement): Promise<void> {
    const guestToken = await this.getGuestToken(dashboardId);
    
    await embedDashboard({
      id: dashboardId,
      supersetDomain: this.supersetUrl,
      mountPoint: mountPoint,
      fetchGuestToken: () => Promise.resolve(guestToken),
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
  }
}
