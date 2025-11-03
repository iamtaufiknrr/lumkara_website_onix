// Lumakara Dynamic Content Loader
// This script loads content from CMS and updates the website dynamically

class LumakaraDynamic {
    constructor() {
        this.api = new LumakaraAPI();
        this.init();
    }

    init() {
        // Load CMS API first
        this.loadAPI().then(() => {
            this.loadDynamicContent();
        });
        
        // Setup real-time sync with CMS
        this.setupRealTimeSync();
    }
    
    setupRealTimeSync() {
        // BroadcastChannel for cross-tab communication
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('lumakara-cms');
            channel.addEventListener('message', (event) => {
                if (event.data.type === 'content-updated') {
                    console.log('🔄 Real-time update from CMS detected');
                    setTimeout(() => {
                        this.loadDynamicContent();
                    }, 500); // Small delay to ensure data is saved
                }
            });
        }
        
        // Periodic refresh every 30 seconds (fallback)
        setInterval(() => {
            this.loadDynamicContent();
        }, 30000);
    }

    async loadAPI() {
        // Load the API script if not already loaded
        if (typeof LumakaraAPI === 'undefined') {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'cms/api.js';
                script.onload = () => {
                    this.api = new LumakaraAPI();
                    resolve();
                };
                document.head.appendChild(script);
            });
        }
    }

    loadDynamicContent() {
        // Load different content based on current page
        const currentPage = this.getCurrentPage();
        
        switch(currentPage) {
            case 'index':
                this.loadHomePage();
                break;
            case 'blog':
                this.loadBlogPage();
                break;
            case 'blog-single':
                this.loadBlogSingle();
                break;
            case 'service':
                this.loadServicesPage();
                break;
            case 'service-single':
                this.loadServiceSingle();
                break;
            default:
                this.loadCommonElements();
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename || 'index';
    }

    async loadHomePage() {
        await this.loadLatestBlogPosts();
        await this.loadFeaturedServices();
        this.loadCommonElements();
    }

    async loadLatestBlogPosts() {
        const blogContainer = document.querySelector('#lumakara-blog-container');
        if (!blogContainer) return;

        try {
            const posts = await this.api.getBlogPosts(3); // Get latest 3 posts
            
            if (posts && posts.length > 0) {
                // Update existing blog items with dynamic content
                const blogItems = blogContainer.querySelectorAll('[data-blog-item]');
                
                posts.forEach((post, index) => {
                    if (blogItems[index]) {
                        const blogItem = blogItems[index];
                        
                        // Update image
                        const img = blogItem.querySelector('.xb-item--img img');
                        if (img && post.image) {
                            img.src = post.image;
                            img.alt = post.title;
                        }
                        
                        // Update author
                        const authorName = blogItem.querySelector('.author-name');
                        if (authorName) authorName.textContent = post.author;
                        
                        // Update date
                        const dateElement = blogItem.querySelector('.blog-date');
                        if (dateElement) dateElement.textContent = this.formatDate(post.date);
                        
                        // Update title
                        const titleElement = blogItem.querySelector('.blog-title');
                        if (titleElement) titleElement.innerHTML = this.formatTitle(post.title);
                        
                        // Update excerpt
                        const excerptElement = blogItem.querySelector('.blog-excerpt');
                        if (excerptElement) {
                            excerptElement.innerHTML = this.formatExcerpt(this.stripHTML(post.content));
                        }
                        
                        // Update link
                        const linkElement = blogItem.querySelector('.blog-link');
                        if (linkElement) linkElement.href = `blog-single.html?slug=${post.slug}`;
                    }
                });
                
                console.log('✅ Blog posts loaded successfully from CMS');
                this.showUpdateIndicator('Blog content updated from CMS');
            } else {
                console.log('📝 Using default blog content');
            }
        } catch (error) {
            console.log('📝 Using default blog content (CMS data not available)');
        }
    }
    
    formatTitle(title) {
        // Add line breaks for better layout (similar to original)
        if (title.length > 40) {
            const words = title.split(' ');
            const midPoint = Math.ceil(words.length / 2);
            return words.slice(0, midPoint).join(' ') + ' <br> ' + words.slice(midPoint).join(' ');
        }
        return title;
    }
    
    formatExcerpt(content) {
        const excerpt = this.truncateText(content, 100);
        // Add line break for better layout
        if (excerpt.length > 50) {
            const words = excerpt.split(' ');
            const midPoint = Math.ceil(words.length / 2);
            return words.slice(0, midPoint).join(' ') + ' <br> ' + words.slice(midPoint).join(' ');
        }
        return excerpt;
    }

    async loadFeaturedServices() {
        const servicesContainer = document.querySelector('#featured-services');
        if (!servicesContainer) return;

        const services = (await this.api.getServices()).slice(0, 6); // Get first 6 services
        
        let servicesHTML = '';
        services.forEach((service, index) => {
            const delay = (index + 1) * 0.1;
            servicesHTML += `
                <div class="col-lg-4 col-md-6 mt-30">
                    <div class="xb-service xb-service2 text-center wow fadeInUp" data-wow-delay="${delay}s">
                        <div class="xb-item--inner">
                            <div class="xb-item--icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <div class="xb-item--holder">
                                <h3 class="xb-item--title"><a href="service-single.html?id=${service.id}">${service.name}</a></h3>
                                <p class="xb-item--content">${this.truncateText(service.description, 100)}</p>
                                <div class="xb-item--price">
                                    <span>${service.price}</span>
                                </div>
                                <div class="xb-item--category">
                                    <span class="badge badge-${service.category.toLowerCase().replace(' ', '-')}">${service.category}</span>
                                </div>
                            </div>
                        </div>
                        <a class="xb-overlay" href="service-single.html?id=${service.id}"></a>
                    </div>
                </div>
            `;
        });

        servicesContainer.innerHTML = servicesHTML;
    }

    loadBlogPage() {
        const blogContainer = document.querySelector('#blog-posts-container');
        if (!blogContainer) return;

        const posts = this.api.getBlogPosts();
        
        let blogHTML = '';
        posts.forEach(post => {
            blogHTML += `
                <div class="col-lg-6 mt-30">
                    <div class="xb-blog xb-blog2 xb-hover-zoom pos-rel ul_li">
                        <div class="xb-item--img">
                            <img src="${post.image || 'assets/img/blog/default-blog.jpg'}" alt="${post.title}">
                            <div class="xb-item--category">
                                <span>${post.category}</span>
                            </div>
                        </div>
                        <div class="xb-item--inner ul_li">
                            <div class="xb-item--author">
                                <div class="xb-item--avatar">
                                    <img src="assets/img/team/lumakara-team.jpg" alt="">
                                </div>
                                <h3 class="xb-item--name"><span>By</span>: ${post.author}</h3>
                                <h5 class="xb-item--date">${this.formatDate(post.date)}</h5>
                            </div>
                            <div class="xb-item--holder">
                                <h2 class="xb-item--title"><a href="blog-single.html?slug=${post.slug}">${post.title}</a></h2>
                                <p class="xb-item--content">${this.truncateText(this.stripHTML(post.content), 150)}</p>
                                <div class="xb-item--tags">
                                    ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                                </div>
                                <div class="xb-item--btn">
                                    <a class="thm-btn" href="blog-single.html?slug=${post.slug}">
                                        <span class="btn-wrap">
                                            <span>Read More</span>
                                            <span>Read More</span>
                                        </span>
                                        <i class="arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        blogContainer.innerHTML = blogHTML;
    }

    loadBlogSingle() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) return;

        const post = this.api.getBlogPost(slug);
        if (!post) return;

        // Update page title
        document.title = `${post.title} - Lumakara`;

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', this.truncateText(this.stripHTML(post.content), 160));
        }

        // Update blog content
        const titleElement = document.querySelector('.blog-single-title');
        if (titleElement) titleElement.textContent = post.title;

        const contentElement = document.querySelector('.blog-single-content');
        if (contentElement) contentElement.innerHTML = post.content;

        const authorElement = document.querySelector('.blog-single-author');
        if (authorElement) authorElement.textContent = post.author;

        const dateElement = document.querySelector('.blog-single-date');
        if (dateElement) dateElement.textContent = this.formatDate(post.date);

        const categoryElement = document.querySelector('.blog-single-category');
        if (categoryElement) categoryElement.textContent = post.category;

        const imageElement = document.querySelector('.blog-single-image');
        if (imageElement && post.image) {
            imageElement.src = post.image;
            imageElement.alt = post.title;
        }

        const tagsContainer = document.querySelector('.blog-single-tags');
        if (tagsContainer) {
            tagsContainer.innerHTML = post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('');
        }
    }

    loadServicesPage() {
        const servicesContainer = document.querySelector('#services-container');
        if (!servicesContainer) return;

        const services = this.api.getServices();
        
        let servicesHTML = '';
        services.forEach((service, index) => {
            const delay = (index + 1) * 0.1;
            servicesHTML += `
                <div class="col-lg-4 col-md-6 mt-30">
                    <div class="xb-service xb-service3 text-center wow fadeInUp" data-wow-delay="${delay}s">
                        <div class="xb-item--inner">
                            <div class="xb-item--icon">
                                <i class="${service.icon}"></i>
                            </div>
                            <div class="xb-item--holder">
                                <h3 class="xb-item--title"><a href="service-single.html?id=${service.id}">${service.name}</a></h3>
                                <p class="xb-item--content">${service.description}</p>
                                <div class="xb-item--features">
                                    <ul>
                                        ${service.features.slice(0, 4).map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="xb-item--price">
                                    <span>${service.price}</span>
                                </div>
                                <div class="xb-item--category">
                                    <span class="badge badge-${service.category.toLowerCase().replace(' ', '-')}">${service.category}</span>
                                </div>
                                <div class="xb-item--btn">
                                    <a class="thm-btn" href="service-single.html?id=${service.id}">
                                        <span class="btn-wrap">
                                            <span>Learn More</span>
                                            <span>Learn More</span>
                                        </span>
                                        <i class="arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        servicesContainer.innerHTML = servicesHTML;
    }

    loadServiceSingle() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get('id');
        
        if (!serviceId) return;

        const service = this.api.getService(serviceId);
        if (!service) return;

        // Update page title
        document.title = `${service.name} - Lumakara Services`;

        // Update service content
        const titleElement = document.querySelector('.service-single-title');
        if (titleElement) titleElement.textContent = service.name;

        const descriptionElement = document.querySelector('.service-single-description');
        if (descriptionElement) descriptionElement.innerHTML = service.description;

        const priceElement = document.querySelector('.service-single-price');
        if (priceElement) priceElement.textContent = service.price;

        const categoryElement = document.querySelector('.service-single-category');
        if (categoryElement) categoryElement.textContent = service.category;

        const featuresContainer = document.querySelector('.service-single-features');
        if (featuresContainer) {
            featuresContainer.innerHTML = service.features.map(feature => 
                `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
            ).join('');
        }

        const iconElement = document.querySelector('.service-single-icon');
        if (iconElement) iconElement.className = service.icon;

        const imageElement = document.querySelector('.service-single-image');
        if (imageElement && service.image) {
            imageElement.src = service.image;
            imageElement.alt = service.name;
        }
    }

    loadCommonElements() {
        // Load dynamic elements that appear on multiple pages
        this.updateSiteSettings();
        this.loadSearchFunctionality();
    }

    updateSiteSettings() {
        const settings = this.api.getSettings();
        
        // Update site title in header
        const siteTitleElements = document.querySelectorAll('.site-title');
        siteTitleElements.forEach(el => el.textContent = settings.siteName || 'Lumakara');

        // Update contact information
        const emailElements = document.querySelectorAll('.contact-email');
        emailElements.forEach(el => {
            el.textContent = settings.contactEmail || 'hello@lumakara.com';
            el.href = `mailto:${settings.contactEmail || 'hello@lumakara.com'}`;
        });

        const phoneElements = document.querySelectorAll('.contact-phone');
        phoneElements.forEach(el => {
            el.textContent = settings.contactPhone || '+62 812-3456-7890';
            el.href = `tel:${settings.contactPhone || '+62812-3456-7890'}`;
        });

        // Update social media links
        if (settings.socialMedia) {
            Object.keys(settings.socialMedia).forEach(platform => {
                const socialLinks = document.querySelectorAll(`.social-${platform}`);
                socialLinks.forEach(link => {
                    link.href = settings.socialMedia[platform];
                });
            });
        }
    }

    loadSearchFunctionality() {
        const searchForms = document.querySelectorAll('form[role="search"]');
        searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const query = form.querySelector('input[name="s"]').value;
                this.performSearch(query);
            });
        });
    }

    performSearch(query) {
        if (!query.trim()) return;

        const results = this.api.search(query);
        
        // Create search results page or modal
        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        // Create a simple search results display
        let resultsHTML = `
            <div class="search-results-overlay">
                <div class="search-results-container">
                    <div class="search-results-header">
                        <h3>Search Results for "${query}"</h3>
                        <button class="close-search" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
                    </div>
                    <div class="search-results-content">
        `;

        if (results.length === 0) {
            resultsHTML += '<p>No results found. Try different keywords.</p>';
        } else {
            results.forEach(result => {
                const url = result.type === 'blog' ? `blog-single.html?slug=${result.slug}` : `service-single.html?id=${result.id}`;
                resultsHTML += `
                    <div class="search-result-item">
                        <h4><a href="${url}">${result.title || result.name}</a></h4>
                        <p>${this.truncateText(this.stripHTML(result.content || result.description), 120)}</p>
                        <span class="result-type">${result.type}</span>
                    </div>
                `;
            });
        }

        resultsHTML += `
                    </div>
                </div>
            </div>
        `;

        // Add CSS for search results
        const searchCSS = `
            <style>
                .search-results-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .search-results-container {
                    background: white;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    border-radius: 8px;
                }
                .search-results-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .search-results-content {
                    padding: 20px;
                }
                .search-result-item {
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                }
                .search-result-item:last-child {
                    border-bottom: none;
                }
                .close-search {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
                .result-type {
                    background: #007cba;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', searchCSS);
        document.body.insertAdjacentHTML('beforeend', resultsHTML);
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
    
    showUpdateIndicator(message) {
        // Show subtle update indicator
        const indicator = document.createElement('div');
        indicator.className = 'lumakara-update-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #A3968D;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;
        indicator.innerHTML = `
            <i class="fas fa-sync-alt fa-spin"></i> ${message}
        `;
        
        document.body.appendChild(indicator);
        
        // Fade in
        setTimeout(() => {
            indicator.style.opacity = '1';
        }, 100);
        
        // Fade out and remove
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize dynamic content when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dynamicLoader = new LumakaraDynamic();
    
    // Listen for CMS updates (real-time sync)
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('lumakara_')) {
            console.log('🔄 CMS data updated, refreshing content...');
            dynamicLoader.loadDynamicContent();
        }
    });
    
    // Listen for custom CMS update events
    window.addEventListener('lumakaraCMSUpdate', (e) => {
        console.log('🔄 CMS update detected, refreshing content...');
        dynamicLoader.loadDynamicContent();
    });
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const dynamicLoader = new LumakaraDynamic();
        
        // Real-time sync listeners
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('lumakara_')) {
                dynamicLoader.loadDynamicContent();
            }
        });
        
        window.addEventListener('lumakaraCMSUpdate', () => {
            dynamicLoader.loadDynamicContent();
        });
    });
} else {
    const dynamicLoader = new LumakaraDynamic();
    
    // Real-time sync listeners
    window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('lumakara_')) {
            dynamicLoader.loadDynamicContent();
        }
    });
    
    window.addEventListener('lumakaraCMSUpdate', () => {
        dynamicLoader.loadDynamicContent();
    });
}