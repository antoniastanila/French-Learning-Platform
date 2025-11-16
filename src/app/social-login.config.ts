// src/app/social-login.config.ts
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const socialAuthConfig: SocialAuthServiceConfig = {
  autoLogin: false,
  providers: [
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(
        '596657709262-5i5u1htr50lmd3gbfaqflh0ihsb4f4ds.apps.googleusercontent.com'
      )
    }
  ]
};
