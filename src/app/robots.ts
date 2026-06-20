import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://youtube-downloader.udaysharma.dev";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/api/download", "/api/info", "/api/github"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
