/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/api/items',
        destination: 'http://localhost:8000/items',
      },
      {
        source: '/api/items/:slug',
        destination: 'http://localhost:8000/items/:slug',
      },
      {
        source: '/api/users',
        destination: 'http://localhost:8000/users',
      },
      {
        source: '/api/users/:slug',
        destination: 'http://localhost:8000/users/:slug',
      },
      {
        source: '/api/categories',
        destination: 'http://localhost:8000/categories',
      },
      {
        source: '/api/items/:slug',
        destination: 'http://localhost:8000/categories/:slug',
      },
      {
        source: '/api/reviews',
        destination: 'http://localhost:8000/reviews',
      },
      {
        source: '/api/reviews/:slug',
        destination: 'http://localhost:8000/reviews/:slug',
      },
      {
        source: '/api/chatList',
        destination: 'http://localhost:8000/chatList',
      },
      {
        source: '/api/chatList/:slug',
        destination: 'http://localhost:8000/chatList/:slug',
      },
      {
        source: '/api/answers',
        destination: 'http://localhost:8000/answers',
      },
      {
        source: '/api/answers/:slug',
        destination: 'http://localhost:8000/answers/:slug',
      },
    ];
  },
};

module.exports = nextConfig;

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:
          'aws-lambda-images-418581597558.s3.ap-northeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
