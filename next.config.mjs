/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*', // This applies the headers to all API routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*' // Allow all domains to access this API endpoint
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS' // Specify the allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization' // Specify the allowed headers
          }
        ],
      }
    ]
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
    
};

export default nextConfig;
