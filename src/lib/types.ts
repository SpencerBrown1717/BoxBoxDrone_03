/** One row in a Catalog: a use, what it means, and what the sensor measures. */
export interface CatalogItem {
  id: string;
  kicker: string;
  title: string;
  text: string;
  measures?: string;
  source?: { label: string; url: string };
  link?: { label: string; href: string };
}
