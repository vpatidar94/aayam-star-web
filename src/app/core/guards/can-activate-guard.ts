import { inject } from '@angular/core';
import {
  CanActivateFn,
} from '@angular/router';
import { ApiService } from '../services/api.service';

export const canActivateUser: CanActivateFn = () => {
  const apiService: ApiService = inject(ApiService);
  return apiService.canActivate();
};
