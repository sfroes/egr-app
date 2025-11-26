import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Interface for the login request body based on docs/login-component.md
export interface LoginRequest {
  nome: string;
  numeroAcademico?: string;
  dataNascimento: string;
  cursoId: string;
  anoUltimaMatricula?: string;
  semestreUltimaMatriculaId?: string;
  turnoId?: string;
}

// Interface for the login response
export interface LoginResponse {
  success: boolean;
  token?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Using a placeholder API URL. In a real app, this would be in environment.ts
  private apiUrl = '/api/auth/login';

  constructor(private http: HttpClient) { }

  /**
   * Performs the login operation by sending user credentials to the backend.
   * For now, it returns a mock success response.
   * @param credentials The user's login data.
   * @returns An Observable of the LoginResponse.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Attempting to log in with:', credentials);
    
    // MOCK IMPLEMENTATION
    // In a real scenario, we would make an HTTP POST request:
    // return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
    //   tap(response => {
    //     if (response.success && response.token) {
    //       localStorage.setItem('authToken', response.token);
    //     }
    //   }),
    //   catchError(this.handleError)
    // );

    // Returning a mock successful response for frontend development
    const mockResponse: LoginResponse = {
      success: true,
      token: 'mock-jwt-token-for-development',
      message: 'Login bem-sucedido (Mock)'
    };

    localStorage.setItem('authToken', mockResponse.token!);
    
    return of(mockResponse);
  }

  /**
   * Handles HTTP errors.
   * In a real app, you would have more robust error handling (e.g., logging to a remote service).
   */
  private handleError(error: any): Observable<any> {
    console.error('An error occurred during login:', error);
    
    const mockErrorResponse: LoginResponse = {
      success: false,
      message: 'Credenciais inválidas (Mock)'
    };
    
    return of(mockErrorResponse);
  }

  /**
   * Checks if the user is authenticated.
   * @returns True if an auth token exists, false otherwise.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Logs the user out by removing the auth token.
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
