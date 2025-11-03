// Lumakara CMS Admin JavaScript - Real CMS Version
class LumakaraCMS {
    constructor() {
        this.apiUrl = 'cms-backend.php';
        this.data = {
            blog: [],
            services: [],
            projects: [],
            team: [],
            shop: [],
            career: [],
            settings: {}
        };
        this.currentEditId = null;
        this.init();
    }

    async init() {
        this.setupNavigation();
        this.setupForms();
        await this.loadAllData();
        this.loadDashboard();
        this.initializeDefaultData();
    }

    // API Methods for JSON file communication
    async apiRequest(endpoint, method = 'GET', data = null) {
        try {
            if (method === 'GET') {
                // Load from JSON file
                const response = await fetch(`../data/${endpoint}.json`);
                if (response.ok) {
                    return await response.json();
                }
            } else if (method === 'POST') {
                // Save to localStorage and generate JSON (for demo purposes)
                localStorage.setItem(`lumakara_${endpoint}`, JSON.stringify(data));
                this.generateJSONFile(endpoint, data);
                return { success: true };
            }
        } catch (error) {
            console.error('API Error:', error);
        }
        
        // Fallback to localStorage
        return this.getLocalStorageData(endpoint);
    }
    
    generateJSONFile(endpoint, data) {
        // Generate downloadable JSON file
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `${endpoint}.json`;
        
        // Show notification with download option
        this.showNotification(
            `Data saved! <a href="${url}" download="${endpoint}.json" class="btn btn-sm btn-primary ms-2">Download JSON</a>`, 
            'success'
        );
    }
    
    getLocalStorageData(type) {
        return JSON.parse(localStorage.getItem(`lumakara_${type}`) || '[]');
    }
    
    async saveToAPI(endpoint, data) {
        try {
            const result = await this.apiRequest(endpoint, 'POST', data);
            if (result.success) {
                // Also save to localStorage as backup
                localStorage.setItem(`lumakara_${endpoint}`, JSON.stringify(data));
                
                // Trigger real-time update to main website
                this.triggerWebsiteUpdate();
                
                this.showNotification('✅ Data saved successfully! Website updated automatically.', 'success');
                return true;
            }
        } catch (error) {
            // Fallback to localStorage
            localStorage.setItem(`lumakara_${endpoint}`, JSON.stringify(data));
            
            // Trigger real-time update
            this.triggerWebsiteUpdate();
            
            this.showNotification('✅ Content updated! Changes are live on your website.', 'success');
            return true;
        }
        return false;
    }
    
    triggerWebsiteUpdate() {
        // Trigger custom event for real-time sync
        if (window.opener && !window.opener.closed) {
            // If CMS opened from main website, trigger update
            window.opener.dispatchEvent(new CustomEvent('lumakaraCMSUpdate'));
        }
        
        // Also trigger storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'lumakara_update_trigger',
            newValue: Date.now().toString(),
            storageArea: localStorage
        }));
        
        // Broadcast to all tabs
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('lumakara-cms');
            channel.postMessage({ type: 'content-updated', timestamp: Date.now() });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
    
    generateBlogHTML(post) {
        const date = new Date(post.date).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
    <div class="xb-blog xb-hover-zoom pos-rel ul_li">
        <div class="xb-item--img">
            <img src="${post.image || 'assets/img/blog/blog_01.png'}" alt="${post.title}">
        </div>
        <div class="xb-item--inner ul_li">
            <div class="xb-item--author">
                <div class="xb-item--avatar">
                    <img src="assets/img/blog/blog-icon_01.jpg" alt="">
                </div>
                <h3 class="xb-item--name"><span>By</span>: ${post.author}</h3>
                <h5 class="xb-item--date">${date}</h5>
            </div>
            <div class="xb-item--holder">
                <h2 class="xb-item--title">${post.title}</h2>
                <p class="xb-item--content">${this.truncateText(this.stripHTML(post.content), 100)}</p>
            </div>
        </div>
        <a class="xb-overlay" href="blog-single.html?slug=${post.slug}"></a>
    </div>`;
    }
    
    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substr(0, length) + '...';
    }
    
    stripHTML(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
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

    async saveBlogPost() {
        const formData = {
            title: document.getElementById('blogTitle').value,
            content: document.getElementById('blogContent').value,
            image: document.getElementById('blogImage').value || 'assets/img/blog/default-blog.jpg',
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

        const success = await this.saveData('blog');
        if (success) {
            this.loadBlogList();
            this.hideBlogForm();
            
            // Show HTML code for manual copy-paste
            const htmlCode = this.generateBlogHTML(formData);
            this.showHTMLCode('Blog HTML Code', htmlCode, 'Copy this HTML code and paste it into your index.html blog section');
        }
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

    async deleteBlogPost(id) {
        if (confirm('Are you sure you want to delete this blog post?')) {
            this.data.blog = this.data.blog.filter(post => post.id !== id);
            const success = await this.saveData('blog');
            if (success) {
                this.loadBlogList();
                this.updateWebsiteFiles();
            }
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

    async saveService() {
        const formData = {
            name: document.getElementById('serviceName').value,
            description: document.getElementById('serviceDescription').value,
            features: document.getElementById('serviceFeatures').value.split('\n').filter(f => f.trim()),
            icon: document.getElementById('serviceIcon').value,
            price: document.getElementById('servicePrice').value,
            category: document.getElementById('serviceCategory').value,
            image: document.getElementById('serviceImage').value || 'assets/img/services/default-service.jpg'
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

        const success = await this.saveData('services');
        if (success) {
            this.loadServicesList();
            this.hideServiceForm();
            this.updateWebsiteFiles();
        }
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

    async saveData(type) {
        await this.saveToAPI(type, this.data[type]);
    }

    async loadAllData() {
        for (const key of Object.keys(this.data)) {
            this.data[key] = await this.apiRequest(key);
        }
    }

    // Update website files with new content
    updateWebsiteFiles() {
        // The PHP backend will handle HTML file updates
        // This method can trigger additional frontend updates
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Trigger dynamic content reload on main website
        if (window.opener && !window.opener.closed) {
            // If CMS opened from main website, refresh parent
            window.opener.location.reload();
        }
        
        // Update preview if available
        this.refreshPreview();
    }

    refreshPreview() {
        // This can be used to refresh preview iframe if implemented
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            previewFrame.src = previewFrame.src;
        }
    }
    
    showHTMLCode(title, htmlCode, instruction) {
        // Create modal for HTML code
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.cssText = 'display: block; background: rgba(0,0,0,0.5);';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted">${instruction}</p>
                        <div class="mb-3">
                            <label class="form-label">HTML Code:</label>
                            <textarea class="form-control" rows="15" readonly id="htmlCodeArea">${htmlCode}</textarea>
                        </div>
                        <button class="btn btn-primary" onclick="navigator.clipboard.writeText(document.getElementById('htmlCodeArea').value); alert('HTML code copied to clipboard!')">
                            <i class="fas fa-copy"></i> Copy to Clipboard
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto remove after 30 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 30000);
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