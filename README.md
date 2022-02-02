# sst-angular-s3-file-explorer - backend

This is a demo angular SST app I created to show the capabilities of SST (and AWS CDK) and the AWS Amplify JS Library

Used this as my starting point: https://github.com/Manitej66/serverless-stack/tree/angular-app/examples/angular-app

With inspiration from:
- https://github.com/awslabs/aws-js-s3-explorer/tree/v2-alpha
- https://github.com/sw-yx/demo-amplify-storage-file-upload

Also removed the API Gateway and Lambda to show that this functionality can be delivered with only Cognito, Amplify, and S3.

## Useful Commands
### For local development open two terminals one for each of the following commands:
```bash
npx sst start
```
```bash
cd frontend && npm start
```

### To deploy an environment named test:
```bash
npx sst deploy --stage test
```

### To deploy production:
```bash
npx sst deploy --stage prod
```


# Original README.md below
___
# Getting Started with Serverless Stack (SST)

This project was bootstrapped with [Create Serverless Stack](https://docs.serverless-stack.com/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ npm install
```

## Commands

### `npm run start`

Starts the local Lambda development environment.

### `npm run build`

Build your app and synthesize your stacks.

Generates a `.build/` directory with the compiled files and a `.build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

### `npm run test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

Learn more about the Serverless Stack.
- [Docs](https://docs.serverless-stack.com)
- [@serverless-stack/cli](https://docs.serverless-stack.com/packages/cli)
- [@serverless-stack/resources](https://docs.serverless-stack.com/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack) or [post on our forums](https://discourse.serverless-stack.com).
