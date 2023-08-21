import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  currentRouteTitle: string = '';
  isLoggedIn: boolean = false;

  user$ = this.auth.user$;

  constructor(private auth: AuthService, private router: Router) {
    this.auth.user$.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.setCurrentRouteTitle(event.url);
    });
  }
  ngOnInit(): void {}

  private setCurrentRouteTitle(url: string): void {
    switch (url) {
      case '/homepage':
        this.currentRouteTitle = 'Strona Główna';
        break;
      case '/calculator':
        this.currentRouteTitle = 'Kalkulator kosztów';
        break;
      case '/samples':
        this.currentRouteTitle = 'Wzory orzeczeń';
        break;
      case '/contact':
        this.currentRouteTitle = 'Formularz';
        break;
        case '/login':
          this.currentRouteTitle = 'Logowanie';
          break;
          case '/registration':
            this.currentRouteTitle = 'Rejestracja';
            break;
            case '/forgot-password':
              this.currentRouteTitle = 'Zapomniałem Hasła';
              break;
      default:
        this.currentRouteTitle = '';
        break;
        
    }
  }
  logout() {
    this.auth.logout();
  }
}
