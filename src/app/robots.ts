import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin','/profile','/content-generator'] }],
    sitemap: 'https://unixcalculator.com/sitemap.xml',
  }
}
