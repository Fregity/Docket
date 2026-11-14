import type { MetadataRoute } from "next";

const baseUrl = "https://myduebird.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/demo`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
