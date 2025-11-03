// Lumakara CMS Admin JavaScript
class LumakaraCMS {
    constructor() {
        this.data = {
            blog: JSON.parse(localStorage.getItem('lumakara_blog') || '[]'),
            services: JSON.parse(localStorage.getItem('lumakara_services') || '[]'),
            projects: JSON.parse(localStorage.getItem('lumakara_projects') || '[]'),
            team: JSON.parse(localStorage.getItem('lumakara_team') || '[]'),
            shop: JSON.parse(localStorage.getItem('lumakara_shop') || '[]'),
            career: JSON.parse(localStorage.getItem('lumakara_career') || '[]'),
            settings: JSON.parse(localStorage.getItem('lumakara_settings') || '{}')
        };
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupForms();
        this.loadDashboard();
        this.loadAllData();
        this.initializeDefaultData();
    }

    initializeDefaultData() {
        // Initialize with Lumakara default data if empty
        if (this.data.services.length === 0) {
            this.data.services = [
                {
                    id: 1,
                    name: "Digital Marketing Strategy",
                    description: "Strategi pemasaran digital yang komprehensif untuk meningkatkan brand awareness dan konversi bisnis Anda.",
                    features: ["SEO Optimization", "Social Media Marketing", "Content Strategy", "Analytics & Reporting"],
                    icon: "fas fa-chart-line",
                    price: "Rp 5,000,000 - 15,000,000",
                    category: "Kickstart",
                    image: "assets/images/service-1.jpg"
                },
                {
                    id: 2,
                    name: "Website Development",
                    description: "Pengembangan website profesional yang responsif, cepat, dan SEO-friendly untuk bisnis modern.",
                    features: ["Responsive Design", "CMS Integration", "E-commerce Ready", "Performance Optimization"],
                    icon: "fas fa-laptop-code",
                    price: "Rp 10,000,000 - 50,000,000",
                    category: "Scale Up",
                    image: "assets/images/service-2.jpg"
                },
                {
                    id: 3,
                    name: "Business Automation",
                    description: "Solusi otomasi bisnis untuk meningkatkan efisiensi operasional dan mengurangi biaya operasional.",
                    features: ["Process Automation", "CRM Integration", "Workflow Optimization", "Data Analytics"],
                    icon: "fas fa-robot",
                    price: "Rp 15,000,000 - 100,000,000",
                    category: "Enterprise",
                    image: "assets/images/service-3.jpg"
                }
            ];
            this.saveData('services');
        }

        if (this.data.blog.length === 0) {
            this.data.blog = [
                {
                    id: 1,
                    title: "Transformasi Digital: Kunci Sukses Bisnis di Era Modern",
                    content: "Transformasi digital bukan lagi pilihan, melainkan keharusan bagi bisnis yang ingin bertahan dan berkembang di era modern. Lumakara membantu bisnis Anda melakukan transformasi digital yang tepat sasaran...",
                    image: "assets/images/blog-1.jpg",
                    category: "Digital Marketing",
                    author: "Tim Lumakara",
                    tags: ["digital transformation", "business strategy", "technology"],
                    date: new Date().toISOString(),
                    slug: "transformasi-digital-kunci-sukses-bisnis"
                },
                {
                    id: 2,
                    title: "Strategi SEO Terbaru untuk Meningkatkan Ranking Website",
                    content: "SEO terus berkembang seiring dengan perubahan algoritma search engine. Pelajari strategi SEO terbaru yang efektif untuk meningkatkan ranking website Anda di tahun ini...",
                    image: "assets/images/blog-2.jpg",
                    category: "Digital Marketing",
                    author: "Tim Lumakara",
                    tags: ["SEO", "digital marketing", "website optimization"],
                    date: new Date().toISOString(),
                    slug: "strategi-seo-terbaru-ranking-website"
                }
            ];
            this.saveData('blog');
        }
    }

    setupNavigation() {
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('[data-section]').dataset.section;
                this.showSection(section);
                
                // Update active nav
                document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
                e.target.closest('.nav-link').classList.add('active');
            });
        });
    }

    setupForms() {
        // Blog form
        document.getElementById('blogPostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBlogPost();
        });

        // Service form
        document.getElementById('servicePostForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveService();
        });
    }

    showSection(section) {
        document.querySelectorAll('.editor-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Load section specific data
        switch(section) {
            case 'blog':
                this.loadBlogList();
                break;
            case 'services':
                this.loadServicesList();
                break;
            case 'dashboard':
                this.loadDashboard();
                break;
        }
    }

    loadDashboard() {
        document.getElementById('blogCount').textContent = this.data.blog.length;
        document.getElementById('servicesCount').textContent = this.data.services.length;
        document.getElementById('projectsCount').textContent = this.data.projects.length;
        document.getElementById('productsCount').textContent = this.data.shop.length;
    }

    // Blog Management
    loadBlogList() {
        const blogList = document.getElementById('blogList');
        blogList.innerHTML = '';

        this.data.blog.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.title}</td>
                <td><span class="badge bg-primary">${post.category}</span></td>
                <td>${post.author}</td>
                <td>${new Date(post.date).toLocaleDateString('id-ID')}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="cms.editBlogPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cms.deleteBlogPost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            blogList.appendChild(row);
        });
    }

    saveBlogPost() {
        const formData = {
            title: document.getElementById('blogTitle').value,
            content: document.getElementById('blogContent').value,
            image: document.getElementById('blogImage').value,
            category: document.getElementById('blogCategory').value,
            author: document.getElementById('blogAuthor').value,
            tags: document.getElementById('blogTags').value.split(',').map(tag => tag.trim()),
            date: new Date().toISOString(),
            slug: this.generateSlug(document.getElementById('blogTitle').value)
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.data.blog.findIndex(post => post.id === this.currentEditId);
            this.data.blog[index] = { ...this.data.blog[index], ...formData };
        } else {
            // Create new
            formData.id = Date.now();
            this.data.blog.unshift(formData);
        }

        this.saveData('blog');
        this.loadBlogList();
        this.hideBlogForm();
        this.generateWebsiteFiles();
    }

    editBlogPost(id) {
        const post = this.data.blog.find(p => p.id === id);
        if (post) {
            this.currentEditId = id;
            document.getElementById('blogTitle').value = post.title;
            document.getElementById('blogContent').value = post.content;
            document.getElementById('blogImage').value = post.image || '';
            document.getElementById('blogCategory').value = post.category;
            document.getElementById('blogAuthor').value = post.author;
            document.getElementById('blogTags').value = post.tags.join(', ');
            this.showBlogForm();
        }
    }

    deleteBlogPost(id) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            this.data.blog = this.data.blog.filter(post => post.id !== id);
            this.saveData('blog');
            this.loadBlogList();
            this.generateWebsiteFiles();
        }
    }

    // Services Management
    loadServicesList() {
        const servicesList = document.getElementById('servicesList');
        servicesList.innerHTML = '';

        this.data.services.forEach(service => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${service.name}</td>
                <td><span class="badge bg-success">${service.category}</span></td>
                <td>${service.price}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="cms.editService(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="cms.deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            servicesList.appendChild(row);
        });
    }

    saveService() {
        const formData = {
            name: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            features: document.getElementById('serviceFeatures').value.split('\n').filter(f => f.trim()),
            icon: document.getElementById('serviceIcon').value,
            price: document.getElementById('servicePrice').value,
            category: document.getElementById('serviceCategory').value,
            image: document.getElementById('serviceImage').value
        };

        if (this.currentEditId) {
            // Update existing
            const index = this.data.services.findIndex(service => service.id === this.currentEditId);
            this.data.services[index] = { ...this.data.services[index], ...formData };
        } else {
            // Create new
            formData.id = Date.now();
            this.data.services.push(formData);
        }

        this.saveData('services');
        this.loadServicesList();
        this.hideServiceForm();
        this.generateWebsiteFiles();
    }

    editService(id) {
        const service = this.data.services.find(s => s.id === id);
        if (service) {
            this.currentEditId = id;
            document.getElementById('serviceName').value = service.name;
            document.getElementById('serviceDescription').value = service.description;
            document.getElementById('serviceFeatures').value = service.features.join('\n');
            document.getElementById('serviceIcon').value = service.icon;
            document.getElementById('servicePrice').value = service.price;
            document.getElementById('serviceCategory').value = service.category;
            document.getElementById('serviceImage').value = service.image || '';
            this.showServiceForm();
        }
    }

    deleteService(id) {
        if (confirm('Are you sure you want to delete this service?')) {
            this.data.services = this.data.services.filter(service => service.id !== id);
            this.saveData('services');
            this.loadServicesList();
            this.generateWebsiteFiles();
        }
    }

    // Utility functions
    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }

    saveData(type) {
        localStorage.setItem(`lumakara_${type}`, JSON.stringify(this.data[type]));
    }

    loadAllData() {
        Object.keys(this.data).forEach(key => {
            const stored = localStorage.getItem(`lumakara_${key}`);
            if (stored) {
                this.data[key] = JSON.parse(stored);
            }
        });
    }

    // Generate website files
    generateWebsiteFiles() {
        // This will update the main website files with new content
        this.updateIndexPage();
        this.updateBlogPage();
        this.updateServicePage();
    }

    updateIndexPage() {
        // Generate updated index.html content
        // This will be implemented to update the main website
        console.log('Updating index page with latest data...');
    }

    updateBlogPage() {
        // Generate updated blog.html content
        console.log('Updating blog page with latest posts...');
    }

    updateServicePage() {
        // Generate updated service.html content
        console.log('Updating service page with latest services...');
    }

    // Export data for backup
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'lumakara-cms-backup.json';
        link.click();
    }

    // Import data from backup
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = importedData;
                Object.keys(this.data).forEach(key => {
                    this.saveData(key);
                });
                location.reload();
            } catch (error) {
                alert('Error importing data: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Form show/hide functions
function showBlogForm() {
    cms.currentEditId = null;
    document.getElementById('blogForm').style.display = 'block';
    document.getElementById('blogPostForm').reset();
}

function hideBlogForm() {
    document.getElementById('blogForm').style.display = 'none';
    cms.currentEditId = null;
}

function showServiceForm() {
    cms.currentEditId = null;
    document.getElementById('serviceForm').style.display = 'block';
    document.getElementById('servicePostForm').reset();
}

function hideServiceForm() {
    document.getElementById('serviceForm').style.display = 'none';
    cms.currentEditId = null;
}

// Initialize CMS
const cms = new LumakaraCMS();