import { Directive, ComponentRef } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';

@Directive({
  selector: 'my-router-outlet'
})
export class MyRouterOutletDirective extends RouterOutlet {

  detach(): ComponentRef<any> {
    const instance: any = this.component;
    if (instance && typeof instance.onDetach === 'function') {
      instance.onDetach();
    }
    return super.detach();
  }

  attach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    super.attach(ref, activatedRoute);
    const instance: any = ref.instance;
    if (instance && typeof instance.onAttach === 'function') {
      instance.onAttach();
    }
  }

}
