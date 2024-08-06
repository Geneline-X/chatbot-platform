/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      missingSuspenseWithCSRBailout: false,
    },
    async redirects(){
        return [
         {
             source: "/sign-in",
             destination: "/api/auth/login",
             permanent: true
         },
         {
             source: "/sign-up",
             destination: "/api/auth/register",
             permanent: true
         },
         {
             source: "/sign-out",
             destination: "/api/auth/logout",
             permanent: true
         }
        ]
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'uploadthing-prod.s3.us-west-2.amazonaws.com',
            port: '',
            pathname: '/*',
          },
          {
            protocol: 'https',
            hostname: 'gravatar.com/avatar',
            port: '',
            pathname: '/*',
          },
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/f/**',
          },

        ],
    },
    reactStrictMode: true,
    async headers() {
      return [
        {
          source: '/chat-widget',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'ALLOW-FROM *' // Allow embedding from any domain (modify as needed for security)
            },
            {
              key: 'Content-Security-Policy',
              value: "frame-ancestors 'self' *;" // Modify as needed for security
            }
          ]
        }
      ]
    }
};

export default nextConfig;
