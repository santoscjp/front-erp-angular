import { inject, Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '@environment/environment'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import { Emisor } from '@core/interfaces/api/company.interface'

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private API_URL = `${environment.apiBaseUrl}/emisor`

  private _httpClient = inject(HttpClient)

  public getEmisor(): Observable<ApiResponse<Emisor>> {
    return this._httpClient.get<ApiResponse<Emisor>>(this.API_URL)
  }
}
