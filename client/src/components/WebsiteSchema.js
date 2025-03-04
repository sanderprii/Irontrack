// src/components/WebsiteSchema.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const WebsiteSchema = ({ siteUrl, name, description }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: siteUrl,
        name: name,
        description: description
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};

export default WebsiteSchema;