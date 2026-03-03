import { HttpClient, HttpParams } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { environment } from '@environment/environment'
import {
  ApiResponse,
  ApiData,
} from '@core/interfaces/api/api-response.interface'
import {
  JournalEntry,
  JournalEntryCreateRequest,
} from '@core/interfaces/api/journal-entry.interface'
import { TableFilter } from '@core/interfaces/ui/table-filter.interface'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class JournalEntriesService {
  private readonly API_URL = `${environment.apiBaseUrl}/journal-entries`
  private readonly _httpClient = inject(HttpClient)

  getAll(filters: TableFilter = {}): Observable<ApiResponse<ApiData<JournalEntry[]>>> {
    const params = new HttpParams({ fromObject: { ...filters } as Record<string, string> })
    return this._httpClient.get<ApiResponse<ApiData<JournalEntry[]>>>(this.API_URL, { params })
  }

  getById(id: number): Observable<ApiResponse<JournalEntry>> {
    return this._httpClient.get<ApiResponse<JournalEntry>>(`${this.API_URL}/${id}`)
  }

  create(data: JournalEntryCreateRequest): Observable<ApiResponse<JournalEntry>> {
    return this._httpClient.post<ApiResponse<JournalEntry>>(this.API_URL, data)
  }

  update(id: number, data: JournalEntryCreateRequest): Observable<ApiResponse<JournalEntry>> {
    return this._httpClient.put<ApiResponse<JournalEntry>>(`${this.API_URL}/${id}`, data)
  }

  approve(id: number): Observable<ApiResponse<JournalEntry>> {
    return this._httpClient.patch<ApiResponse<JournalEntry>>(
      `${this.API_URL}/${id}/approve`,
      {},
    )
  }

  void(id: number): Observable<ApiResponse<JournalEntry>> {
    return this._httpClient.patch<ApiResponse<JournalEntry>>(
      `${this.API_URL}/${id}/void`,
      {},
    )
  }
}
