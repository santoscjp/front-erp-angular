import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import {
  GeneralLedgerEntry,
  GeneralLedgerFilter,
} from '@core/interfaces/api/general-ledger.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class GeneralLedgerService {
  private readonly API_URL = `${environment.apiBaseUrl}/general-ledger`
  private readonly _httpClient = inject(HttpClient)

  getEntries(filters: GeneralLedgerFilter = {}): Observable<ApiResponse<GeneralLedgerEntry[]>> {
    const params = new HttpParams({
      fromObject: Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== null),
      ) as Record<string, string>,
    })
    return this._httpClient.get<ApiResponse<GeneralLedgerEntry[]>>(this.API_URL, { params })
  }
}
