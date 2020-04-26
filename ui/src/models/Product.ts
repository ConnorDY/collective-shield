export default interface Product {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  packingUrl?: string;
  modelUrl?: string;
  isArchived?: boolean;
}
