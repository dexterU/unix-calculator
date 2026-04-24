'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const SITE_BASE = 'https://unixcalculator.com';
const FORCE_TRAILING_SLASH = false; // Set to true if your site uses trailing slashes

/**
 * Dynamically sets a self-referencing canonical tag for the current page.
 * - Strips tracking parameters (utm_*, fbclid, gclid, etc.)
 * - Enforces trailing slash consistency
 * - Removes hash fragments
 */
export function useCanonical(overrideUrl?: string) {
  const pathname = usePathname()

  useEffect(() => {
    let canonicalUrl: string

    if (overrideUrl) {
      canonicalUrl = overrideUrl
    } else {
      const cleanPath = stripTrackingParams(pathname)
      const normalizedPath = normalizeTrailingSlash(cleanPath)
      canonicalUrl = `${SITE_BASE}${normalizedPath}`
    }

    setCanonicalTag(canonicalUrl)
  }, [pathname, overrideUrl])
}

/**
 * Strips common tracking parameters from URL
 */
function stripTrackingParams(path: string): string {
  // List of tracking parameters to remove
  const trackingParams = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid',
    'mc_cid', 'mc_eid', 'ref', 'affiliate', 'source'
  ];

  try {
    // If path contains query string, parse and clean it
    if (path.includes('?')) {
      const [basePath, queryString] = path.split('?');
      const params = new URLSearchParams(queryString);
      
      trackingParams.forEach(param => params.delete(param));
      
      const cleanedQuery = params.toString();
      return cleanedQuery ? `${basePath}?${cleanedQuery}` : basePath;
    }
  } catch (e) {
    console.warn('Error parsing URL params:', e);
  }

  return path;
}

/**
 * Normalizes trailing slash based on site settings
 */
function normalizeTrailingSlash(path: string): string {
  // Don't modify root path
  if (path === '/' || path === '') {
    return '/';
  }

  // Remove any existing trailing slash first
  const withoutSlash = path.replace(/\/+$/, '');

  if (FORCE_TRAILING_SLASH) {
    return `${withoutSlash}/`;
  }
  
  return withoutSlash;
}

/**
 * Sets or updates the canonical link tag in document head
 */
function setCanonicalTag(url: string): void {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = url;
}

/**
 * Utility to get clean canonical URL without hook
 * Useful for SSR or static generation
 */
export function getCanonicalUrl(path: string): string {
  const cleanPath = stripTrackingParams(path);
  const normalizedPath = normalizeTrailingSlash(cleanPath);
  return `${SITE_BASE}${normalizedPath}`;
}

/**
 * Generate canonical tag HTML for static pages
 */
export function generateCanonicalTag(path: string): string {
  const url = getCanonicalUrl(path);
  return `<link rel="canonical" href="${url}" />`;
}
