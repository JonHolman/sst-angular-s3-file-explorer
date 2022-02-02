import AuthStack from "./AuthStack";
import StorageStack from "./StorageStack";
import FrontendStack from "./FrontendStack";

export default function main(app) {
  const storageStack = new StorageStack(app, "storage");

  const authStack = new AuthStack(app, "auth", {
    bucket: storageStack.bucket,
  });

  new FrontendStack(app, "frontend", {
    auth: authStack.auth,
    bucket: storageStack.bucket,
  });
}
