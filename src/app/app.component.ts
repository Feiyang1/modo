import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'modo';
  user$: Observable<any>;
  constructor(private afAuth: AngularFireAuth){}

  ngOnInit() {
    this.user$ = this.afAuth.user;
    this.user$.subscribe(val => {
      console.log('user$', val);
    })
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }
}
