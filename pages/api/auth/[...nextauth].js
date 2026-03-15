import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      id: 'googleonetap',
      credentials: { credential: { type: 'text' } },
      async authorize(credentials) {
        const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credentials.credential}`);
        const payload = await res.json();

        if (!res.ok || payload.aud !== process.env.GOOGLE_ID) {
          throw new Error('Invalid Google token');
        }

        return {
          id: payload.sub,
          name: payload.name,
          email: payload.email,
          image: payload.picture,
        };
      },
    }),
  ],
};

export default (req, res) => NextAuth(req, res, options);
