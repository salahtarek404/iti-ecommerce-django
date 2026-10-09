// Get the cart from the browser (saved by the Add to Cart buttons)
let cart = JSON.parse(localStorage.getItem('cart'));

// Sample products so the page works before the product page is connected
if (cart === null) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Customer information (filled in at checkout)
let customer = null;

// Save the cart in the browser
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show the cart items, quantities and totals
function showCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total = total + item.price * item.qty;
        count = count + item.qty;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<img src="' + item.image + '" alt="' + item.name + '">' +
            '<div>' +
                '<h3>' + item.name + '</h3>' +
                '<p class="unit-price">$' + item.price.toFixed(2) + ' each</p>' +
                '<button class="remove-btn">Remove</button>' +
            '</div>' +
            '<div class="item-right">' +
                '<p class="price">$' + (item.price * item.qty).toFixed(2) + '</p>' +
                '<div class="quantity-controls">' +
                    '<button class="decrease">-</button>' +
                    '<span>' + item.qty + '</span>' +
                    '<button class="increase">+</button>' +
                '</div>' +
            '</div>';
        cartItems.appendChild(div);

        // Increase quantity
        div.querySelector('.increase').addEventListener('click', () => {
            item.qty = item.qty + 1;
            saveCart();
            showCart();
        });

        // Decrease quantity (remove the item if it reaches 0)
        div.querySelector('.decrease').addEventListener('click', () => {
            if (item.qty > 1) {
                item.qty = item.qty - 1;
            } else {
                cart = cart.filter(product => product.id !== item.id);
            }
            saveCart();
            showCart();
        });

        // Remove from cart
        div.querySelector('.remove-btn').addEventListener('click', () => {
            cart = cart.filter(product => product.id !== item.id);
            saveCart();
            showCart();
        });
    });

    // Update totals
    document.getElementById('cart-count').textContent = count;
    document.getElementById('summary-count').textContent = count;
    document.getElementById('summary-subtotal').textContent = '$' + total.toFixed(2);
    document.getElementById('summary-total').textContent = '$' + total.toFixed(2);

    // Show the empty message if there are no items
    if (cart.length === 0) {
        document.getElementById('empty-cart').hidden = false;
        document.getElementById('cart-content').hidden = true;
        document.getElementById('checkout').hidden = true;
    } else {
        document.getElementById('empty-cart').hidden = true;
        document.getElementById('cart-content').hidden = false;
    }
}

// Proceed to checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
    document.getElementById('checkout').hidden = false;
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
});

// Checkout form validation and order summary
document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    let valid = true;

    // Name is required
    if (name === '') {
        document.getElementById('name-error').textContent = 'Name is required.';
        valid = false;
    } else {
        document.getElementById('name-error').textContent = '';
    }

    // Phone must contain only numbers (if entered)
    if (phone !== '' && isNaN(phone.replace('+', ''))) {
        document.getElementById('phone-error').textContent = 'Enter a valid phone number.';
        valid = false;
    } else {
        document.getElementById('phone-error').textContent = '';
    }

    // Address is required
    if (address === '') {
        document.getElementById('address-error').textContent = 'Please enter your address.';
        valid = false;
    } else {
        document.getElementById('address-error').textContent = '';
    }

    if (valid === false) {
        return;
    }

    customer = { name: name, phone: phone, address: address };

    // Show the order summary
    let total = 0;
    const reviewItems = document.getElementById('review-items');
    reviewItems.innerHTML = '';
    cart.forEach(item => {
        total = total + item.price * item.qty;
        const li = document.createElement('li');
        li.innerHTML = '<span>' + item.name + ' x ' + item.qty + '</span>' +
                       '<span>$' + (item.price * item.qty).toFixed(2) + '</span>';
        reviewItems.appendChild(li);
    });

    document.getElementById('review-customer').innerHTML =
        '<strong>' + customer.name + '</strong><br>' + customer.phone + '<br>' + customer.address;
    document.getElementById('review-total').textContent = '$' + total.toFixed(2);
    document.getElementById('review-box').hidden = false;
    document.getElementById('review-box').scrollIntoView({ behavior: 'smooth' });
});

// Confirm the order
document.getElementById('confirm-btn').addEventListener('click', () => {
    let total = 0;
    cart.forEach(item => {
        total = total + item.price * item.qty;
    });

    // Populate the hidden inputs in the standard HTML form
    document.getElementById('cart_data').value = JSON.stringify(cart);
    document.getElementById('total_price').value = total.toFixed(2);

    // Empty the cart in Javascript before submitting
    cart = [];
    saveCart();

    // Submit the form normally to Django
    document.getElementById('checkout-form').submit();
});

// Show the cart when the page loads
showCart();
