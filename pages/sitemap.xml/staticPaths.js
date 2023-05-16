import * as fs from "fs";
import { server } from "utils/utils";

export const staticPaths = fs
  .readdirSync("pages")
  .filter((staticPage) => {
    return ![
      "api",
      "_app.js",
      "_document.js",
      "404.js",
      "sitemap.xml",
      "index.js",
      "500.js",
      "hotels",
      "search",
      "faq.js",
      "search.js",
      "about-us",
    ].includes(staticPage);
  })
  .map((staticPagePath) => {
    return { url: `${server}/${staticPagePath.split(".js")[0]}/`, date: null };
  });

export const staticPathsUk = fs
  .readdirSync("pages")
  .filter((staticPage) => {
    return ![
      "api",
      "_app.js",
      "_document.js",
      "404.js",
      "sitemap.xml",
      "index.js",
      "500.js",
      "hotels",
      "search",
      "faq.js",
      "search.js",
      "about-us",
    ].includes(staticPage);
  })
  .map((staticPagePath) => {
    return {
      url: `${server}/uk/${staticPagePath.split(".js")[0]}/`,
      date: null,
    };
  });
