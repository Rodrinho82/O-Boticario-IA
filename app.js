// O Boticário IA - VERSIÓN SIN LOGIN - ACCESO DIRECTO - NAVEGACIÓN CORREGIDA
class OBoticarioApp {
    constructor() {
        // Estado de la aplicación - USUARIO DEMO PRECARGADO
        this.currentUser = {
            id: 'user_demo_boticario',
            name: 'Usuario Demo',
            email: 'demo@boticario.com',
            plan: 'pro',
            createdAt: new Date().toISOString()
        };
        this.isLoggedIn = true; // SIEMPRE LOGUEADO
        
        // Fechas y datos del calendario
        this.currentCalendarDate = new Date();
        this.selectedDate = null;
        this.currentGeneratorImage = null;
        this.currentProductImage = null;

        // Arrays de datos principales
        this.products = [];
        this.posts = [];
        this.scheduledPosts = [];
        this.automationRules = [];
        this.apis = [];

        // Generador de contenido
        this.contentGenerator = new ContentGenerator();
        
        this.init();
    }

    async init() {
        console.log('🚀 Inicializando O Boticário IA - ACCESO DIRECTO SIN LOGIN');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupDirectApp();
            });
        } else {
            this.setupDirectApp();
        }
    }

    async setupDirectApp() {
        console.log('📱 Configurando aplicación con acceso directo...');
        
        // PASO 1: Ocultar completamente el modal de login
        this.hideLoginModal();
        
        // PASO 2: Mostrar aplicación principal inmediatamente
        this.showMainApp();
        
        // PASO 3: Inicializar todos los datos
        await this.initializeAllData();
        
        // PASO 4: Configurar handlers principales
        this.setupMainAppHandlers();
        
        // PASO 5: Mostrar dashboard por defecto
        this.switchSection('dashboard');
        
        console.log('✅ Aplicación inicializada - Usuario demo activo');
    }

    hideLoginModal() {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
            loginModal.style.display = 'none';
            loginModal.classList.add('hidden');
        }
    }

    showMainApp() {
        const mainApp = document.getElementById('mainApp');
        if (mainApp) {
            mainApp.style.display = 'flex';
        }
        
        // Configurar información del usuario
        const userNameEl = document.getElementById('currentUserName');
        if (userNameEl) {
            userNameEl.textContent = this.currentUser.name;
        }
    }

    async initializeAllData() {
        console.log('📊 Inicializando todos los datos...');
        
        // Inicializar productos
        await this.loadInitialProducts();
        
        // Cargar datos guardados
        this.loadSavedData();
        
        // Inicializar calendario
        this.initCalendar();
        
        // Inicializar automatización
        this.initAutomation();
        
        // Inicializar APIs
        this.initAPIs();
        
        // Actualizar estadísticas
        this.updateDashboardStats();
        
        console.log('✅ Todos los datos inicializados correctamente');
    }

    loadSavedData() {
        try {
            const savedPosts = localStorage.getItem('user_posts');
            if (savedPosts) this.posts = JSON.parse(savedPosts);
        } catch (error) {
            this.posts = [];
        }

        try {
            const savedScheduled = localStorage.getItem('scheduled_posts');
            if (savedScheduled) this.scheduledPosts = JSON.parse(savedScheduled);
        } catch (error) {
            this.scheduledPosts = [];
        }

        try {
            const savedRules = localStorage.getItem('automation_rules');
            if (savedRules) this.automationRules = JSON.parse(savedRules);
        } catch (error) {
            this.automationRules = [];
        }

        try {
            const savedAPIs = localStorage.getItem('api_connections');
            if (savedAPIs) this.apis = JSON.parse(savedAPIs);
        } catch (error) {
            // Se cargarán en initAPIs
        }
    }

    // === SETUP PRINCIPAL ===
    setupMainAppHandlers() {
        console.log('🔧 Configurando handlers principales...');
        this.setupNavigation();
        this.setupUserDropdown();
    }

    setupNavigation() {
        console.log('🧭 Configurando navegación...');
        
        // Remover todos los event listeners existentes y configurar nuevos
        document.querySelectorAll('.nav-item').forEach((item) => {
            // Clonar elemento para remover listeners existentes
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // Configurar nuevo event listener
            newItem.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const section = newItem.getAttribute('data-section');
                console.log(`🔗 Navegación clickeada: ${section}`);
                
                if (section) {
                    // Actualizar estado visual de navegación
                    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                    newItem.classList.add('active');
                    
                    // Cambiar sección
                    this.switchSection(section);
                }
            });
        });
        
        console.log('✅ Navegación configurada');
    }

    setupUserDropdown() {
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }
        
        document.addEventListener('click', (e) => {
            const userProfile = document.querySelector('.user-profile');
            const dropdown = document.getElementById('userDropdown');
            
            if (userProfile && dropdown && 
                !userProfile.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    }

    toggleUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    logout() {
        if (confirm('¿Cerrar sesión?')) {
            this.showToast('✅ Sesión cerrada');
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
        this.toggleUserMenu();
    }

    // === NAVEGACIÓN ENTRE SECCIONES - CORREGIDA ===
    switchSection(sectionName) {
        console.log(`📄 Cambiando a sección: ${sectionName}`);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar sección objetivo
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log(`✅ Sección ${sectionName} activada`);
            
            // Renderizar contenido específico de la sección
            this.renderSectionContent(sectionName);
        } else {
            console.error(`❌ Sección ${sectionName} no encontrada`);
        }
    }

    renderSectionContent(sectionName) {
        console.log(`🎨 Renderizando contenido para: ${sectionName}`);
        
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'generador':
                this.renderGenerator();
                break;
            case 'biblioteca':
                this.renderBibliotecaPosts();
                break;
            case 'productos':
                this.renderProductsGrid();
                break;
            case 'calendario':
                this.renderCalendar();
                this.renderUpcomingPosts();
                break;
            case 'automatizacion':
                this.renderAutomationRules();
                this.updateAutomationStats();
                break;
            case 'apis':
                this.renderAPIs();
                break;
            default:
                console.warn(`⚠️ Sección no reconocida: ${sectionName}`);
        }
    }

    // === DASHBOARD ===
    renderDashboard() {
        console.log('📊 Renderizando dashboard...');
        this.updateDashboardStats();
        this.renderRecentActivity();
    }

    updateDashboardStats() {
        const postsCount = document.getElementById('postsGenerated');
        const productsCount = document.getElementById('productsCount');
        const scheduledCount = document.getElementById('scheduledCount');
        const automationCount = document.getElementById('automationRules');
        
        if (postsCount) postsCount.textContent = this.posts.length;
        if (productsCount) productsCount.textContent = this.products.length;
        if (scheduledCount) scheduledCount.textContent = this.scheduledPosts.length;
        if (automationCount) automationCount.textContent = this.automationRules.filter(r => r.active).length;
    }

    renderRecentActivity() {
        const container = document.getElementById('activityList');
        if (!container) return;
        
        const activities = [];
        
        // Añadir actividad de bienvenida siempre
        activities.push({
            icon: 'fas fa-rocket',
            text: '<strong>¡Bienvenido a O Boticário IA!</strong> Tu plataforma de contenido está lista',
            time: 'Ahora',
            type: 'post'
        });
        
        this.posts.slice(-3).forEach(post => {
            activities.push({
                icon: 'fas fa-edit',
                text: `Post creado: "${post.content.substring(0, 40)}..."`,
                time: this.timeAgo(post.createdAt),
                type: 'post'
            });
        });
        
        this.products.slice(-2).forEach(product => {
            activities.push({
                icon: 'fas fa-plus',
                text: `Producto disponible: ${product.nombre}`,
                time: this.timeAgo(product.createdAt),
                type: 'product'
            });
        });
        
        this.scheduledPosts.slice(-2).forEach(post => {
            activities.push({
                icon: 'fas fa-calendar-plus',
                text: `Publicación programada para ${post.platform}`,
                time: this.timeAgo(post.createdAt),
                type: 'schedule'
            });
        });
        
        container.innerHTML = activities.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    timeAgo(dateString) {
        const now = new Date();
        const past = new Date(dateString);
        const diffInMinutes = Math.floor((now - past) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Ahora';
        if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
        if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
        return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
    }

    // === GENERADOR IA ===
    renderGenerator() {
        console.log('🧠 Renderizando generador...');
        this.updateProductSelects();
        this.setupGeneratorHandlers();
    }

    updateProductSelects() {
        const productSelect = document.getElementById('selectedProduct');
        if (productSelect && this.products) {
            productSelect.innerHTML = '<option value="">Selecciona un producto</option>' +
                this.products.map(product => 
                    `<option value="${product.id}">${product.nombre}</option>`
                ).join('');
        }
    }

    setupGeneratorHandlers() {
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.replaceWith(generateBtn.cloneNode(true));
            document.getElementById('generateBtn').addEventListener('click', () => {
                this.generateContent();
            });
        }

        const saveBtn = document.getElementById('savePostBtn');
        if (saveBtn) {
            saveBtn.replaceWith(saveBtn.cloneNode(true));
            document.getElementById('savePostBtn').addEventListener('click', () => {
                this.saveGeneratedPost();
            });
        }
    }

    async generateContent() {
        console.log('🧠 Generando contenido...');
        
        const productId = document.getElementById('selectedProduct')?.value;
        const platform = document.getElementById('platform')?.value;
        const contentType = document.getElementById('contentType')?.value;
        const tone = document.getElementById('toneSelect')?.value;
        const length = document.getElementById('postLength')?.value;

        if (!productId) {
            this.showToast('Selecciona un producto', 'error');
            return;
        }

        const btn = document.getElementById('generateBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';

        try {
            const product = this.products.find(p => p.id === productId);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            
            console.log(`📝 Generando para: ${product.nombre}, longitud: ${length}`);
            
            const generatedContent = await this.contentGenerator.generateContentForProduct(
                product, platform, contentType, tone, length
            );
            
            this.displayGeneratedContent(generatedContent);
            this.showToast('✅ Contenido generado');
            
        } catch (error) {
            console.log('Error generando contenido:', error);
            this.showToast('Error al generar contenido', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    displayGeneratedContent(content) {
        const textPreview = document.getElementById('textPreview');
        const generatedContentDiv = document.getElementById('generatedContent');
        const saveBtn = document.getElementById('savePostBtn');
        
        if (textPreview && generatedContentDiv) {
            textPreview.innerHTML = content;
            generatedContentDiv.style.display = 'block';
            
            if (saveBtn) {
                saveBtn.disabled = false;
            }
            
            this.updateWordCount(content);
            
            console.log('✅ Contenido mostrado, palabras:', content.split(' ').length);
        }
    }

    updateWordCount(content) {
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        const charCount = content.length;
        
        const wordCountEl = document.getElementById('wordCount');
        const charCountEl = document.getElementById('charCount');
        
        if (wordCountEl) wordCountEl.textContent = `${wordCount} palabras`;
        if (charCountEl) charCountEl.textContent = `${charCount} caracteres`;
    }

    regenerateContent() {
        this.generateContent();
    }

    // === BIBLIOTECA DE POSTS ===
    async saveGeneratedPost() {
        console.log('💾 Guardando post...');
        
        const textContent = document.getElementById('textPreview')?.textContent;
        const imageUrl = this.currentGeneratorImage?.url;
        const productId = document.getElementById('selectedProduct')?.value;
        const platform = document.getElementById('platform')?.value;

        if (!textContent || textContent === 'El contenido generado aparecerá aquí...') {
            this.showToast('Genera contenido primero', 'error');
            return;
        }

        const post = {
            id: `post_${Date.now()}`,
            content: textContent,
            image: imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
            productId: productId,
            platform: platform,
            status: 'draft',
            createdAt: new Date().toISOString(),
            userId: this.currentUser?.id,
            wordCount: textContent.split(' ').length
        };

        try {
            this.posts.push(post);
            localStorage.setItem('user_posts', JSON.stringify(this.posts));
            
            this.renderBibliotecaPosts();
            this.updateDashboardStats();
            
            this.showToast('✅ Post guardado');
            
            // Limpiar formulario
            document.getElementById('textPreview').innerHTML = '<p class="preview-placeholder">El contenido generado aparecerá aquí...</p>';
            document.getElementById('savePostBtn').disabled = true;
            document.getElementById('generatedContent').style.display = 'none';
            
            console.log('✅ Post guardado exitosamente');
            
        } catch (error) {
            console.log('Error guardando post:', error);
            this.showToast('Error guardando post', 'error');
        }
    }

    renderBibliotecaPosts() {
        console.log('📚 Renderizando biblioteca de posts...');
        const container = document.getElementById('createdPostsGrid');
        if (!container) return;
        
        console.log(`📚 Renderizando ${this.posts.length} posts`);
        
        if (this.posts.length > 0) {
            container.innerHTML = this.posts.map(post => {
                const product = this.products.find(p => p.id === post.productId);
                return `
                    <div class="post-card" data-post-id="${post.id}">
                        <div class="post-image">
                            ${post.image ? `<img src="${post.image}" alt="Post image" style="width: 100%; height: 200px; object-fit: cover;">` : 
                              '<div class="no-image"><i class="fas fa-image"></i></div>'}
                        </div>
                        <div class="post-content">
                            <p class="post-text">${post.content.substring(0, 100)}...</p>
                            <div class="post-meta">
                                <span class="platform platform-${post.platform}">
                                    <i class="fab fa-${post.platform}"></i> ${post.platform}
                                </span>
                                <span class="date">${new Date(post.createdAt).toLocaleDateString()}</span>
                                <span class="word-count">${post.wordCount} palabras</span>
                            </div>
                            <div class="post-actions">
                                <button onclick="app.editPost('${post.id}')" class="btn-sm btn-secondary">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button onclick="app.publishPost('${post.id}')" class="btn-sm btn-primary">
                                    <i class="fas fa-share"></i> Publicar
                                </button>
                                <button onclick="app.deletePost('${post.id}')" class="btn-sm btn-danger">
                                    <i class="fas fa-trash"></i> Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No hay posts guardados</h3>
                    <p>¡Crea tu primer post con el Generador IA!</p>
                    <button onclick="app.switchSection('generador')" class="btn-primary">
                        <i class="fas fa-magic"></i> Crear Post
                    </button>
                </div>
            `;
        }
    }

    editPost(postId) {
        this.showToast('✏️ Función de edición disponible');
    }

    publishPost(postId) {
        this.showToast('🚀 Post publicado');
    }

    deletePost(postId) {
        if (confirm('¿Eliminar este post?')) {
            this.posts = this.posts.filter(post => post.id !== postId);
            localStorage.setItem('user_posts', JSON.stringify(this.posts));
            this.renderBibliotecaPosts();
            this.updateDashboardStats();
            this.showToast('🗑️ Post eliminado');
        }
    }

    // === PRODUCTOS ===
    async loadInitialProducts() {
        const existingProducts = localStorage.getItem('user_products');
        
        if (!existingProducts || JSON.parse(existingProducts).length === 0) {
            console.log('🛍️ Cargando productos iniciales...');
            
            this.products = [
                {
                    id: "aura_helena",
                    nombre: "Aura Eau de Parfum by Helena Coelho",
                    categoria: "Perfumería",
                    imagen: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
                    descripcion: "Fragancia única con notas de vainilla y especias exóticas que despiertan los sentidos",
                    precio: "$89.90",
                    stock: 45,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "malbec_intense", 
                    nombre: "Malbec Intense Collection",
                    categoria: "Perfumería",
                    imagen: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=300&h=300&fit=crop",
                    descripcion: "Elegancia masculina con notas amaderadas profundas y carácter único",
                    precio: "$75.50",
                    stock: 32,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "morango_leite",
                    nombre: "Morango e Leite Body Lotion",
                    categoria: "Cuidado Corporal",
                    imagen: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop", 
                    descripcion: "Cremosidad nostálgica con textura sedosa que hidrata y perfuma suavemente",
                    precio: "$28.90",
                    stock: 78,
                    createdAt: new Date().toISOString()
                },
                {
                    id: "serum_hialuronico",
                    nombre: "Botik Ácido Hialurónico Sérum",
                    categoria: "Skincare",
                    imagen: "https://images.unsplash.com/photo-1620916297067-e8c7f5f8c5a5?w=300&h=300&fit=crop",
                    descripcion: "Sérum hidratante con ácido hialurónico para una piel radiante",
                    precio: "$45.90", 
                    stock: 56,
                    createdAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('user_products', JSON.stringify(this.products));
            console.log(`✅ ${this.products.length} productos iniciales cargados`);
        } else {
            this.products = JSON.parse(existingProducts);
            console.log(`✅ ${this.products.length} productos cargados`);
        }
        
        this.renderProductsGrid();
        this.updateProductSelects();
    }

    renderProductsGrid() {
        console.log('🛍️ Renderizando productos...');
        const container = document.getElementById('productsGrid');
        if (!container) return;
        
        if (this.products.length > 0) {
            container.innerHTML = this.products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.imagen}" alt="${product.nombre}" style="width: 100%; height: 200px; object-fit: cover;">
                        <div class="product-badge">${product.categoria}</div>
                    </div>
                    <div class="product-info">
                        <h4 class="product-name">${product.nombre}</h4>
                        <p class="product-description">${product.descripcion}</p>
                        <div class="product-meta">
                            <span class="product-price">${product.precio}</span>
                            <span class="product-stock ${product.stock < 20 ? 'low-stock' : ''}">
                                <i class="fas fa-boxes"></i> ${product.stock} en stock
                            </span>
                        </div>
                        <div class="product-actions">
                            <button onclick="app.editProduct('${product.id}')" class="btn-sm btn-secondary">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button onclick="app.generatePostForProduct('${product.id}')" class="btn-sm btn-primary">
                                <i class="fas fa-magic"></i> Generar Post
                            </button>
                            <button onclick="app.deleteProduct('${product.id}')" class="btn-sm btn-danger">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No hay productos</h3>
                    <p>¡Añade tu primer producto!</p>
                    <button onclick="app.openAddProductModal()" class="btn-primary">
                        <i class="fas fa-plus"></i> Añadir Producto
                    </button>
                </div>
            `;
        }
    }

    openAddProductModal() {
        this.showToast('✏️ Función de añadir producto disponible');
    }

    editProduct(productId) {
        this.showToast('✏️ Función de edición disponible');
    }

    generatePostForProduct(productId) {
        this.switchSection('generador');
        setTimeout(() => {
            const productSelect = document.getElementById('selectedProduct');
            if (productSelect) {
                productSelect.value = productId;
            }
        }, 100);
    }

    deleteProduct(productId) {
        if (confirm('¿Eliminar este producto?')) {
            this.products = this.products.filter(product => product.id !== productId);
            localStorage.setItem('user_products', JSON.stringify(this.products));
            this.renderProductsGrid();
            this.updateProductSelects();
            this.updateDashboardStats();
            this.showToast('🗑️ Producto eliminado');
        }
    }

    // === CALENDARIO ===
    initCalendar() {
        this.currentCalendarDate = new Date();
        this.loadScheduledPosts();
        this.renderCalendar();
        console.log('📅 Calendario inicializado');
    }

    loadScheduledPosts() {
        try {
            const savedScheduled = localStorage.getItem('scheduled_posts');
            if (savedScheduled) {
                this.scheduledPosts = JSON.parse(savedScheduled);
            }
        } catch (error) {
            this.scheduledPosts = [];
        }
    }

    renderCalendar() {
        console.log('📅 Renderizando calendario...');
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        const currentMonth = document.getElementById('currentMonth');
        if (currentMonth) {
            currentMonth.textContent = `${monthNames[this.currentCalendarDate.getMonth()]} ${this.currentCalendarDate.getFullYear()}`;
        }
        
        const daysContainer = document.getElementById('calendarDays');
        if (!daysContainer) return;
        
        daysContainer.innerHTML = '';
        
        const year = this.currentCalendarDate.getFullYear();
        const month = this.currentCalendarDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            if (date.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            if (date.toDateString() === new Date().toDateString()) {
                dayElement.classList.add('today');
            }
            
            const scheduledPost = this.scheduledPosts.find(post => 
                new Date(post.scheduledDate).toDateString() === date.toDateString()
            );
            
            if (scheduledPost) {
                dayElement.classList.add('has-posts');
                dayElement.innerHTML = `
                    <span class="day-number">${date.getDate()}</span>
                    <div class="post-indicators">
                        <span class="post-indicator" title="${scheduledPost.platform}">
                            <i class="fab fa-${scheduledPost.platform}"></i>
                        </span>
                    </div>
                `;
            } else {
                dayElement.innerHTML = `<span class="day-number">${date.getDate()}</span>`;
            }
            
            dayElement.addEventListener('click', () => this.selectCalendarDate(date));
            
            daysContainer.appendChild(dayElement);
        }
        
        this.renderUpcomingPosts();
    }

    selectCalendarDate(date) {
        this.showToast('📅 Función de programar posts disponible');
    }

    previousMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
        this.renderCalendar();
    }

    openScheduleModal() {
        this.showToast('📅 Función de programar posts disponible');
    }

    renderUpcomingPosts() {
        const container = document.getElementById('upcomingPostsList');
        if (!container) return;
        
        container.innerHTML = `
            <div class="empty-state-small">
                <i class="fas fa-calendar-alt"></i>
                <p>No hay publicaciones programadas</p>
                <button onclick="app.openScheduleModal()" class="btn-sm btn-primary">Programar ahora</button>
            </div>
        `;
    }

    // === AUTOMATIZACIÓN ===
    initAutomation() {
        if (this.automationRules.length === 0) {
            this.automationRules = [
                {
                    id: 'rule_posts_matutinos',
                    name: 'Posts Matutinos Automáticos',
                    trigger: 'schedule',
                    triggerConfig: { 
                        time: '08:00', 
                        days: ['monday', 'wednesday', 'friday']
                    },
                    action: 'create_post',
                    actionConfig: { 
                        contentType: 'promocional', 
                        platform: 'instagram'
                    },
                    active: true,
                    description: 'Crear posts promocionales automáticamente los lunes, miércoles y viernes a las 8:00 AM',
                    createdAt: new Date().toISOString(),
                    executionCount: 24
                },
                {
                    id: 'rule_engagement_response',
                    name: 'Respuesta por Alto Engagement',
                    trigger: 'engagement',
                    triggerConfig: {
                        threshold: 100,
                        metric: 'likes',
                        timeWindow: '1h'
                    },
                    action: 'create_story',
                    actionConfig: {
                        contentType: 'agradecimiento',
                        platform: 'instagram'
                    },
                    active: false,
                    description: 'Crear story de agradecimiento cuando un post supere 100 likes en una hora',
                    createdAt: new Date().toISOString(),
                    executionCount: 0
                }
            ];
            
            localStorage.setItem('automation_rules', JSON.stringify(this.automationRules));
        }
        
        this.renderAutomationRules();
        this.updateAutomationStats();
        console.log('🤖 Automatización inicializada');
    }

    renderAutomationRules() {
        console.log('🤖 Renderizando reglas de automatización...');
        const container = document.getElementById('rulesList');
        if (!container) return;
        
        if (this.automationRules.length > 0) {
            container.innerHTML = this.automationRules.map(rule => `
                <div class="rule-card ${rule.active ? 'active' : 'inactive'}" data-rule-id="${rule.id}">
                    <div class="rule-title">
                        <h4>${rule.name}</h4>
                        <div class="rule-status">
                            <span class="status-indicator ${rule.active ? 'active' : 'inactive'}"></span>
                            <span class="status-text">${rule.active ? 'Activa' : 'Inactiva'}</span>
                        </div>
                    </div>
                    <p class="rule-description">${rule.description}</p>
                    <div class="rule-details">
                        <div class="rule-detail">
                            <strong>Disparador:</strong> 
                            <span class="trigger-badge">${this.getTriggerText(rule.trigger)}</span>
                        </div>
                        <div class="rule-detail">
                            <strong>Acción:</strong> 
                            <span class="action-badge">${this.getActionText(rule.action)}</span>
                        </div>
                    </div>
                    <div class="execution-count">
                        <i class="fas fa-play-circle"></i> ${rule.executionCount || 0} ejecuciones
                    </div>
                    <div class="rule-actions">
                        <button onclick="app.toggleRule('${rule.id}')" class="btn-sm ${rule.active ? 'btn-warning' : 'btn-success'}">
                            <i class="fas fa-${rule.active ? 'pause' : 'play'}"></i>
                            ${rule.active ? 'Desactivar' : 'Activar'}
                        </button>
                        <button onclick="app.editRule('${rule.id}')" class="btn-sm btn-secondary">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button onclick="app.testRule('${rule.id}')" class="btn-sm btn-info">
                            <i class="fas fa-play"></i> Probar
                        </button>
                        <button onclick="app.deleteRule('${rule.id}')" class="btn-sm btn-danger">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-robot"></i>
                    <h3>No hay reglas de automatización</h3>
                    <p>¡Crea tu primera regla!</p>
                    <button onclick="app.openRuleModal()" class="btn-primary">
                        <i class="fas fa-plus"></i> Nueva Regla
                    </button>
                </div>
            `;
        }
    }

    updateAutomationStats() {
        const activeRulesCount = document.getElementById('activeRulesCount');
        const automatedPostsCount = document.getElementById('automatedPostsCount');
        
        if (activeRulesCount) {
            activeRulesCount.textContent = this.automationRules.filter(rule => rule.active).length;
        }
        
        if (automatedPostsCount) {
            const totalExecutions = this.automationRules.reduce((sum, rule) => sum + (rule.executionCount || 0), 0);
            automatedPostsCount.textContent = totalExecutions;
        }
    }

    getTriggerText(trigger) {
        switch(trigger) {
            case 'schedule': return 'Programación temporal';
            case 'engagement': return 'Nivel de engagement';
            case 'trending': return 'Producto en tendencia';
            case 'promotion': return 'Promoción activa';
            case 'inventory': return 'Nivel de inventario';
            default: return trigger;
        }
    }

    getActionText(action) {
        switch(action) {
            case 'create_post': return 'Crear post automático';
            case 'create_story': return 'Crear story';
            case 'send_notification': return 'Enviar notificación';
            case 'schedule_post': return 'Programar publicación';
            default: return action;
        }
    }

    openRuleModal() {
        this.showToast('🤖 Función de automatización disponible');
    }

    toggleRule(ruleId) {
        const rule = this.automationRules.find(r => r.id === ruleId);
        if (rule) {
            rule.active = !rule.active;
            localStorage.setItem('automation_rules', JSON.stringify(this.automationRules));
            
            this.renderAutomationRules();
            this.updateAutomationStats();
            
            this.showToast(`✅ Regla ${rule.active ? 'activada' : 'desactivada'}`);
        }
    }

    editRule(ruleId) {
        this.showToast('✏️ Función disponible');
    }

    testRule(ruleId) {
        const rule = this.automationRules.find(r => r.id === ruleId);
        if (!rule) return;
        
        this.showToast('🧪 Probando regla...', 'info');
        
        setTimeout(() => {
            rule.executionCount = (rule.executionCount || 0) + 1;
            localStorage.setItem('automation_rules', JSON.stringify(this.automationRules));
            
            this.renderAutomationRules();
            this.showToast(`✅ Regla "${rule.name}" ejecutada`);
        }, 2000);
    }

    deleteRule(ruleId) {
        if (confirm('¿Eliminar esta regla?')) {
            this.automationRules = this.automationRules.filter(rule => rule.id !== ruleId);
            localStorage.setItem('automation_rules', JSON.stringify(this.automationRules));
            
            this.renderAutomationRules();
            this.updateAutomationStats();
            
            this.showToast('🗑️ Regla eliminada');
        }
    }

    // === APIS ===
    initAPIs() {
        if (this.apis.length === 0) {
            this.apis = [
                { 
                    id: 'instagram', 
                    name: 'Instagram Business', 
                    connected: false, 
                    icon: 'fab fa-instagram',
                    color: '#E4405F',
                    description: 'Conecta tu cuenta de Instagram Business para publicación automática',
                    followers: 0,
                    posts: 0,
                    engagement: 0
                },
                { 
                    id: 'facebook', 
                    name: 'Facebook Pages', 
                    connected: false, 
                    icon: 'fab fa-facebook-f',
                    color: '#1877F2',
                    description: 'Conecta tu página de Facebook para gestión completa',
                    followers: 0,
                    posts: 0,
                    engagement: 0
                },
                { 
                    id: 'tiktok', 
                    name: 'TikTok Business', 
                    connected: false, 
                    icon: 'fab fa-tiktok',
                    color: '#000000',
                    description: 'Conecta tu cuenta de TikTok Business para videos',
                    followers: 0,
                    posts: 0,
                    engagement: 0
                },
                { 
                    id: 'twitter', 
                    name: 'Twitter API v2', 
                    connected: false, 
                    icon: 'fab fa-twitter',
                    color: '#1DA1F2',
                    description: 'Conecta tu cuenta de Twitter para tweets automatizados',
                    followers: 0,
                    posts: 0,
                    engagement: 0
                }
            ];
            
            localStorage.setItem('api_connections', JSON.stringify(this.apis));
        }
        
        this.renderAPIs();
        console.log('🔗 APIs inicializadas');
    }

    renderAPIs() {
        console.log('🔗 Renderizando APIs...');
        const container = document.getElementById('apisContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="apis-stats">
                <div class="api-stat-card">
                    <i class="fas fa-link"></i>
                    <div class="stat-content">
                        <h4>${this.apis.filter(api => api.connected).length}</h4>
                        <p>Conectadas</p>
                    </div>
                </div>
                <div class="api-stat-card">
                    <i class="fas fa-share-alt"></i>
                    <div class="stat-content">
                        <h4>${this.apis.reduce((sum, api) => sum + (api.posts || 0), 0)}</h4>
                        <p>Posts Publicados</p>
                    </div>
                </div>
            </div>
            
            <div class="apis-grid">
                ${this.apis.map(api => `
                    <div class="api-card ${api.connected ? 'connected' : 'disconnected'}" data-api-id="${api.id}">
                        <div class="api-header">
                            <div class="api-icon" style="color: ${api.color}">
                                <i class="${api.icon}"></i>
                            </div>
                            <div class="api-info">
                                <h4>${api.name}</h4>
                                <p class="api-description">${api.description}</p>
                            </div>
                            <div class="api-status">
                                <span class="status-indicator ${api.connected ? 'connected' : 'disconnected'}"></span>
                                <span class="status-text">${api.connected ? 'Conectado' : 'Desconectado'}</span>
                            </div>
                        </div>
                        
                        <div class="api-actions">
                            ${api.connected ? `
                                <button onclick="app.configureAPI('${api.id}')" class="btn-sm btn-secondary">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button onclick="app.testAPI('${api.id}')" class="btn-sm btn-info">
                                    <i class="fas fa-paper-plane"></i> Probar
                                </button>
                                <button onclick="app.disconnectAPI('${api.id}')" class="btn-sm btn-danger">
                                    <i class="fas fa-unlink"></i> Desconectar
                                </button>
                            ` : `
                                <button onclick="app.connectAPI('${api.id}')" class="btn-sm btn-primary">
                                    <i class="fas fa-link"></i> Conectar
                                </button>
                            `}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    connectAPI(apiId) {
        this.showToast('🔗 Función de conexión de APIs disponible');
    }

    configureAPI(apiId) {
        this.showToast('⚙️ Función disponible');
    }

    testAPI(apiId) {
        this.showToast('🧪 Función disponible');
    }

    disconnectAPI(apiId) {
        this.showToast('🔌 Función disponible');
    }

    // === UTILIDADES ===
    showToast(message, type = 'success') {
        console.log(`🍞 TOAST [${type}]: ${message}`);
        
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// === GENERADOR DE CONTENIDO ===
class ContentGenerator {
    generateContent(product, platform, contentType, tone, length) {
        const wordTargets = {
            corto: { min: 50, max: 80 },
            medio: { min: 80, max: 150 },
            largo: { min: 150, max: 250 },
            muy_largo: { min: 250, max: 350 }
        };
        
        const target = wordTargets[length];
        let content = this.getBaseContent(product, contentType, tone);
        
        // Ajustar a longitud exacta
        const words = content.split(' ');
        const currentLength = words.length;
        
        if (currentLength < target.min) {
            const expansions = this.getExpansions(product, contentType);
            while (content.split(' ').length < target.min && expansions.length > 0) {
                const expansion = expansions.shift();
                content += ' ' + expansion;
            }
        } else if (currentLength > target.max) {
            content = words.slice(0, target.max).join(' ');
        }
        
        return content;
    }
    
    getExpansions(product, contentType) {
        return [
            `Su fórmula única combina ingredientes naturales de la más alta calidad.`,
            `Desarrollado por expertos en ${product.categoria} para resultados excepcionales.`,
            `Miles de clientes ya han experimentado los beneficios transformadores.`,
            `La textura sedosa y el aroma cautivante hacen de cada aplicación un momento especial.`,
            `Ideal para todo tipo de piel, respetando tu sensibilidad natural.`,
            `Disponible en todas nuestras tiendas físicas y plataforma online.`,
            `Forma parte de la rutina de belleza de celebrities reconocidas.`,
            `Su tecnología innovadora garantiza resultados visibles desde la primera semana.`,
            `Testado dermatológicamente para asegurar la máxima seguridad.`,
            `Con certificación cruelty-free y ingredientes sostenibles.`
        ];
    }
    
    getBaseContent(product, contentType, tone) {
        const templates = {
            promocional: {
                profesional: `✨ Descubre ${product.nombre}, ${product.descripcion}. Una creación excepcional de O Boticário.`,
                casual: `¡Hola beautiful! 💕 Te presento ${product.nombre} - ${product.descripcion}. ¡Estoy obsesionada!`,
                divertido: `🎉 ¡Wow! ${product.nombre} es INCREÍBLE. ${product.descripcion}. ¡No puedes perdértelo!`,
                elegante: `Con el mayor placer presentamos ${product.nombre}. ${product.descripcion}. Elegancia redefinida.`
            },
            educativo: {
                profesional: `Conoce los beneficios de ${product.nombre}: ${product.descripcion}. Tu piel lo agradecerá.`,
                casual: `¿Sabías que ${product.nombre} puede transformar tu rutina? ${product.descripcion}.`,
                divertido: `¡Dato curioso! ${product.nombre} es el secreto mejor guardado. ${product.descripcion}.`
            },
            lifestyle: {
                profesional: `Integra ${product.nombre} en tu rutina diaria. ${product.descripcion}.`,
                casual: `Mi nuevo must-have: ${product.nombre}. ${product.descripcion}. ¡Game changer!`,
                divertido: `Plot twist: ${product.nombre} cambió mi vida. ${product.descripcion}. ¡Sin mentiras!`
            }
        };
        
        return templates[contentType]?.[tone] || templates.promocional.profesional;
    }

    async generateContentForProduct(product, platform, contentType, tone, length) {
        await this.simulateDelay();
        const content = this.generateContent(product, platform, contentType, tone, length);
        return content;
    }

    simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 400));
    }
}

// === INICIALIZACIÓN GLOBAL INMEDIATA ===
let app;

function initializeApp() {
    if (window.app) {
        console.log('⚠️ App ya existe, no reinicializar');
        return;
    }
    
    console.log('✨ Inicializando O Boticário IA - ACCESO DIRECTO SIN LOGIN');
    app = window.app = new OBoticarioApp();
}

// Inicialización inmediata con múltiples estrategias
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Backup para asegurar inicialización
setTimeout(initializeApp, 100);