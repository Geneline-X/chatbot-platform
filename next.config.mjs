/** @type {import('next').NextConfig} */
const nextConfig = {
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

        ],
      },
};

export default nextConfig;
