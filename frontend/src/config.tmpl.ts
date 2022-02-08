export const config = {
    environment: "{{ ENVIRONMENT }}",
    MAX_ATTACHMENT_SIZE: 10000000,
    // Backend config
    REGION: "{{ ANGULAR_APP_REGION }}",
    s3: {
        BUCKET: "{{ ANGULAR_APP_BUCKET }}",
    },
    cognito: {
        USER_POOL_ID: "{{ ANGULAR_APP_USER_POOL_ID }}",
        APP_CLIENT_ID: "{{ ANGULAR_APP_USER_POOL_CLIENT_ID }}",
        IDENTITY_POOL_ID: "{{ ANGULAR_APP_IDENTITY_POOL_ID }}",
    },
};
