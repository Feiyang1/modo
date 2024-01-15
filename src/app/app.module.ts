import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TodolistsComponent } from './todolists/todolists.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ListComponent } from './list/list.component';
import { AddlistComponent } from './addlist/addlist.component';
import { AddToListComponent } from './add-to-list/add-to-list.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { ListContainerComponent } from './list-container/list-container.component';
import { TvDetailComponent } from './tv-detail/tv-detail.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './route-reuse-strategy';
import { PaginationComponent } from './pagination/pagination.component';
import { DeleteListComponent } from './delete-list/delete-list.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './material.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MyRouterOutletDirective } from './my-router-outlet.directive';
import { TodolistsItemComponent } from './todolists-item/todolists-item.component';
import { DialogComponent } from './dialog/dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    TodolistsComponent,
    SearchComponent,
    MovieDetailComponent,
    ListComponent,
    AddlistComponent,
    AddToListComponent,
    ListContainerComponent,
    TvDetailComponent,
    PaginationComponent,
    DeleteListComponent,
    MyRouterOutletDirective,
    TodolistsItemComponent,
    DialogComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true }),
    BrowserAnimationsModule,
    CustomMaterialModule,
    ScrollingModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
