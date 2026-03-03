import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import {
  BankReconciliation,
  BankReconciliationCreateRequest,
} from '@core/interfaces/api/bank-reconciliation.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class BankReconciliationService {
  private readonly API_URL = `${environment.apiBaseUrl}/bank-reconciliation`
  private readonly _httpClient = inject(HttpClient)

  getAll(): Observable<ApiResponse<BankReconciliation[]>> {
    return this._httpClient.get<ApiResponse<BankReconciliation[]>>(this.API_URL)
  }

  create(data: BankReconciliationCreateRequest): Observable<ApiResponse<BankReconciliation>> {
    return this._httpClient.post<ApiResponse<BankReconciliation>>(this.API_URL, data)
  }
}
