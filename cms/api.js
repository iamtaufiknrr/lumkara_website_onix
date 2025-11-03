// Lumakara CMS API - Simple JavaScript API for content management
class LumakaraAPI {
    constructor() {
        this.baseKey = 'lumakara_';
    }

    // Get all blog posts
    getBlogPosts(limit = null) {
        const posts = JSON.parse(localStorage.getItem(this.baseKey + 'blog') || '[]');
        return limit ? posts.slice(0, limit) : posts;
    }

    // Get single blog post by slug
    getBlogPost(slug) {
        const posts = this.getBlogPosts();
        return posts.find(post => post.slug === slug);
    }

    // Get all services
    getServices(category = null) {
        const services = JSON.parse(localStorage.getItem(this.baseKey + 'services') || '[]');
        return category ? services.filter(service => service.category === category) : services;
    }

    // Get single service by id
    getService(id) {
        const services = this.getServices();
        return services.find(service => service.id === parseInt(id));
    }

    // Get all projects
    getProjects(limit = null) {
        const projects = JSON.parse(localStorage.getItem(this.baseKey + 'projects') || '[]');
        return limit ? projects.slice(0, limit) : projects;
    }

    // Get team members
    getTeamMembers() {
        return JSON.parse(localStorage.getItem(this.baseKey + 'team') || '[]');
    }

    // Get shop products
    getShopProducts(category = null) {
        const products = JSON.parse(localStorage.getItem(this.baseKey + 'shop') || '[]');
        return category ? products.filter(product => product.category === category) : products;
    }

    // Get career positions
    getCareerPositions() {
        return JSON.parse(localStorage.getItem(this.baseKey + 'career') || '[]');
    }

    // Get settings
    getSettings() {
        return JSON.parse(localStorage.getItem(this.baseKey + 'settings') || '{}');
    }

    // Search functionality
    search(query, type = 'all') {
        const results = [];
        query = query.toLowerCase();

        if (type === 'all' || type === 'blog') {
            const blogPosts = this.getBlogPosts();
            blogPosts.forEach(post => {
                if (post.title.toLowerCase().includes(query) || 
                    post.content.toLowerCase().includes(query) ||
                    post.tags.some(tag => tag.toLowerCase().includes(query))) {
                    results.push({...post, type: 'blog'});
                }
            });
        }

        if (type === 'all' || type === 'services') {
            const services = this.getServices();
            services.forEach(service => {
                if (service.name.toLowerCase().includes(query) || 
                    service.description.toLowerCase().includes(query)) {
                    results.push({...service, type: 'service'});
                }
            });
        }

        return results;
    }

    // Initialize default Lumakara content
    initializeDefaultContent() {
        // Default blog posts
        const defaultBlog = [
            {
                id: 1,
                title: "Mengapa Lumakara adalah Partner Digital Terbaik untuk Bisnis Anda",
                content: `<p>Di era digital yang terus berkembang pesat, setiap bisnis membutuhkan partner yang dapat diandalkan untuk transformasi digital mereka. Lumakara hadir sebagai solusi komprehensif untuk semua kebutuhan digital bisnis Anda.</p>

<h3>Keunggulan Lumakara</h3>
<ul>
<li><strong>Expertise yang Terpercaya:</strong> Tim ahli dengan pengalaman lebih dari 10 tahun di industri digital</li>
<li><strong>Solusi Terintegrasi:</strong> Dari website development hingga digital marketing strategy</li>
<li><strong>Hasil yang Terukur:</strong> Setiap project dilengkapi dengan analytics dan reporting yang detail</li>
<li><strong>Support 24/7:</strong> Tim support yang siap membantu kapan saja Anda membutuhkan</li>
</ul>

<h3>Layanan Unggulan Kami</h3>
<p>Lumakara menyediakan berbagai layanan digital yang dapat disesuaikan dengan kebutuhan bisnis Anda:</p>
<ul>
<li>Website Development & Design</li>
<li>Digital Marketing Strategy</li>
<li>E-commerce Solutions</li>
<li>Business Automation</li>
<li>Mobile App Development</li>
</ul>

<p>Dengan pendekatan yang personal dan solusi yang inovatif, Lumakara siap membantu bisnis Anda mencapai target digital yang diimpikan.</p>`,
                image: "assets/images/blog/lumakara-digital-partner.jpg",
                category: "Business Strategy",
                author: "Tim Lumakara",
                tags: ["digital transformation", "business strategy", "lumakara"],
                date: new Date().toISOString(),
                slug: "lumakara-partner-digital-terbaik-bisnis"
            },
            {
                id: 2,
                title: "Strategi Digital Marketing yang Efektif untuk UMKM Indonesia",
                content: `<p>UMKM (Usaha Mikro, Kecil, dan Menengah) merupakan tulang punggung ekonomi Indonesia. Di era digital ini, UMKM perlu mengadopsi strategi digital marketing yang tepat untuk dapat bersaing dan berkembang.</p>

<h3>Tantangan UMKM di Era Digital</h3>
<p>Banyak UMKM yang masih menghadapi kendala dalam mengimplementasikan digital marketing, seperti:</p>
<ul>
<li>Keterbatasan budget untuk marketing</li>
<li>Kurangnya pengetahuan tentang digital marketing</li>
<li>Tidak memiliki tim yang dedicated untuk digital marketing</li>
<li>Kesulitan mengukur ROI dari aktivitas digital marketing</li>
</ul>

<h3>Solusi Digital Marketing untuk UMKM</h3>
<p>Lumakara memahami tantangan yang dihadapi UMKM. Oleh karena itu, kami menyediakan solusi digital marketing yang terjangkau dan efektif:</p>

<h4>1. Social Media Marketing</h4>
<p>Manfaatkan platform media sosial seperti Instagram, Facebook, dan TikTok untuk menjangkau target audience yang lebih luas.</p>

<h4>2. Google My Business Optimization</h4>
<p>Optimalkan profil Google My Business untuk meningkatkan visibility di pencarian lokal.</p>

<h4>3. Content Marketing</h4>
<p>Buat konten yang valuable dan engaging untuk membangun trust dengan audience.</p>

<h4>4. WhatsApp Business</h4>
<p>Gunakan WhatsApp Business untuk customer service dan sales yang lebih personal.</p>

<p>Dengan strategi yang tepat dan implementasi yang konsisten, UMKM dapat meningkatkan brand awareness, customer engagement, dan tentunya penjualan.</p>`,
                image: "assets/images/blog/digital-marketing-umkm.jpg",
                category: "Digital Marketing",
                author: "Tim Lumakara",
                tags: ["UMKM", "digital marketing", "social media", "small business"],
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                slug: "strategi-digital-marketing-efektif-umkm-indonesia"
            },
            {
                id: 3,
                title: "Tren Website Development 2024: Yang Perlu Anda Ketahui",
                content: `<p>Industri web development terus berkembang dengan pesat. Tahun 2024 membawa berbagai tren baru yang akan mempengaruhi cara kita membangun dan menggunakan website.</p>

<h3>Tren Utama Website Development 2024</h3>

<h4>1. AI-Powered Websites</h4>
<p>Integrasi AI dalam website semakin populer, mulai dari chatbot yang lebih intelligent hingga personalisasi konten berdasarkan behavior user.</p>

<h4>2. Progressive Web Apps (PWA)</h4>
<p>PWA memberikan pengalaman seperti native app namun melalui browser, dengan fitur offline capability dan push notifications.</p>

<h4>3. Voice Search Optimization</h4>
<p>Dengan semakin populernya voice assistant, website perlu dioptimasi untuk voice search queries.</p>

<h4>4. Sustainable Web Design</h4>
<p>Fokus pada efisiensi energi dan sustainability dalam web development menjadi semakin penting.</p>

<h4>5. Advanced Animations & Interactions</h4>
<p>Micro-interactions dan animations yang smooth meningkatkan user experience secara signifikan.</p>

<h3>Teknologi yang Wajib Dikuasai</h3>
<ul>
<li><strong>Frontend:</strong> React, Vue.js, Next.js</li>
<li><strong>Backend:</strong> Node.js, Python, Go</li>
<li><strong>Database:</strong> MongoDB, PostgreSQL</li>
<li><strong>Cloud:</strong> AWS, Google Cloud, Vercel</li>
<li><strong>Tools:</strong> Docker, Kubernetes, CI/CD</li>
</ul>

<p>Lumakara selalu mengikuti perkembangan teknologi terbaru untuk memastikan website yang kami develop menggunakan best practices dan teknologi terdepan.</p>`,
                image: "assets/images/blog/website-development-trends-2024.jpg",
                category: "Web Development",
                author: "Tim Lumakara",
                tags: ["web development", "trends 2024", "technology", "AI", "PWA"],
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                slug: "tren-website-development-2024"
            }
        ];

        // Default services
        const defaultServices = [
            {
                id: 1,
                name: "Digital Marketing Strategy",
                description: "Strategi pemasaran digital yang komprehensif untuk meningkatkan brand awareness, engagement, dan konversi bisnis Anda. Kami menggunakan data-driven approach untuk memastikan setiap campaign memberikan ROI yang optimal.",
                features: [
                    "SEO & SEM Optimization",
                    "Social Media Marketing",
                    "Content Strategy & Creation",
                    "Email Marketing Automation",
                    "Analytics & Performance Tracking",
                    "Competitor Analysis",
                    "Brand Positioning Strategy"
                ],
                icon: "fas fa-chart-line",
                price: "Mulai dari Rp 5,000,000",
                category: "Kickstart",
                image: "assets/images/services/digital-marketing.jpg"
            },
            {
                id: 2,
                name: "Website Development",
                description: "Pengembangan website profesional yang responsif, cepat, dan SEO-friendly. Dari landing page sederhana hingga e-commerce complex, kami siap mewujudkan visi digital Anda.",
                features: [
                    "Responsive Web Design",
                    "CMS Integration (WordPress, Strapi)",
                    "E-commerce Development",
                    "Performance Optimization",
                    "SEO-Friendly Structure",
                    "Security Implementation",
                    "Maintenance & Support"
                ],
                icon: "fas fa-laptop-code",
                price: "Mulai dari Rp 10,000,000",
                category: "Scale Up",
                image: "assets/images/services/website-development.jpg"
            },
            {
                id: 3,
                name: "Business Automation",
                description: "Solusi otomasi bisnis untuk meningkatkan efisiensi operasional dan mengurangi biaya. Dari CRM hingga inventory management, kami bantu streamline proses bisnis Anda.",
                features: [
                    "Process Automation Design",
                    "CRM System Integration",
                    "Workflow Optimization",
                    "Data Analytics Dashboard",
                    "API Integration",
                    "Cloud Migration",
                    "Training & Documentation"
                ],
                icon: "fas fa-robot",
                price: "Mulai dari Rp 15,000,000",
                category: "Enterprise",
                image: "assets/images/services/business-automation.jpg"
            },
            {
                id: 4,
                name: "Mobile App Development",
                description: "Pengembangan aplikasi mobile native dan cross-platform yang user-friendly dan performant. Dari konsep hingga deployment di App Store dan Play Store.",
                features: [
                    "Native iOS & Android Development",
                    "Cross-Platform (React Native, Flutter)",
                    "UI/UX Design",
                    "Backend API Development",
                    "App Store Optimization",
                    "Push Notifications",
                    "Analytics Integration"
                ],
                icon: "fas fa-mobile-alt",
                price: "Mulai dari Rp 25,000,000",
                category: "Scale Up",
                image: "assets/images/services/mobile-app.jpg"
            },
            {
                id: 5,
                name: "E-commerce Solutions",
                description: "Solusi e-commerce lengkap untuk bisnis online Anda. Dari setup toko online hingga integrasi payment gateway dan logistics, semua dalam satu paket.",
                features: [
                    "Online Store Setup",
                    "Payment Gateway Integration",
                    "Inventory Management",
                    "Order Management System",
                    "Shipping Integration",
                    "Multi-channel Selling",
                    "Sales Analytics"
                ],
                icon: "fas fa-shopping-cart",
                price: "Mulai dari Rp 20,000,000",
                category: "Scale Up",
                image: "assets/images/services/ecommerce.jpg"
            },
            {
                id: 6,
                name: "Brand Identity & Design",
                description: "Layanan branding lengkap untuk membangun identitas visual yang kuat dan memorable. Dari logo design hingga brand guidelines yang komprehensif.",
                features: [
                    "Logo Design & Branding",
                    "Brand Guidelines",
                    "Marketing Collateral Design",
                    "Website UI/UX Design",
                    "Social Media Design",
                    "Print Design",
                    "Brand Strategy Consultation"
                ],
                icon: "fas fa-palette",
                price: "Mulai dari Rp 8,000,000",
                category: "Kickstart",
                image: "assets/images/services/branding.jpg"
            }
        ];

        // Save to localStorage if not exists
        if (!localStorage.getItem(this.baseKey + 'blog')) {
            localStorage.setItem(this.baseKey + 'blog', JSON.stringify(defaultBlog));
        }

        if (!localStorage.getItem(this.baseKey + 'services')) {
            localStorage.setItem(this.baseKey + 'services', JSON.stringify(defaultServices));
        }

        // Default settings
        const defaultSettings = {
            siteName: "Lumakara",
            siteTagline: "Digital Solutions for Modern Business",
            siteDescription: "Lumakara adalah partner digital terpercaya untuk transformasi bisnis Anda. Kami menyediakan solusi lengkap mulai dari website development, digital marketing, hingga business automation.",
            contactEmail: "hello@lumakara.com",
            contactPhone: "+62 812-3456-7890",
            address: "Jakarta, Indonesia",
            socialMedia: {
                facebook: "https://facebook.com/lumakara",
                instagram: "https://instagram.com/lumakara",
                twitter: "https://twitter.com/lumakara",
                linkedin: "https://linkedin.com/company/lumakara"
            },
            seo: {
                keywords: "digital marketing, website development, business automation, mobile app, e-commerce, branding, Jakarta, Indonesia",
                author: "Lumakara Team"
            }
        };

        if (!localStorage.getItem(this.baseKey + 'settings')) {
            localStorage.setItem(this.baseKey + 'settings', JSON.stringify(defaultSettings));
        }
    }
}

// Initialize API
const lumakaraAPI = new LumakaraAPI();

// Initialize default content on first load
if (!localStorage.getItem('lumakara_initialized')) {
    lumakaraAPI.initializeDefaultContent();
    localStorage.setItem('lumakara_initialized', 'true');
}