import * as sst from "@serverless-stack/resources";

export default class FrontendStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { auth, bucket } = props;

    // Deploy our Angular app
    const site = new sst.StaticSite(this, "AngularSite", {
      path: "frontend",
      buildOutput: "dist",
      buildCommand: "cp src/config.tmpl.ts src/config.ts && ng build --output-path dist",
      errorPage: sst.StaticSiteErrorOptions.REDIRECT_TO_INDEX_PAGE,
      // These environment variables are used in frontend/scripts/createLocalConfig.ts to support local development
      environment: {
        ENVIRONMENT: scope.stage,
        ANGULAR_APP_REGION: scope.region,
        ANGULAR_APP_BUCKET: bucket.bucketName,
        ANGULAR_APP_USER_POOL_ID: auth.cognitoUserPool.userPoolId,
        ANGULAR_APP_IDENTITY_POOL_ID: auth.cognitoCfnIdentityPool.ref,
        ANGULAR_APP_USER_POOL_CLIENT_ID:
          auth.cognitoUserPoolClient.userPoolClientId,
      },
      // These replacement values are used for deployments
      replaceValues: [
        {
          files: "**/*.js",
          search: "{{ ENVIRONMENT }}",
          replace: scope.stage,
        },
        {
          files: "**/*.js",
          search: "{{ ANGULAR_APP_REGION }}",
          replace: scope.region,
        },
        {
          files: "**/*.js",
          search: "{{ ANGULAR_APP_BUCKET }}",
          replace: bucket.bucketName,
        },
        {
          files: "**/*.js",
          search: "{{ ANGULAR_APP_USER_POOL_ID }}",
          replace: auth.cognitoUserPool.userPoolId,
        },
        {
          files: "**/*.js",
          search: "{{ ANGULAR_APP_IDENTITY_POOL_ID }}",
          replace: auth.cognitoCfnIdentityPool.ref,
        },
        {
          files: "**/*.js",
          search: "{{ ANGULAR_APP_USER_POOL_CLIENT_ID }}",
          replace: auth.cognitoUserPoolClient.userPoolClientId,
        }
      ],
    });

    // Show the Site URL in the output
    this.addOutputs({
      SiteUrl: site.customDomainUrl || site.url
    });
  }
}
