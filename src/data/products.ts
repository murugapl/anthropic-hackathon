export interface Product {
  id: string
  name: string
  category: 'sleep' | 'breastfeeding' | 'recovery' | 'baby-gear' | 'mental-health'
  price: number
  buyLink: string
  freeAlternative: string
  blurb: string
  socialProof: string
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
    socialProof: 'Women in their third trimester buy this most often once side-sleeping gets uncomfortable.',
  },
  {
    id: 'silver-cups',
    name: 'Silver nursing cups',
    category: 'breastfeeding',
    price: 28,
    buyLink: '#',
    freeAlternative: 'Air-dry after each feed and apply a little of your own breast milk, which has natural healing properties.',
    blurb: 'Helps sore nipples recover faster between feeds.',
    socialProof: "A top pick for women in their first 2 weeks of breastfeeding.",
  },
  {
    id: 'recovery-kit',
    name: 'Postpartum recovery kit',
    category: 'recovery',
    price: 35,
    buyLink: '#',
    freeAlternative: 'Make your own padsicles: witch hazel and aloe vera on a maxi pad, frozen.',
    blurb: 'Padsicles, peri bottle, and soothing spray for the first weeks.',
    socialProof: 'Most ordered item before delivery — women like having this ready before the hospital bag is packed.',
  },
  {
    id: 'white-noise',
    name: 'White noise machine',
    category: 'sleep',
    price: 30,
    buyLink: '#',
    freeAlternative: 'A phone white-noise app or a fan on low works almost as well, for free.',
    blurb: 'Steadier sleep for the baby — and for you.',
    socialProof: 'Popular with parents in the newborn stage trying to stretch naps longer than 20 minutes.',
  },
  {
    id: 'belly-wrap',
    name: 'Postpartum belly wrap',
    category: 'recovery',
    price: 40,
    buyLink: '#',
    freeAlternative: 'A long scarf wrapped snugly around your midsection gives similar gentle support.',
    blurb: 'Gentle core and back support while you heal.',
    socialProof: 'Common pick in the first 6 weeks postpartum for extra core support while healing.',
  },
  {
    id: 'baby-carrier',
    name: 'Baby wrap carrier',
    category: 'baby-gear',
    price: 60,
    buyLink: '#',
    freeAlternative: 'A large piece of fabric tied in a simple wrap carry works the same way — free tutorials online.',
    blurb: 'Hands-free carrying for a fussy or clingy stretch.',
    socialProof: 'Frequently bought around week 4-8, once babies start wanting to be held more.',
  },
  {
    id: 'compression-socks',
    name: 'Compression socks',
    category: 'recovery',
    price: 18,
    buyLink: '#',
    freeAlternative: 'Elevate your feet above heart level for 15 minutes a few times a day instead.',
    blurb: 'Eases swelling, especially useful if BP has been running high.',
    socialProof: 'Often added by women whose care team mentioned keeping an eye on blood pressure or swelling.',
  },
  {
    id: 'meditation-app',
    name: 'Guided meditation app (monthly)',
    category: 'mental-health',
    price: 13,
    buyLink: '#',
    freeAlternative: 'Free guided postpartum meditations are available on YouTube and library apps like Libby.',
    blurb: 'Short, guided sessions built for exhausted new parents.',
    socialProof: 'One of the most added items during harder emotional stretches postpartum.',
  },
]
