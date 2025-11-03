// Vercel Serverless Function untuk Blog API
import { createClient } from 'contentful'

// Fallback data jika Contentful belum setup
const fallbackBlogData = [
  {
    id: '1',
    title: 'Transformasi Digital: Kunci Sukses Bisnis di Era Modern',
    content: 'Transformasi digital bukan lagi pilihan, melainkan keharusan bagi bisnis yang ingin bertahan dan berkembang di era modern. Lumakara membantu bisnis Anda melakukan transformasi digital yang tepat sasaran.',
    image: '/assets/img/blog/blog_01.png',
    author: 'Tim Lumakara',
    date: '2024-11-04T10:00:00Z',
    slug: 'transformasi-digital-kunci-sukses-bisnis',
    category: 'Digital Transformation',
    tags: ['digital transformation', 'business strategy', 'technology']
  },
  {
    id: '2',
    title: 'Strategi Digital Marketing yang Efektif untuk UMKM',
    content: 'UMKM (Usaha Mikro, Kecil, dan Menengah) merupakan tulang punggung ekonomi Indonesia. Di era digital ini, UMKM perlu mengadopsi strategi digital marketing yang tepat untuk dapat bersaing dan berkembang.',
    image: '/assets/img/blog/blog_02.png',
    author: 'Tim Lumakara',
    date: '2024-11-03T09:00:00Z',
    slug: 'strategi-digital-marketing-efektif-umkm',
    category: 'Digital Marketing',
    tags: ['UMKM', 'digital marketing', 'social media', 'small business']
  },
  {
    id: '3',
    title: 'Membangun Brand Identity yang Kuat dan Memorable',
    content: 'Brand identity yang kuat adalah fondasi dari setiap bisnis yang sukses. Lebih dari sekedar logo dan warna, brand identity mencerminkan nilai, kepribadian, dan promise yang Anda berikan kepada customer.',
    image: '/assets/img/blog/blog_03.png',
    author: 'Tim Lumakara',
    date: '2024-11-02T08:00:00Z',
    slug: 'membangun-brand-identity-kuat-memorable',
    category: 'Branding',
    tags: ['branding', 'brand identity', 'visual identity', 'brand strategy']
  }
]

// Initialize Contentful client (optional)
let client = null
if (process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TO