import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import {
  TrialBalanceItem,
  BalanceSheetItem,
  IncomeStatementItem,
} from '@core/interfaces/api/financial-statements.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class FinancialStatementsService {
  private readonly API_URL = `${environment.apiBaseUrl}/financial-statements`
  private readonly _httpClient = inject(HttpClient)

  getTrialBalance(periodId: number): Observable<ApiResponse<TrialBalanceItem[]>> {
    const params = new HttpParams({ fromObject: { periodId: String(periodId) } })
    return this._httpClient.get<ApiResponse<TrialBalanceItem[]>>(
      `${this.API_URL}/trial-balance`,
      { params },
    )
  }

  getBalanceSheet(periodId: number): Observable<ApiResponse<BalanceSheetItem[]>> {
    const params = new HttpParams({ fromObject: { periodId: String(periodId) } })
    return this._httpClient.get<ApiResponse<BalanceSheetItem[]>>(
      `${this.API_URL}/balance-sheet`,
      { params },
    )
  }

  getIncomeStatement(periodId: number): Observable<ApiResponse<IncomeStatementItem[]>> {
    const params = new HttpParams({ fromObject: { periodId: String(periodId) } })
    return this._httpClient.get<ApiResponse<IncomeStatementItem[]>>(
      `${this.API_URL}/income-statement`,
      { params },
    )
  }
}
