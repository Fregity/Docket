import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://myduebird.com",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}