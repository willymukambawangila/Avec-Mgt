/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  images: {
    domains: ['example.com', 'another-example.com'], // Add your domain names here
  },
  env: {
    CUSTOM_ENV_VAR: 'your_value', // Replace with your actual environment variable values
  },
};

module.exports = nextConfig;