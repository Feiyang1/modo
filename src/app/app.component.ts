import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { getCachedRoute } from './route-reuse-strategy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'modo';
  user$: Observable<any>;
  constructor(private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.user$ = this.afAuth.user;
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
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
