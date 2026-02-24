import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { TokenService } from 'src/app/core/services/tokenservice/token.service';
import { Role } from 'src/app/role/role.enum';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if user role matches required roles', () => {
    const routeSnapshot: any = { data: { roles: ['admin'] } };
    tokenService.getUserRole.and.returnValue('admin' as Role);

    expect(guard.canActivate(routeSnapshot, {} as any)).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny activation if user role does not match required roles', () => {
    const routeSnapshot: any = { data: { roles: ['admin'] } };
    tokenService.getUserRole.and.returnValue('user' as Role);

    expect(guard.canActivate(routeSnapshot, {} as any)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
  });

  it('should deny activation if user role is not set', () => {
    const routeSnapshot: any = { data: { roles: ['admin'] } };
    tokenService.getUserRole.and.returnValue(null);

    expect(guard.canActivate(routeSnapshot, {} as any)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/access-denied']);
  });
});
 