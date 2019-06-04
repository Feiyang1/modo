import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TodolistsComponent } from './todolists/todolists.component';
import { SearchComponent } from './search/search.component';
import { HttpClientModule }    from '@angular/common/http';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ListComponent } from './list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    TodolistsComponent,
    SearchComponent,
    MovieDetailComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
