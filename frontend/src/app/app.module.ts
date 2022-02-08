import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular";
import { AppComponent } from "./app.component";
import { S3ViewComponent } from "./s3-view/s3-view.component";
import { MatTableModule } from "@angular/material/table";
import { HttpClientModule } from "@angular/common/http";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations: [AppComponent, S3ViewComponent],
    imports: [BrowserModule, MatProgressSpinnerModule, AmplifyAuthenticatorModule, MatTableModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
