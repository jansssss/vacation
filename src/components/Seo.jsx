import { useEffect } from "react";
import { SITE_CONFIG } from "../config/siteConfig";

const ensureMetaTag = (attr, key) => {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  return tag;
};

const setMeta = (key, content) => {
  const tag = ensureMetaTag("name", key);
  tag.setAttribute("content", content);
};

const setMetaProperty = (key, content) => {
  const tag = ensureMetaTag("property", key);
  tag.setAttribute("content", content);
};

const setCanonical = (href) => {
  let link = document.querySelector("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const syncJsonLd = (schemas) => {
  document
    .querySelectorAll("script[data-seo='jsonld']")
    .forEach((node) => node.parentNode.removeChild(node));

  schemas.filter(Boolean).forEach((schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "jsonld");
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

const Seo = ({ title, description, path = "/", image, robots = "index,follow", jsonLd = [] }) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_CONFIG.siteName}`
      : SITE_CONFIG.defaultTitle;
    const metaDescription = description || SITE_CONFIG.defaultDescription;
    const canonical = `${SITE_CONFIG.baseUrl}${path}`;
    const metaImage = image || SITE_CONFIG.defaultImage;

    document.title = fullTitle;

    setMeta("description", metaDescription);
    setMeta("robots", robots);

    setMetaProperty("og:title", fullTitle);
    setMetaProperty("og:description", metaDescription);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:url", canonical);
    setMetaProperty("og:image", metaImage);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", metaDescription);
    setMeta("twitter:image", metaImage);

    setCanonical(canonical);
    syncJsonLd(Array.isArray(jsonLd) ? jsonLd : [jsonLd]);
  }, [title, description, path, image, robots, jsonLd]);

  return null;
};

export default Seo;
