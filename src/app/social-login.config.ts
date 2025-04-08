// src/app/social-login.config.ts
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const socialAuthConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '555078852596-a4cmrg9dcrru8m3p714ct642o45lhi6o.apps.googleusercontent.com'
      )
    }
  ]
};
