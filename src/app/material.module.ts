import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';



@NgModule({
    imports: [MatTabsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatButtonToggleModule],
    exports: [MatTabsModule, MatToolbarModule, MatMenuModule, MatButtonModule, MatButtonToggleModule],
})
export class CustomMaterialModule { }