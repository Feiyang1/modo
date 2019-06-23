import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
    private acceptedRoutes = ['search'];
    private routeCache = new Map<string, DetachedRouteHandle>();

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // check to see if the route's path is in our acceptedRoutes array
        if (this.acceptedRoutes.indexOf((route.routeConfig && route.routeConfig.path) as any) > -1) {
            return true;
        } else {
            return false;
        }
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {

        console.log("store:", handle, "into: ", this.routeCache);
        // routes are stored by path - the key is the path name, and the handle is stored under it so that you can only ever have one object stored for a single path
        this.routeCache.set(route.routeConfig!.path!, handle);
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        // this will be true if the route has been stored before
        return !!route.routeConfig && !!this.routeCache.has(route.routeConfig.path!);
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {

        // return null if the path does not have a routerConfig OR if there is no stored route for that routerConfig
        if (!route.routeConfig || !this.routeCache.has(route.routeConfig.path!)) {
            return null;
        }

        console.log("retrieving", "return: ", this.routeCache.get(route.routeConfig.path!));

        /** returns handle when the route.routeConfig.path is already stored */
        return this.routeCache.get(route.routeConfig.path!)!;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

}