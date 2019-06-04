import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodolistsComponent } from './todolists/todolists.component';
import { SearchComponent } from './search/search.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'mylists',
    component: TodolistsComponent,
    children: [
      {
        path: 'list/:id',
        component: ListComponent
      }
    ]
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent
  },
  {
    path: '',
    redirectTo: 'mylists',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
