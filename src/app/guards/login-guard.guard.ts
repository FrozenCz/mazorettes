import { CanActivateFn } from '@angular/router';
import {TokenService} from '../services/token.service';
export const loginGuardGuard: CanActivateFn = (route, state) => {
  return TokenService.hasValidToken();
};
