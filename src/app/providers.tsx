'use client';

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    // Sub-path bridge: Next's basePath prefixes routing/assets, but raw
    // client calls (fetch/XHR in pages, next-auth internals) use root-absolute
    // paths. Rewrite them once here instead of editing every call site.
    // ponytail: single wrapper; if the app ever moves to a domain root this
    // becomes a no-op (NEXT_PUBLIC_BASE_PATH unset).
    useEffect(() => {
        const bp = process.env.NEXT_PUBLIC_BASE_PATH;
        if (!bp) return;
        const prefixed = (url: RequestInfo | URL): RequestInfo | URL =>
            typeof url === 'string' && url.startsWith('/') && !url.startsWith(bp) ? bp + url : url;
        const origFetch = window.fetch.bind(window);
        window.fetch = ((input: RequestInfo | URL, init?: RequestInit) =>
            origFetch(prefixed(input), init)) as typeof window.fetch;
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (...args: unknown[]) {
            if (typeof args[1] === 'string') args[1] = prefixed(args[1]);
            // @ts-expect-error — deliberate widening of the open() overload for the path bridge
            return origOpen.apply(this, args);
        } as typeof XMLHttpRequest.prototype.open;
    }, []);
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
