import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

const routeCache = new Map<string, RouteStorageObject>();

export class CustomReuseStrategy implements RouteReuseStrategy {
    private acceptedRoutes = ['search/:searchterm'];


    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // check to see if the route's path is in our acceptedRoutes array
        if (this.acceptedRoutes.indexOf((route.routeConfig && route.routeConfig.path) as any) > -1) {
            return true;
        } else {
            return false;
        }
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

        console.log("store:", handle, "into: ", routeCache);
        // routes are stored by path - the key is the path name, and the handle is stored under it so that you can only ever have one object stored for a single path
        routeCache.set(route.routeConfig!.path!, {
            snapshot: route,
            handle
        });
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // this will be true if the route has been stored before
        return !!route.routeConfig && !!routeCache.has(route.routeConfig.path!);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {

        // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
        if (!route.routeConfig || !routeCache.has(route.routeConfig.path!)) {
            return null;
        }

        console.log("retrieving", "return: ", routeCache.get(route.routeConfig.path!), route.url);

        /** returns handle when the route.routeConfig.path is already stored */
        return routeCache.get(route.routeConfig.path!)!.handle;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }
}

interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}


export function getCachedRoute(route: string): RouteStorageObject | null {
    return routeCache.get(route) || null;
}