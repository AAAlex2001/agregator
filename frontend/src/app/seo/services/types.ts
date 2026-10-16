/** Тексты и адреса одной услуги для метаданных страницы и JSON-LD. */
export interface ServicePageSeo {
  title: string;
  description: string;
  keywords: string[];
  path: string;
  image: string;
  imageAlt: string;
  serviceType: string;
}
