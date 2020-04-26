import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tenantCode = sessionStorage.getItem('tenant');
        const modifiedReq = req.clone({
            headers: req.headers.set('x-tenant', tenantCode),
        });

        return next.handle(modifiedReq);
    }
}