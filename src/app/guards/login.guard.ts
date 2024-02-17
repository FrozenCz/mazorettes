import {CanActivateFn} from '@angular/router';
import {TokenService} from '../services/token.service';
export const loginGuard: CanActivateFn = (route, state) => {
  return TokenService.hasValidToken();
};

export const mainAccount: CanActivateFn = (route, state) => {
  return TokenService.hasValidToken() && !TokenService.refereeSelected();
};
