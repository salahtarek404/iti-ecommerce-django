// Smooth scrolling for navbar links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed navbar
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active navbar link
const navLinks = document.querySelectorAll('.nav-items li a');
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 80;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add to cart button functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const image = button.getAttribute('data-image');
        
        let existingItem = cart.find(item => item.id == id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id: id, name: name, price: price, image: image, qty: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart badge if it exists
        const badge = document.getElementById('cart-count');
        if (badge) {
            let count = 0;
            cart.forEach(item => count += item.qty);
            badge.textContent = count;
        }
        
        alert(name + ' added to cart!');
    });
});

// Search and Filtering functionality
const searchBar = document.getElementById('search-bar');
const categoryFilter = document.getElementById('category-filter');
const productCards = document.querySelectorAll('.product-card');

function filterProducts() {
    if (!searchBar || !categoryFilter) return;
    
    const searchTerm = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

if (searchBar) {
    searchBar.addEventListener('input', filterProducts);
}
if (categoryFilter) {
    categoryFilter.addEventListener('change', filterProducts);
}
