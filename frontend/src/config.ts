export const config = {
    environment: "{{ ENVIRONMENT }}",
    MAX_ATTACHMENT_SIZE: 10000000,
    // Backend config
    s3: {
        REGION: "{{ ANGULAR_APP_REGION }}",
        BUCKET: "{{ ANGULAR_APP_BUCKET }}",
    },
    cognito: {
        REGION: "{{ ANGULAR_APP_REGION }}",
        USER_POOL_ID: "{{ ANGULAR_APP_USER_POOL_ID }}",
        APP_CLIENT_ID: "{{ ANGULAR_APP_USER_POOL_CLIENT_ID }}",
        IDENTITY_POOL_ID: "{{ ANGULAR_APP_IDENTITY_POOL_ID }}",
    },
};
