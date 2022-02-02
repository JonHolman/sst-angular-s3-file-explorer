import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular";
import { AppComponent } from "./app.component";
import { S3ViewComponent } from "./s3-view/s3-view.component";
import { MatTableModule } from "@angular/material/table";

@NgModule({
    declarations: [AppComponent, S3ViewComponent],
    imports: [BrowserModule, AmplifyAuthenticatorModule, MatTableModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
