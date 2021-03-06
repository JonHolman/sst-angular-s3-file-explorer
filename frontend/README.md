# sst-angular-s3-file-explorer - backend

This is a demo angular [SST](https://serverless-stack.com/) app I created to show the capabilities of SST (and AWS CDK) and the [AWS Amplify JS Library](https://docs.amplify.aws/lib/q/platform/js/)

Used this as my starting point: https://github.com/Manitej66/serverless-stack/tree/angular-app/examples/angular-app

With inspiration from:
- https://github.com/awslabs/aws-js-s3-explorer/tree/v2-alpha
- https://github.com/sw-yx/demo-amplify-storage-file-upload

Also removed the API Gateway and Lambda to show that this functionality can be delivered with only Cognito, Amplify, and S3.


# Original README.md below
___
# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
