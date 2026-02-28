import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { isBefore } from 'date-fns'
import {
  LoginRequest,
  LoginResponse,
  User,
} from '@core/interfaces/api/user.interface'
import { StorageService } from '../ui/storage.service'
import { Router } from '@angular/router'
import { environment } from '@environment/environment'
import { Observable, tap } from 'rxjs'
import { ApiResponse } from '@core/interfaces/api/api-response.interface'
import { USER_SESSION } from '@core/helpers/global/global.constants'
import * as CryptoJS from 'crypto-js'

const STORAGE_KEY_USER = 'rememberedUser'
const STORAGE_KEY_PASS = 'rememberedPass'
const SECRET_KEY = 'baseProjectKey2025!'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private _http = inject(HttpClient)
  private _storageService = inject(StorageService)
  private router = inject(Router)

  public url: string = environment.apiBaseUrl + '/auth'

  login = (request: LoginRequest): Observable<ApiResponse<LoginResponse>> => {
    const endpoint = `${this.url}/login`
    const headers = new HttpHeaders({ skip: 'skip' })
    const options = { headers }
    return this._http
      .post<ApiResponse<LoginResponse>>(endpoint, request, options)
      .pipe(
        tap((response: ApiResponse<LoginResponse>) => {
          this._storageService.secureStorage.setItem(
            USER_SESSION,
            JSON.stringify(response.data),
          )
        }),
      )
  }

  handleSsoToken(token: string): void {
    const ssoSession: Partial<LoginResponse> = { token }
    this._storageService.secureStorage.setItem(
      USER_SESSION,
      JSON.stringify(ssoSession),
    )
  }

  public getMeUser(): Observable<ApiResponse<User>> {
    return this._http.get<ApiResponse<User>>(`${this.url}/get-me-user`)
  }

  logout(): void {
    this._http.post(`${this.url}/logout`, {}).subscribe()
    this._storageService.secureStorage.removeItem(USER_SESSION)
    this.router.navigate([`/auth/login`])
  }

  public isLoggedIn(): boolean {
    const expirationDate = this.getExpiration()
    if (!expirationDate) {
      return false
    }
    return isBefore(new Date(), expirationDate)
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn()
  }

  getExpiration = () => {
    try {
      const sessionStr =
        this._storageService.secureStorage.getItem(USER_SESSION)
      if (!sessionStr) return null
      const session = JSON.parse(sessionStr)
      if (!session?.token) return null
      const { exp } = this._storageService.parseJwt(session)
      return new Date(exp * 1000)
    } catch {
      return null
    }
  }

  rememberUser(username: string, password: string) {
    localStorage.setItem(STORAGE_KEY_USER, username)
    const encryptedPass = CryptoJS.AES.encrypt(password, SECRET_KEY).toString()
    localStorage.setItem(STORAGE_KEY_PASS, encryptedPass)
  }

  getRememberedUser(): {
    username: string
    password: string
  } | null {
    const username = localStorage.getItem(STORAGE_KEY_USER)
    const encryptedPass = localStorage.getItem(STORAGE_KEY_PASS)

    if (username && encryptedPass) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedPass, SECRET_KEY)
        const decryptedPass = bytes.toString(CryptoJS.enc.Utf8)
        return { username, password: decryptedPass }
      } catch (error) {
        return null
      }
    }
    return null
  }

  clearRememberedUser() {
    localStorage.removeItem(STORAGE_KEY_USER)
    localStorage.removeItem(STORAGE_KEY_PASS)
  }

  getSsoToInvoicingUrl(): Observable<
    ApiResponse<{ redirectUrl: string }>
  > {
    return this._http.get<ApiResponse<{ redirectUrl: string }>>(
      `${this.url}/sso-to-invoicing`,
    )
  }

  getDecodedToken(): Record<string, unknown> | null {
    try {
      const sessionStr =
        this._storageService.secureStorage.getItem(USER_SESSION)
      if (!sessionStr) return null
      const session = JSON.parse(sessionStr)
      if (!session?.token) return null
      return this._storageService.parseJwt(session)
    } catch {
      return null
    }
  }
}
