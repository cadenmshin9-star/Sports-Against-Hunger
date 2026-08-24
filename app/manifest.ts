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
        src: "/sports-against-hunger-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/sports-against-hunger-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
