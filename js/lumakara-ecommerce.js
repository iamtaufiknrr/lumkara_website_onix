// Lumakara E-commerce System
// Simple e-commerce functionality for digital products and services

class LumakaraEcommerce {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('lumakara_cart') || '[]');
        this.orders = JSON.parse(localStorage.getItem('lumakara_orders') || '[]');
        this.products = this.getDigitalProducts();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupEventListeners();
        this.loadProducts();
    }

    getDigitalProducts() {
        // Digital products and service packages for Lumakara
        return [
            {
                id: 1,
                name: "Brand Identity Starter Pack",
                description: "Paket lengkap untuk membangun identitas brand yang kuat. Termasuk logo design, brand guidelines, dan konsultasi brand strategy.",
                price: 5000000,
                originalPrice: 7500000,
                category: "Branding",
                type: "digital",
                image: "assets/img/shop/brand-identity-pack.jpg",
                features: [
                    "Logo Design (3 konsep + revisi unlimited)",
                    "Brand Guidelines (20+ halaman)",
                    "Business Card & Letterhead Design",
                    "Social Media Template (10 design)",
                    "Brand Strategy Consultation (2 jam)",
                    "File source (AI, PSD, PDF)"
                ],
                deliveryTime: "7-10 hari kerja",
                includes: "Semua file source, brand guidelines PDF, dan 1 bulan support"
            },
            {
                id: 2,
                name: "Website Development Package",
                description: "Paket pengembangan website profesional dengan CMS, SEO optimization, dan mobile responsive design.",
                price: 15000000,
                originalPrice: 20000000,
                category: "Web Development",
                type: "service",
                image: "assets/img/shop/website-package.jpg",
                features: [
                    "Custom Website Design",
                    "Responsive Mobile Design",
                    "CMS Integration (WordPress/Custom)",
                    "SEO Basic Setup",
                    "Contact Form & Google Maps",
                    "SSL Certificate Setup",
                    "3 Bulan Maintenance Gratis"
                ],
                deliveryTime: "14-21 hari kerja",
                includes: "Domain setup, hosting consultation, training penggunaan CMS"
            },
            {
                id: 3,
                name: "Digital Marketing Bootcamp",
                description: "Kursus online komprehensif untuk menguasai digital marketing dari basic hingga advanced level.",
                price: 2500000,
                originalPrice: 3500000,
                category: "Education",
                type: "digital",
                image: "assets/img/shop/digital-marketing-course.jpg",
                features: [
                    "50+ Video Tutorial (Total 20 jam)",
                    "E-book Digital Marketing Guide (200+ halaman)",
                    "Template & Tools (50+ file)",
                    "Case Study Real Project",
                    "Private Telegram Group",
                    "Certificate of Completion",
                    "Lifetime Access"
                ],
                deliveryTime: "Akses langsung setelah pembayaran",
                includes: "Akses seumur hidup, update materi gratis, community support"
            },
            {
                id: 4,
                name: "Social Media Management Tools",
                description: "Kumpulan template dan tools untuk mengelola social media dengan lebih efektif dan profesional.",
                price: 750000,
                originalPrice: 1200000,
                category: "Tools",
                type: "digital",
                image: "assets/img/shop/social-media-tools.jpg",
                features: [
                    "100+ Instagram Post Templates",
                    "50+ Instagram Story Templates",
                    "Content Calendar Template",
                    "Hashtag Research Guide",
                    "Caption Writing Framework",
                    "Analytics Tracking Sheet",
                    "Canva Pro Templates"
                ],
                deliveryTime: "Download langsung",
                includes: "File PSD, Canva templates, Excel sheets, PDF guides"
            },
            {
                id: 5,
                name: "Business Automation Consultation",
                description: "Konsultasi 1-on-1 untuk mengidentifikasi dan mengimplementasikan otomasi dalam bisnis Anda.",
                price: 3000000,
                originalPrice: 4000000,
                category: "Consultation",
                type: "service",
                image: "assets/img/shop/business-automation.jpg",
                features: [
                    "Business Process Analysis (2 jam)",
                    "Automation Roadmap",
                    "Tool Recommendations",
                    "Implementation Guide",
                    "ROI Calculation",
                    "Follow-up Session (1 jam)",
                    "Email Support (1 bulan)"
                ],
                deliveryTime: "Jadwal fleksibel",
                includes: "Detailed report, implementation checklist, tool setup assistance"
            },
            {
                id: 6,
                name: "E-commerce Starter Bundle",
                description: "Paket lengkap untuk memulai bisnis e-commerce, dari setup toko online hingga strategi marketing.",
                price: 12000000,
                originalPrice: 18000000,
                category: "E-commerce",
                type: "service",
                image: "assets/img/shop/ecommerce-bundle.jpg",
                features: [
                    "Toko Online Setup (Shopify/WooCommerce)",
                    "Product Photography Guide",
                    "Payment Gateway Integration",
                    "Shipping Setup & Integration",
                    "Basic SEO Setup",
                    "Social Media Integration",
                    "Marketing Strategy (30 hari pertama)"
                ],
                deliveryTime: "10-14 hari kerja",
                includes: "Training penggunaan platform, marketing materials, 2 bulan support"
            }
        ];
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            }

            if (e.target.classList.contains('remove-from-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                this.removeFromCart(productId);
            }

            if (e.target.classList.contains('update-quantity')) {
                const productId = parseInt(e.target.dataset.productId);
                const quantity = parseInt(e.target.parentElement.querySelector('.quantity-input').value);
                this.updateQuantity(productId, quantity);
            }
        });

        // Cart toggle
        const cartToggle = document.querySelector('.cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                this.toggleCart();
            });
        }

        // Checkout button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('checkout-btn')) {
                this.proceedToCheckout();
            }
        });
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showCartNotification(`${product.name} ditambahkan ke keranjang`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('lumakara_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = totalItems;
            el.style.display = totalItems > 0 ? 'inline' : 'none';
        });
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    loadProducts() {
        const productsContainer = document.querySelector('#products-container');
        if (!productsContainer) return;

        let productsHTML = '';
        this.products.forEach(product => {
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            
            productsHTML += `
                <div class="col-lg-4 col-md-6 mt-30">
                    <div class="xb-shop-item">
                        <div class="xb-item--img pos-rel">
                            <img src="${product.image}" alt="${product.name}">
                            ${discount > 0 ? `<div class="xb-item--discount">${discount}% OFF</div>` : ''}
                            <div class="xb-item--category">${product.category}</div>
                        </div>
                        <div class="xb-item--holder">
                            <h3 class="xb-item--title">
                                <a href="shop-single.html?id=${product.id}">${product.name}</a>
                            </h3>
                            <p class="xb-item--description">${this.truncateText(product.description, 100)}</p>
                            <div class="xb-item--price">
                                <span class="current-price">Rp ${this.formatPrice(product.price)}</span>
                                ${product.originalPrice > product.price ? 
                                    `<span class="original-price">Rp ${this.formatPrice(product.originalPrice)}</span>` : ''}
                            </div>
                            <div class="xb-item--features">
                                <ul>
                                    ${product.features.slice(0, 3).map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="xb-item--meta">
                                <span class="delivery-time"><i class="fas fa-clock"></i> ${product.deliveryTime}</span>
                                <span class="product-type"><i class="fas fa-tag"></i> ${product.type}</span>
                            </div>
                            <div class="xb-item--btn">
                                <button class="thm-btn add-to-cart-btn" data-product-id="${product.id}">
                                    <span class="btn-wrap">
                                        <span>Add to Cart</span>
                                        <span>Add to Cart</span>
                                    </span>
                                    <i class="fas fa-shopping-cart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        productsContainer.innerHTML = productsHTML;
    }

    loadProductSingle() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        
        if (!productId) return;

        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Update page title
        document.title = `${product.name} - Lumakara Shop`;

        // Update product details
        const titleElement = document.querySelector('.product-single-title');
        if (titleElement) titleElement.textContent = product.name;

        const descriptionElement = document.querySelector('.product-single-description');
        if (descriptionElement) descriptionElement.innerHTML = product.description;

        const priceElement = document.querySelector('.product-single-price');
        if (priceElement) priceElement.textContent = `Rp ${this.formatPrice(product.price)}`;

        const originalPriceElement = document.querySelector('.product-single-original-price');
        if (originalPriceElement && product.originalPrice > product.price) {
            originalPriceElement.textContent = `Rp ${this.formatPrice(product.originalPrice)}`;
            originalPriceElement.style.display = 'inline';
        }

        const categoryElement = document.querySelector('.product-single-category');
        if (categoryElement) categoryElement.textContent = product.category;

        const featuresContainer = document.querySelector('.product-single-features');
        if (featuresContainer) {
            featuresContainer.innerHTML = product.features.map(feature => 
                `<li><i class="fas fa-check-circle"></i> ${feature}</li>`
            ).join('');
        }

        const deliveryTimeElement = document.querySelector('.product-single-delivery');
        if (deliveryTimeElement) deliveryTimeElement.textContent = product.deliveryTime;

        const includesElement = document.querySelector('.product-single-includes');
        if (includesElement) includesElement.textContent = product.includes;

        const imageElement = document.querySelector('.product-single-image');
        if (imageElement) {
            imageElement.src = product.image;
            imageElement.alt = product.name;
        }

        // Update add to cart button
        const addToCartBtn = document.querySelector('.product-single-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.dataset.productId = product.id;
            addToCartBtn.classList.add('add-to-cart-btn');
        }
    }

    toggleCart() {
        let cartSidebar = document.querySelector('.cart-sidebar');
        
        if (!cartSidebar) {
            this.createCartSidebar();
            cartSidebar = document.querySelector('.cart-sidebar');
        }

        cartSidebar.classList.toggle('active');
        this.updateCartDisplay();
    }

    createCartSidebar() {
        const cartHTML = `
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h3>Shopping Cart</h3>
                    <button class="close-cart" onclick="document.querySelector('.cart-sidebar').classList.remove('active')">×</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <!-- Cart items will be loaded here -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: Rp <span id="cart-total-amount">0</span></strong>
                    </div>
                    <button class="checkout-btn thm-btn">
                        <span class="btn-wrap">
                            <span>Checkout</span>
                            <span>Checkout</span>
                        </span>
                        <i class="fas fa-credit-card"></i>
                    </button>
                </div>
            </div>
            <div class="cart-overlay" onclick="document.querySelector('.cart-sidebar').classList.remove('active')"></div>
        `;

        const cartCSS = `
            <style>
                .cart-sidebar {
                    position: fixed;
                    top: 0;
                    right: -400px;
                    width: 400px;
                    height: 100vh;
                    background: white;
                    z-index: 9999;
                    transition: right 0.3s ease;
                    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                    display: flex;
                    flex-direction: column;
                }
                .cart-sidebar.active {
                    right: 0;
                }
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.5);
                    z-index: 9998;
                    display: none;
                }
                .cart-sidebar.active + .cart-overlay {
                    display: block;
                }
                .cart-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .cart-items {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                .cart-item {
                    display: flex;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                }
                .cart-item-image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-right: 15px;
                }
                .cart-item-details {
                    flex: 1;
                }
                .cart-item-title {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .cart-item-price {
                    color: #007cba;
                    font-weight: bold;
                }
                .cart-footer {
                    padding: 20px;
                    border-top: 1px solid #eee;
                }
                .cart-total {
                    margin-bottom: 15px;
                    text-align: center;
                    font-size: 18px;
                }
                .close-cart {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                }
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 5px;
                }
                .quantity-input {
                    width: 50px;
                    text-align: center;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 2px;
                }
                .remove-from-cart {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 2px 6px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', cartCSS);
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    updateCartDisplay() {
        const cartItemsContainer = document.querySelector('#cart-items-container');
        const cartTotalElement = document.querySelector('#cart-total-amount');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
        } else {
            let cartHTML = '';
            this.cart.forEach(item => {
                cartHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">Rp ${this.formatPrice(item.price)}</div>
                            <div class="quantity-controls">
                                <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-product-id="${item.id}">
                                <button class="update-quantity" data-product-id="${item.id}">Update</button>
                                <button class="remove-from-cart" data-product-id="${item.id}">Remove</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            cartItemsContainer.innerHTML = cartHTML;
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = this.formatPrice(this.getCartTotal());
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            alert('Keranjang belanja kosong');
            return;
        }

        // Redirect to checkout page or show checkout modal
        window.location.href = 'checkout.html';
    }

    showCartNotification(message) {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        const notificationCSS = `
            <style>
                .cart-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #28a745;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 4px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            </style>
        `;

        if (!document.querySelector('style[data-cart-notification]')) {
            const style = document.createElement('style');
            style.setAttribute('data-cart-notification', 'true');
            style.textContent = notificationCSS.replace(/<\/?style>/g, '');
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Utility functions
    formatPrice(price) {
        return new Intl.NumberFormat('id-ID').format(price);
    }

    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substr(0, length) + '...';
    }
}

// Initialize e-commerce when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lumakaraEcommerce = new LumakaraEcommerce();
    
    // Load product single page if on shop-single.html
    if (window.location.pathname.includes('shop-single.html')) {
        window.lumakaraEcommerce.loadProductSingle();
    }
});

// Payment integration (Midtrans example)
class LumakaraPayment {
    constructor() {
        this.snapToken = null;
    }

    async processPayment(orderData) {
        try {
            // In real implementation, this would call your backend API
            // For demo purposes, we'll simulate the payment process
            
            const response = await this.createTransaction(orderData);
            
            if (response.snap_token) {
                this.snapToken = response.snap_token;
                
                // Load Midtrans Snap
                window.snap.pay(this.snapToken, {
                    onSuccess: (result) => {
                        this.handlePaymentSuccess(result, orderData);
                    },
                    onPending: (result) => {
                        this.handlePaymentPending(result, orderData);
                    },
                    onError: (result) => {
                        this.handlePaymentError(result);
                    }
                });
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            alert('Terjadi kesalahan dalam memproses pembayaran');
        }
    }

    async createTransaction(orderData) {
        // Simulate API call to create transaction
        // In real implementation, this would be a POST request to your backend
        
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    snap_token: 'demo_snap_token_' + Date.now(),
                    redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/demo_snap_token'
                });
            }, 1000);
        });
    }

    handlePaymentSuccess(result, orderData) {
        // Save order to localStorage (in real app, save to database)
        const orders = JSON.parse(localStorage.getItem('lumakara_orders') || '[]');
        const newOrder = {
            id: Date.now(),
            ...orderData,
            status: 'paid',
            paymentResult: result,
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        localStorage.setItem('lumakara_orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('lumakara_cart');
        
        // Redirect to success page
        window.location.href = 'order-success.html?order_id=' + newOrder.id;
    }

    handlePaymentPending(result, orderData) {
        alert('Pembayaran pending. Silakan selesaikan pembayaran Anda.');
    }

    handlePaymentError(result) {
        alert('Pembayaran gagal. Silakan coba lagi.');
    }
}

// Initialize payment system
window.lumakaraPayment = new LumakaraPayment();