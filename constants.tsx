import { Product, City, Category } from './types';

export const CITIES_LEBANON: City[] = [
  { name: 'Beirut', deliveryFee: 5 },
  { name: 'Tripoli', deliveryFee: 10 },
  { name: 'Sidon', deliveryFee: 8 },
  { name: 'Tyre', deliveryFee: 12 },
  { name: 'Byblos (Jbeil)', deliveryFee: 7 },
  { name: 'Jounieh', deliveryFee: 6 },
  { name: 'Zahle', deliveryFee: 15 },
  { name: 'Nabatieh', deliveryFee: 13 },
  { name: 'Baalbek', deliveryFee: 18 },
  { name: 'Aley', deliveryFee: 8 },
  { name: 'Chouf', deliveryFee: 10 },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Overalls' },
  { id: '2', name: 'Outfits' },
  { id: '3', name: 'Rompers' },
  { id: '4', name: 'Coats & Cardigans' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cozy Cable-Knit Overall',
    category: 'Overalls',
    price: 28,
    description: 'A luxurious, ultra-soft knit overall crafted from premium organic cotton blend. Features crossover back straps, adjustable wooden buttons, and a comfortable fit for easy movement and diaper changes. Perfect for layering in cooler weather.',
    images: [
      '/assets/images/cozy_knit_overall_1790592845130.jpg'
    ],
    specs: ['100% Organic Cotton Blend', 'Adjustable Crossback Straps', 'Genuine Wooden Buttons', 'Machine Washable (Gentle Cycle)'],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M']
  },
  {
    id: '2',
    name: 'Sage Organic Bloomer Set',
    category: 'Outfits',
    price: 32,
    description: 'This charming two-piece outfit includes a soft, relaxed-fit cotton-linen top and matching bloomer shorts. Designed in a soothing, gender-neutral sage green, it offers a sweet and airy look for warm, sunny days.',
    images: [
      '/assets/images/sage_bloomer_set_1790592855445.jpg'
    ],
    specs: ['100% GOTS Certified Cotton', 'Includes Top & Bloomer Shorts', 'Elasticated Comfort Waistband', 'Breathable & Sweat-Absorbing'],
    sizes: ['3-6M', '6-12M', '12-18M', '18-24M']
  },
  {
    id: '3',
    name: 'Teddy Bear Fleece Hoodie',
    category: 'Coats & Cardigans',
    price: 38,
    description: 'Bundle up your little one in pure comfort with this extremely cozy teddy bear fleece jacket. Complete with adorable little ears on the hood, a secure front zipper, and soft rib-knit cuffs, it keeps your baby snug on cool morning strolls.',
    images: [
      '/assets/images/teddy_bear_fleece_1790592867605.jpg'
    ],
    specs: ['Ultra-Soft Sherpa Fleece', 'Adorable Ear Hood Detail', 'Full Front Easy Zipper', 'Warm Fleece-Lined Hood'],
    sizes: ['6-12M', '12-18M', '18-24M', '2T', '3T']
  },
  {
    id: '4',
    name: 'Rust Organic Ribbed Romper',
    category: 'Rompers',
    price: 24,
    description: 'A simple, elegant ribbed bodysuit featuring a long-sleeve design in a warm, earthy rust color. Made from elastic and highly breathable organic cotton, it offers full-body snaps for hassle-free dressing and a snug, comfortable fit.',
    images: [
      '/assets/images/rust_ribbed_romper_1790592879144.jpg'
    ],
    specs: ['95% Organic Cotton, 5% Spandex', 'Super Stretchy Ribbed Knit', 'Convenient Diaper Snaps', 'Tagless Neck Label for Comfort'],
    sizes: ['0-3M', '3-6M', '6-12M', '12-18M']
  },
  {
    id: '5',
    name: 'Dusty Blue Linen Dungaree',
    category: 'Overalls',
    price: 29,
    description: 'An absolute staple for any stylish baby wardrobe. Made from premium washed linen, this dusty blue dungaree features clean crossover straps, mock front pockets, and an elasticized waist. It is lightweight, durable, and gets softer with every wash.',
    images: [
      '/assets/images/blue_linen_dungaree_1790592890215.jpg'
    ],
    specs: ['100% Pure Premium Linen', 'Durable Double-Stitched Seams', 'Adjustable Straps with Metal Slider', 'Classic European Design'],
    sizes: ['6-12M', '12-18M', '18-24M', '2T']
  }
];

export const WHATSAPP_NUMBER = '96170180409';
