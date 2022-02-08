const { writeFile } = require('fs');

const targetPath = `./src/config.ts`;

const environmentFileContent =
    `export const config = {
    environment: "${process.env['ENVIRONMENT']}",
    MAX_ATTACHMENT_SIZE: 10000000,
    // Backend config
    REGION: "${process.env['ANGULAR_APP_REGION']}",
    s3: {
        BUCKET: "${process.env['ANGULAR_APP_BUCKET']}",
    },
    cognito: {
        USER_POOL_ID: "${process.env['ANGULAR_APP_USER_POOL_ID']}",
        APP_CLIENT_ID: "${process.env['ANGULAR_APP_USER_POOL_CLIENT_ID']}",
        IDENTITY_POOL_ID: "${process.env['ANGULAR_APP_IDENTITY_POOL_ID']}",
    },
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: unknown) {
    if (err) {
        console.log(err);
    }
    console.log(`Wrote variables to ${targetPath}`);
});
