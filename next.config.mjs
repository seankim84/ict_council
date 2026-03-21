/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/**'
  }
];

if (supabaseHostname) {
  remotePatterns.push({
    protocol: 'https',
    hostname: supabaseHostname,
    pathname: '/**'
  });
}

const nextConfig = {
  images: {
    remotePatterns
  },
  output: 'standalone'
};

export default nextConfig;
