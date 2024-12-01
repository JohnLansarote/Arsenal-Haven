let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = []; // Products loaded from JSON
let selectedItems = new Set(); // Track selected items by index

// Load products from guns.json
async function loadProducts() {
    try {
        const response = await fetch('guns.json');
        products = await response.json();

        // Display products initially
        displayCartItems();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Function to display the cart items
function displayCartItems() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = ""; // Clear the cart list

    // Check if cart is empty
    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Your cart is empty.";
        emptyMessage.classList.add("empty-cart-message"); // Add a class to style the empty message
        cartList.appendChild(emptyMessage);
    } else {
        cart.forEach((product, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            // Check if the product is marked as shipped
            const shippingLabel = product.isShipped ? `<span class="shipping-label">Shipping...</span>` : '';
            const isCheckedOut = product.isShipped ? 'disabled' : ''; // Disable checkbox for checked-out products

            // Set the button text based on whether the product is shipped or not
            const buttonText = product.isShipped ? "Cancel" : "Remove";

            cartItem.innerHTML = `
                <input type="checkbox" class="cart-checkbox" data-index="${index}" ${selectedItems.has(index) ? 'checked' : ''} ${isCheckedOut} onclick="toggleCheckbox(${index})">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                <p>Stock: ${product.stock || "N/A"}</p>
                <div class="quantity-control">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span id="quantity-${index}">${product.quantity || 1}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
                ${shippingLabel} <!-- Add shipping label if the product is shipped -->
                <button class="${product.isShipped ? 'cancel-button' : 'remove-button'}" onclick="${product.isShipped ? `cancelShipping(${index})` : `removeFromCart(${index})`}">${buttonText}</button>
            `;

            cartList.appendChild(cartItem);
        });
    }
}




// Function to cancel shipping
function cancelShipping(index) {
    if (confirm(`Are you sure you want to cancel the shipping for ${cart[index].name}?`)) {
        cart[index].isShipped = false; // Mark the product as not shipped
        localStorage.setItem('cart', JSON.stringify(cart)); // Update the cart in localStorage
        displayCartItems(); // Refresh the cart display
    }
}

// Function to remove item from the cart
function removeFromCart(index) {
    if (confirm(`Are you sure you want to remove ${cart[index].name} from the cart?`)) {
        cart.splice(index, 1); // Remove item from the cart array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        displayCartItems(); // Refresh cart display
    }
}

// Toggle checkbox state
function toggleCheckbox(index) {
    if (selectedItems.has(index)) {
        selectedItems.delete(index);
    } else {
        selectedItems.add(index);
    }
}

// Function to increase item quantity and decrease stock
function increaseQuantity(index) {
    const product = cart[index];
    const originalProduct = products.find(p => p.id === product.id); // Find the original product

    product.quantity = product.quantity || 1;

    if (product.quantity < (product.stock || Infinity)) {
        product.quantity += 1;
        originalProduct.stock -= 1; // Decrease stock in the products array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        localStorage.setItem('products', JSON.stringify(products)); // Update products in localStorage
        displayCartItems(); // Refresh cart display
    } else {
        alert(`Only ${product.stock} of ${product.name} available in stock.`);
    }
}


// Function to decrease item quantity and increase stock
function decreaseQuantity(index) {
    const product = cart[index];
    const originalProduct = products.find(p => p.id === product.id); // Find the original product

    if (product.quantity > 1) {
        product.quantity -= 1;
        originalProduct.stock += 1; // Increase stock in the products array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update cart in localStorage
        localStorage.setItem('products', JSON.stringify(products)); // Update products in localStorage
        displayCartItems(); // Refresh cart display
    }
}


// Function to handle checkout
function checkout() {
    const itemsToCheckout = cart.filter((_, index) => selectedItems.has(index));

    if (itemsToCheckout.length === 0) {
        alert("Please select items to proceed to checkout.");
        return;
    }

    // Open the checkout modal
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "flex"; // Show the modal
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById("checkout-modal");
    modal.style.display = "none"; // Hide the modal
}

// Handle form submission in modal
document.getElementById("checkout-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Fetch updated form input values
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment").value;

    // Check if all fields are filled
    if (!name || !address || !payment) {
        alert("Please fill out all the fields.");
        return; // Stop the form submission
    }

    // Process the checkout
    alert(`Checkout successful!\nName: ${name}\nAddress: ${address}\nPayment: ${payment}`);

    // Mark items as shipped and update stock
    const itemsToCheckout = cart.filter((_, index) => selectedItems.has(index));
    itemsToCheckout.forEach(item => {
        item.isShipped = true;
        const originalProduct = products.find(p => p.id === item.id);
        originalProduct.stock -= item.quantity;
    });

    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('products', JSON.stringify(products));
    
    // Refresh cart display
    displayCartItems();
    showNotification("Checkout successful!");

    // Close the modal after successful checkout
    closeModal(); // Ensure the modal closes
});


    


function goBack(){
    window.location.href = 'index.html'; // Navigate to index.html
}




// Show notification with a message
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.classList.add("show");

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}



// Load products on page load
document.addEventListener("DOMContentLoaded", loadProducts);
