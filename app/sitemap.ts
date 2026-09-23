import type { MetadataRoute } from 'next';
import { dreamContents } from '@/data/dreams';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const paths = ['', '/about', '/privacy', '/terms', '/disclaimer', '/contact', ...Object.keys(dreamContents).map((slug) => `/dreams/${slug}`)];
  return paths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: new Date('2026-09-23'),
    changeFrequency: index === 0 ? 'weekly' : 'monthly',
    priority: index === 0 ? 1 : path.startsWith('/dreams') ? 0.8 : 0.5,
  }));
}
