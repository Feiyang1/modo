import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  template: ''
})
export class DialogComponent implements OnInit {
  parentPath: string | undefined | null;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.parentPath = route.parent && route.parent.routeConfig && route.parent.routeConfig.path;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const component = this.route.snapshot.data['component']! as any;
    // open dialog async, otherwise we will get ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      const dialogRef = this.dialog.open(component, {
        data: {
          route: this.route
        }
      });

      dialogRef.afterClosed().subscribe(() => this.afterDialogClose());
    });
  }

  private afterDialogClose(): void {
    if (this.parentPath) {
      this.router.navigate([this.parentPath]);
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }

}
