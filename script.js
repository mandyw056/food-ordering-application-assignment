// Toggle Login/Register Forms
document.getElementById('login-btn').onclick = () => {
    document.querySelector('.login-form-container').classList.toggle('active');
};

document.getElementById('register-btn').onclick = () => {
    document.querySelector('.register-form-container').classList.toggle('active');
};

document.getElementById('close-login').onclick = () => {
    document.querySelector('.login-form-container').classList.remove('active');
};

document.getElementById('close-register').onclick = () => {
    document.querySelector('.register-form-container').classList.remove('active');
};

// Switch between Login and Register forms
document.getElementById('register-link').onclick = (e) => {
    e.preventDefault();
    document.querySelector('.login-form-container').classList.remove('active');
    document.querySelector('.register-form-container').classList.add('active');
};

document.getElementById('login-link').onclick = (e) => {
    e.preventDefault();
    document.querySelector('.register-form-container').classList.remove('active');
    document.querySelector('.login-form-container').classList.add('active');
};

// Mobile Menu Toggle
document.getElementById('menu-btn').onclick = () => {
    document.querySelector('.navbar').classList.toggle('active');
};

// Category Filter
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.box');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        // Filter menu items
        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Shopping Cart Functionality
const cartBtn = document.querySelector('a[href="#cart"]');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total h4 span');
const cartCount = document.getElementById('cart-count');

let cart = [];

// Toggle Cart Sidebar
cartBtn.onclick = (e) => {
    e.preventDefault();
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
};

closeCartBtn.onclick = () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
};

cartOverlay.onclick = () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
};

// Add to Cart
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.box');
        const itemId = Date.now(); // Unique ID for each item
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
        const itemImage = menuItem.querySelector('img').src;
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
        }
        
        updateCart();
        
        // Show cart sidebar when adding an item
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
});

// Update Cart
function updateCart() {
    renderCartItems();
    updateCartTotal();
    updateCartCount();
}

// Render Cart Items
function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; font-size: 1.6rem;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <div class="quantity">
                        <span class="quantity-btn minus" data-id="${item.id}">-</span>
                        <span class="quantity-value">${item.quantity}</span>
                        <span class="quantity-btn plus" data-id="${item.id}">+</span>
                    </div>
                    <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateItemQuantity(itemId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            updateItemQuantity(itemId, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
            removeItemFromCart(itemId);
        });
    });
}

// Update Item Quantity
function updateItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += change;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCart();
    }
}

// Remove Item from Cart
function removeItemFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// Update Cart Total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Checkout Button
document.querySelector('.checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Proceeding to checkout! In a real app, this would redirect to a payment page.');
    // In a real app, you would redirect to a checkout page or payment gateway
});

// Initialize cart
updateCart();
