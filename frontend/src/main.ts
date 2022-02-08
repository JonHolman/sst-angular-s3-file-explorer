import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { config } from './config';

import Amplify, { Storage } from "aws-amplify";
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions'

if (Amplify.Predictions._identifyPluggables.length === 0)
    Amplify.addPluggable(new AmazonAIPredictionsProvider())

// console.log('config:', config);

Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: config.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        region: config.REGION,
        bucket: config.s3.BUCKET,
        identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    predictions: {
        convert: {
            translateText: {
                region: config.REGION,
                defaults: {
                    "sourceLanguage": "en",
                    "targetLanguage": "es"
                }
            },
        },
        identify: {
            identifyText: {
                region: config.REGION,
                defaults: {
                    format: "PLAIN"
                }
            },
        },
    }
});

Storage.configure({
    customPrefix: {
        public: '',
    },
})

if (config.environment === 'prod') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
