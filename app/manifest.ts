import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sports Against Hunger",
    short_name: "SAH",
    description:
      "Turn verified game-day achievements into support for local families.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#101814",
    theme_color: "#101814",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
