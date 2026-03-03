import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import { FiscalPeriod } from '@core/interfaces/api/fiscal-period.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FiscalPeriodsService {
  private readonly API_URL = `${environment.apiBaseUrl}/fiscal-periods`
  private readonly _httpClient = inject(HttpClient)

  getAll(): Observable<ApiResponse<FiscalPeriod[]>> {
    return this._httpClient.get<ApiResponse<FiscalPeriod[]>>(this.API_URL)
  }

  close(id: number): Observable<ApiResponse<FiscalPeriod>> {
    return this._httpClient.patch<ApiResponse<FiscalPeriod>>(
      `${this.API_URL}/${id}/close`,
      {},
    )
  }
}
