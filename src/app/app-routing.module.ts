import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodolistsComponent } from './todolists/todolists.component';
import { SearchComponent } from './search/search.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { ListComponent } from './list/list.component';
import { AddlistComponent } from './addlist/addlist.component';
import { AddToListComponent } from './add-to-list/add-to-list.component';
import { ListContainerComponent } from './list-container/list-container.component';
import { TvDetailComponent } from './tv-detail/tv-detail.component';
import { ItemType } from './search.service';
import { DeleteListComponent } from './delete-list/delete-list.component';
import { DialogComponent } from './dialog/dialog.component';

const routes: Routes = [
  {
    path: 'mylists',
    component: TodolistsComponent,
    children: [
      {
        path: 'list/:name',
        component: ListContainerComponent,
        children: [
          {
            path: ':type/:visibility',
            component: ListComponent
          },
          {
            path: '',
            redirectTo: 'movies/all',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'addlist',
        component: DialogComponent,
        data: {
          component: AddlistComponent
        }
      },
      {
        path: 'deletelist/:name',
        component: DialogComponent,
        data: {
          component: DeleteListComponent
        }
      }
    ]
  },
  {
    path: 'search',
    redirectTo: 'search/'
  },
  {
    path: 'search/:searchterm',
    component: SearchComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent,
    children: [
      {
        path: 'addtolist',
        component: DialogComponent,
        data: {
          type: ItemType.MOVIE,
          component: AddToListComponent
        }
      }
    ]
  },
  {
    path: 'tv/:id',
    component: TvDetailComponent,
    children: [
      {
        path: 'addtolist',
        component: DialogComponent,
        data: {
          type: ItemType.TV,
          component: AddToListComponent
        }
      }
    ]
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
