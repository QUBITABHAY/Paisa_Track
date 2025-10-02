import { OAuth2Client } from 'google-auth-library';

class GoogleAuthService {
  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(idToken) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      return ticket.getPayload();
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new Error('Invalid Google token');
    }
  }

  async getUserProfile(idToken) {
    try {
      const payload = await this.verifyIdToken(idToken);
      
      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        emailVerified: payload.email_verified,
        locale: payload.locale
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  validateConfig() {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('GOOGLE_CLIENT_ID is not configured');
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      throw new Error('GOOGLE_CLIENT_SECRET is not configured');
    }

    return true;
  }
}

export default new GoogleAuthService();
