export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  direction?: string;
  legal?: string;
  address: string;
  ward?: string;
  district?: string;
  city?: string;
  images: string[];
  highlights?: string[];
  postedAt: string;
}
