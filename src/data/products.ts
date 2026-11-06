export interface Product {
  id: string
  name: string
  category: 'sleep' | 'breastfeeding' | 'recovery' | 'baby-gear' | 'mental-health'
  price: number
  buyLink: string
  freeAlternative: string
  blurb: string
}

export const products: Product[] = [
  {
    id: 'nursing-pillow',
    name: 'Pregnancy & nursing pillow',
    category: 'sleep',
    price: 45,
    buyLink: '#',
    freeAlternative: 'Prop regular pillows behind your back and between your knees — same support, no cost.',
    blurb: 'Extra support for side-sleeping and feeding positions.',
  },
  {
    id: 'silver-cups',
    name: 'Silver nursing cups',
    category: 'breastfeeding',
    price: 28,
    buyLink: '#',
    freeAlternative: 'Air-dry after each feed and apply a little of your own breast milk, which has natural healing properties.',
    blurb: 'Helps sore nipples recover faster between feeds.',
  },
  {
    id: 'recovery-kit',
    name: 'Postpartum recovery kit',
    category: 'recovery',
    price: 35,
    buyLink: '#',
    freeAlternative: 'Make your own padsicles: witch hazel and aloe vera on a maxi pad, frozen.',
    blurb: 'Padsicles, peri bottle, and soothing spray for the first weeks.',
  },
  {
    id: 'white-noise',
    name: 'White noise machine',
    category: 'sleep',
    price: 30,
    buyLink: '#',
    freeAlternative: 'A phone white-noise app or a fan on low works almost as well, for free.',
    blurb: 'Steadier sleep for the baby — and for you.',
  },
  {
    id: 'belly-wrap',
    name: 'Postpartum belly wrap',
    category: 'recovery',
    price: 40,
    buyLink: '#',
    freeAlternative: 'A long scarf wrapped snugly around your midsection gives similar gentle support.',
    blurb: 'Gentle core and back support while you heal.',
  },
  {
    id: 'baby-carrier',
    name: 'Baby wrap carrier',
    category: 'baby-gear',
    price: 60,
    buyLink: '#',
    freeAlternative: 'A large piece of fabric tied in a simple wrap carry works the same way — free tutorials online.',
    blurb: 'Hands-free carrying for a fussy or clingy stretch.',
  },
  {
    id: 'compression-socks',
    name: 'Compression socks',
    category: 'recovery',
    price: 18,
    buyLink: '#',
    freeAlternative: 'Elevate your feet above heart level for 15 minutes a few times a day instead.',
    blurb: 'Eases swelling, especially useful if BP has been running high.',
  },
  {
    id: 'meditation-app',
    name: 'Guided meditation app (monthly)',
    category: 'mental-health',
    price: 13,
    buyLink: '#',
    freeAlternative: 'Free guided postpartum meditations are available on YouTube and library apps like Libby.',
    blurb: 'Short, guided sessions built for exhausted new parents.',
  },
]
