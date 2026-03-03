import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import {
  ChartOfAccount,
  ChartOfAccountCreateRequest,
  ChartOfAccountUpdateRequest,
} from '@core/interfaces/api/chart-of-account.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ChartOfAccountsService {
  private readonly API_URL = `${environment.apiBaseUrl}/chart-of-accounts`
  private readonly _httpClient = inject(HttpClient)

  getAll(): Observable<ApiResponse<ChartOfAccount[]>> {
    return this._httpClient.get<ApiResponse<ChartOfAccount[]>>(this.API_URL)
  }

  create(data: ChartOfAccountCreateRequest): Observable<ApiResponse<ChartOfAccount>> {
    return this._httpClient.post<ApiResponse<ChartOfAccount>>(this.API_URL, data)
  }

  update(id: number, data: ChartOfAccountUpdateRequest): Observable<ApiResponse<ChartOfAccount>> {
    return this._httpClient.put<ApiResponse<ChartOfAccount>>(`${this.API_URL}/${id}`, data)
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this._httpClient.delete<ApiResponse<null>>(`${this.API_URL}/${id}`)
  }
}
