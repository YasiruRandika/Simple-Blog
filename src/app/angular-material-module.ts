import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
import { NgModule } from "@angular/core";

@NgModule({
  imports:[
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports:[
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule
  ]
})

export class AngularMaterialModule {
}
