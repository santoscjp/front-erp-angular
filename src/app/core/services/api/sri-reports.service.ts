import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import { SriReport } from '@core/interfaces/api/sri-reports.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SriReportsService {
  private readonly API_URL = `${environment.apiBaseUrl}/sri-reports`
  private readonly _httpClient = inject(HttpClient)

  getAtsReport(periodId: number): Observable<ApiResponse<SriReport>> {
    const params = new HttpParams({ fromObject: { periodId: String(periodId) } })
    return this._httpClient.get<ApiResponse<SriReport>>(`${this.API_URL}/ats`, { params })
  }

  generateAts(periodId: number): Observable<ApiResponse<SriReport>> {
    return this._httpClient.post<ApiResponse<SriReport>>(
      `${this.API_URL}/ats/generate`,
      { periodId },
    )
  }
}
