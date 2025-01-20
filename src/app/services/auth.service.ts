import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authKey: string | null = null;

  setAuthKey(key: string): void {
    this.authKey = key;
    localStorage.setItem('authKey', key);
  }

  getAuthKey(): string | null {
    return this.authKey || localStorage.getItem('authKey');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthKey();
  }
}
