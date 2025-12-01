import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard de autenticação para proteger rotas
 * Verifica se o usuário está autenticado antes de permitir acesso
 * Se não estiver autenticado, redireciona para a tela de login
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redireciona para login se não estiver autenticado
  // Salva a URL que o usuário tentou acessar para redirecionar depois
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};
