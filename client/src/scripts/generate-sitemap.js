const fs = require('fs');
const path = require('path');

// Saidi URL
const siteUrl = 'https://www.irontrack.ee';

// Lisa kõik oma lehe URL-id
const pages = [
    '/',
    '/pricing',

    // Lisa siia rohkem lehti
];

// Loo sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(page => {
        return `
    <url>
      <loc>${siteUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>${page === '/' ? '1.0' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

// Kirjuta fail
fs.writeFileSync(path.resolve('./public/sitemap.xml'), sitemap);
console.log('Sitemap generated!');