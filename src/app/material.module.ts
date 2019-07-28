import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [MatTabsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatButtonToggleModule, MatInputModule, MatListModule,
        MatRippleModule, MatDialogModule],
    exports: [MatTabsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatButtonToggleModule, MatInputModule, MatListModule,
        MatRippleModule, MatDialogModule],
})
export class CustomMaterialModule { }