import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router, NavigationEnd, UrlSegment } from '@angular/router';
import { filter,map } from 'rxjs/operators';

const routes = {
  '/homepage':'Strona Główna',
  '/calculator': 'Kalkulator kosztów',
  '/samples': 'Wzory orzeczeń',
  '/contact': 'Formularz',
  '/login':'Logowanie',
  '/registration':'Rejestracja',
  '/forgot-password':'Zapomniałem Hasła',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  currentRouteTitle: string = '';
  isLoggedIn: boolean = false;

  user$ = this.auth.user$;
  title$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd),map((event) => {if (event instanceof NavigationEnd) {
        const routePath = '/' + this.extractRoutePath(event.url);
        return routes[routePath] || '';
      }
      return '';
    })
  );

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }
  ngOnInit(): void {}

  private extractRoutePath(url: string): string {
    const urlSegments: UrlSegment[] = this.router.parseUrl(url).root.children['primary'].segments;
    return urlSegments.map(segment => segment.path).join('/');
  }
  
  logout() {
    this.auth.logout();
  }
  }

