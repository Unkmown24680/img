/** @type {import('next').NextConfig} */
const nextConfig = {
    // Set NEXT_PUBLIC_BASE_PATH (e.g. /imgbase) to serve the app under a sub-path;
    // leave unset for a domain-root deployment (Vercel default). Must match the
    // reverse-proxy path and NEXT_PUBLIC_BASE_URL.
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
    // Behind a sub-path proxy the browser hits /imgbase/ — without this, Next
    // 308-redirects to /imgbase and the proxy bounces it back in a loop.
    skipTrailingSlashRedirect: true,
    experimental: {
        serverActions: {
            // Server Actions body limit (not related to API route uploads)
            bodySizeLimit: '50mb',
        },
    },
    // Allow long-running upload requests in production
    // Self-hosted / Railway / VPS: no platform timeout enforced
    // Vercel Pro: respects maxDuration set per-route
    serverExternalPackages: ['telegram'],
};

module.exports = nextConfig;
