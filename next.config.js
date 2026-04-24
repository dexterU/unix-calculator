/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/tools/unix-timestamp-converter',
        destination: '/tools/timestamp-converter',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
