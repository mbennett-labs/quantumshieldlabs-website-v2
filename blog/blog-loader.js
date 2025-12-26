/**
 * Blog Loader Script for Quantum Shield Labs
 * Handles dynamic loading of blog posts and category filtering
 * 
 * To add a new blog post:
 * 1. Add the post HTML file to the /blog directory
 * 2. Add an entry to the blogPosts array below
 * 3. The post will automatically appear in the blog grid
 */

// Blog Posts Data - Add new posts here
const blogPosts = [
    {
        id: 1,
        title: "OpenAI's Transparency Crisis Reveals a Pattern Every CISO Should Recognize",
        slug: "openai-transparency-crisis-quantum-security-pattern",
        excerpt: "When economists quit over buried data, it mirrors the denial pattern threatening quantum-unprepared organizations.",
        category: "Quantum Security",
        categoryIcon: "fa-shield-alt",
        date: "December 26, 2024",
        dateShort: "Dec 26, 2024",
        readTime: "8 min",
        author: "Michael Bennett",
        featured: true,
        published: true
    },
    {
        id: 2,
        title: "America Just Hit the Brakes on Quantum Security Preparations",
        slug: "trump-quantum-security-policy-reversal",
        excerpt: "Trump's executive order scaled back post-quantum cryptography mandates. What this means for your organization.",
        category: "Policy Analysis",
        categoryIcon: "fa-gavel",
        date: "June 2025",
        dateShort: "Jun 2025",
        readTime: "6 min",
        author: "Michael Bennett",
        featured: false,
        published: true
    },
    {
        id: 3,
        title: "Why Healthcare Faces Greater Quantum Risk Than Any Other Sector",
        slug: "healthcare-quantum-risk-50-year-sensitivity",
        excerpt: "The 50+ year sensitivity window for medical records creates unique quantum vulnerabilities that other industries don't face.",
        category: "Healthcare IT",
        categoryIcon: "fa-hospital",
        date: "Coming Soon",
        dateShort: "Coming Soon",
        readTime: "10 min",
        author: "Michael Bennett",
        featured: false,
        published: false
    }
];

// Category definitions
const categories = [
    { name: "Quantum Security", icon: "fa-shield-alt", count: 0 },
    { name: "Healthcare IT", icon: "fa-hospital", count: 0 },
    { name: "Policy Analysis", icon: "fa-gavel", count: 0 },
    { name: "CISO Insights", icon: "fa-user-tie", count: 0 },
    { name: "NIST Standards", icon: "fa-certificate", count: 0 },
    { name: "Risk Management", icon: "fa-chart-line", count: 0 },
    { name: "Industry News", icon: "fa-newspaper", count: 0 }
];

/**
 * Render a blog card HTML
 * @param {Object} post - The blog post object
 * @returns {string} - HTML string for the blog card
 */
function renderBlogCard(post) {
    const link = post.published ? `${post.slug}.html` : '#';
    const linkText = post.published ? 'Read More' : 'Coming Soon';
    const linkIcon = post.published ? 'fa-arrow-right' : 'fa-clock';
    
    return `
        <article class="blog-card" data-category="${post.category}">
            <div class="blog-card-image">
                <span class="blog-card-category">${post.category}</span>
                <i class="fas ${post.categoryIcon}"></i>
            </div>
            <div class="blog-card-content">
                <h3>
                    <a href="${link}">
                        ${post.title}
                    </a>
                </h3>
                <div class="blog-card-meta">
                    <span><i class="fas fa-calendar"></i> ${post.dateShort}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                </div>
                <p class="blog-card-excerpt">
                    ${post.excerpt}
                </p>
                <a href="${link}" class="blog-card-link">
                    ${linkText} <i class="fas ${linkIcon}"></i>
                </a>
            </div>
        </article>
    `;
}

/**
 * Render the featured post section
 * @param {Object} post - The featured blog post object
 * @returns {string} - HTML string for the featured post
 */
function renderFeaturedPost(post) {
    if (!post) return '';
    
    return `
        <article class="featured-post">
            <div class="featured-badge">
                <i class="fas fa-star"></i> Featured Post
            </div>
            <div class="featured-content">
                <h2>
                    <a href="${post.slug}.html">
                        ${post.title}
                    </a>
                </h2>
                <div class="featured-meta">
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime} read</span>
                </div>
                <p class="featured-excerpt">
                    ${post.excerpt}
                </p>
                <a href="${post.slug}.html" class="featured-cta">
                    Read Full Analysis <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </article>
    `;
}

/**
 * Filter posts by category
 * @param {string} category - Category name to filter by, or 'all' for all posts
 */
function filterByCategory(category) {
    const cards = document.querySelectorAll('.blog-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active category styling
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.classList.remove('active');
        if (tag.dataset.category === category) {
            tag.classList.add('active');
        }
    });
}

/**
 * Count posts per category
 */
function updateCategoryCounts() {
    categories.forEach(cat => {
        cat.count = blogPosts.filter(post => 
            post.category === cat.name && post.published
        ).length;
    });
}

/**
 * Initialize the blog page
 */
function initBlog() {
    // Update category counts
    updateCategoryCounts();
    
    // Add click handlers to category tags
    document.querySelectorAll('.category-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const category = tag.textContent.trim();
            filterByCategory(category);
        });
    });
    
    console.log('📚 Quantum Shield Labs Blog initialized');
    console.log(`📝 ${blogPosts.filter(p => p.published).length} published posts`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initBlog);

/**
 * Utility: Get post by slug
 * @param {string} slug - Post slug
 * @returns {Object|null} - Post object or null
 */
function getPostBySlug(slug) {
    return blogPosts.find(post => post.slug === slug) || null;
}

/**
 * Utility: Get recent posts
 * @param {number} count - Number of posts to return
 * @returns {Array} - Array of recent posts
 */
function getRecentPosts(count = 5) {
    return blogPosts
        .filter(post => post.published)
        .slice(0, count);
}

/**
 * Utility: Get posts by category
 * @param {string} category - Category name
 * @returns {Array} - Array of posts in category
 */
function getPostsByCategory(category) {
    return blogPosts.filter(post => 
        post.category === category && post.published
    );
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        blogPosts,
        categories,
        renderBlogCard,
        renderFeaturedPost,
        filterByCategory,
        getPostBySlug,
        getRecentPosts,
        getPostsByCategory
    };
}
