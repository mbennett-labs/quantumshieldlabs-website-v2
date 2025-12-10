// Blog post loader for Quantum Shield Labs
// Dynamically loads and displays blog posts


const blogPosts = [
    {
    title: "Pentagon's Quantum Scramble: What SandboxAQ's DoD Contract Means for Healthcare",
    date: "2025-12-10",
    category: "Quantum Security News",
    excerpt: "The Pentagon just contracted SandboxAQ for cryptographic discovery across military systems. If the world's most secure networks are scrambling to inventory quantum vulnerabilities, what does this signal for healthcare organizations protecting 50+ years of PHI?",
    tags: ["quantum security", "DoD", "SandboxAQ", "healthcare", "post-quantum cryptography"],
    slug: "sandboxaq-dod-quantum-security",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
},
    {
        title: "The Quantum Reality Check: What a Former Cambridge Researcher Reveals",
        date: "2025-06-27",
        author: "Michael Bennett",
        category: "Quantum Computing",
        excerpt: "Dr. Mithuna Yoganathan's insights reveal why quantum hardware is succeeding while software lags behind—and what this means for business strategy.",
        tags: ["quantum computing", "business strategy", "research"],
        slug: "quantum-reality-check",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&q=80"
    },
    {
        title: "Trump's Quantum Security Policy Reversal: What It Means for Business",
        date: "2025-06-25",
        author: "Michael Bennett", 
        category: "Cybersecurity",
        excerpt: "Recent policy changes have scaled back post-quantum cryptography mandates. Here's why forward-thinking organizations can't wait for government leadership.",
        tags: ["policy", "post-quantum", "cybersecurity"],
        slug: "trump-quantum-policy-reversal",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80"
    },
    {
        title: "Healthcare AI Security: The Hidden Vulnerabilities",
        date: "2025-06-20",
        author: "Michael Bennett",
        category: "AI Security", 
        excerpt: "As healthcare adopts AI systems, new attack vectors emerge. Learn how to secure AI implementations in medical environments.",
        tags: ["healthcare", "AI security", "medical devices"],
        slug: "healthcare-ai-security",
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
    }
];

function renderBlogPosts() {
    const container = document.getElementById('blog-posts');
    if (!container) return;
    
    const postsHTML = blogPosts.map(post => `
        <article class="blog-post-card rounded-xl overflow-hidden shadow-lg">
            <div class="aspect-video overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover">
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="tag text-xs px-2 py-1 rounded-full">${post.category}</span>
                    <span class="text-gray-400 text-sm">${post.readTime}</span>
                </div>
                
                <h2 class="text-xl font-bold mb-3 hover:text-blue-400 transition">
                    <a href="${post.slug}.html">${post.title}</a>
                </h2>
                
                <p class="text-gray-300 mb-4">${post.excerpt}</p>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    ${post.tags.map(tag => 
                        `<span class="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">${tag}</span>`
                    ).join('')}
                </div>
                
                <div class="flex items-center justify-between text-sm text-gray-400">
                    <span>By ${post.author}</span>
                    <span>${post.date}</span>
                </div>
                
                <a href="${post.slug}.html" class="inline-block mt-4 text-blue-500 hover:text-blue-400 font-medium">
                    Read More <i class="fas fa-arrow-right ml-1"></i>
                </a>
            </div>
        </article>
    `).join('');
    
    container.innerHTML = postsHTML;
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', renderBlogPosts);
