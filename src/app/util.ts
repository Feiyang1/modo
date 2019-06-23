import { ActivatedRoute, Params } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ItemType } from './search.service';

export function routeParams$(route: ActivatedRoute): Observable<Params> {
    return combineLatest(route.pathFromRoot.map(rt => rt.params)).pipe(map((rp: Params[]) => Object.assign({}, ...rp)));
}

export function routeParams(route: ActivatedRoute): Params {
    const params = route.pathFromRoot.map(rt => {
        const keys = rt.snapshot.paramMap.keys;
        return Object.assign({}, ...keys.map(key => ({ [key]: rt.snapshot.paramMap.get(key) })));
    });
    return Object.assign({}, ...params);
}

export function posterPath(tmdbPartialPath: string, size = 'original') {
    return `https://image.tmdb.org/t/p/${size}${tmdbPartialPath}`;
}

export function todoArrayName(itemType: ItemType) {
    return itemType === ItemType.MOVIE ? 'movies' : 'tvs';
}