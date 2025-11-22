/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  async redirects() {
    return [
      // Redirect old /challenges routes to /quizzes
      {
        source: '/challenges',
        destination: '/quizzes',
        permanent: true, // 301 permanent redirect
      },
      {
        source: '/challenges/:id',
        destination: '/quizzes/:id',
        permanent: true,
      },
      {
        source: '/challenges/results/:id',
        destination: '/quizzes/results/:id',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
