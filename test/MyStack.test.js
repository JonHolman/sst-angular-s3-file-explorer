import { Template } from "aws-cdk-lib/assertions";
import * as sst from "@serverless-stack/resources";
import AuthStack from "../stacks/AuthStack";

test("Test Stack", () => {
  const app = new sst.App();
  // WHEN
  const stack = new AuthStack(app, "test-stack");
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties("AWS::Cognito::UserPool", {
    AdminCreateUserConfig: { AllowAdminCreateUserOnly: true },
  });
});
