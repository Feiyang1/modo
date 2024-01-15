import { Component, inject } from '@angular/core';
import { Auth, user, signInWithRedirect, GoogleAuthProvider } from '@angular/fire/auth';
import { getCachedRoute } from './route-reuse-strategy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'modo';
  private auth: Auth = inject(Auth)
  user$ = user(this.auth);
  constructor() { }

  ngOnInit() {
  }

  login(): void {
    signInWithRedirect(this.auth, new GoogleAuthProvider());
  }

  logout(): void {
    this.auth.signOut();
  }

  // if a cached search is found, navigate to it
  // The cached search component would be rendered, which would have the search term and search result 
  // user searched last time. 
  searchUrl() {
    const cachedRoute = getCachedRoute('search/:searchterm');
    if (!cachedRoute) {
      return '/search';
    }

    const cachedSearchTerm = cachedRoute.snapshot.paramMap.get('searchterm')!;
    return `/search/${cachedSearchTerm}`;
  }
}
