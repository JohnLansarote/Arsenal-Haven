    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Load cart from localStorage on page load

    // Fetch products from JSON
    async function loadProducts() {
        const response = await fetch("guns.json");
        products = await response.json();
        applyInitialFilters(); // Apply URL-based filtering and set the dropdown
    }
    

    // Apply filters based on URL and set the dropdown
    function applyInitialFilters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            // Set the dropdown to the category
            const filterSelect = document.getElementById("filter-select");
            filterSelect.value = category;

            // Filter and display products by the category
            const filteredProducts = products.filter(product => product.type === category);
            displayProducts(filteredProducts);
        } else {
            // If no category in URL, display all products
            filterAndSortProducts();
        }
    }

    // Filter and sort products dynamically
    function filterAndSortProducts() {
        const searchInput = document.getElementById("search-input").value.toLowerCase();
        const filterSelect = document.getElementById("filter-select").value;
        const sortSelect = document.getElementById("sort-select").value;

        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchInput);
            const matchesFilter = filterSelect === "all" || product.type === filterSelect;
            return matchesSearch && matchesFilter;
        });

        // Sort products
        if (sortSelect === "lowToHigh") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortSelect === "highToLow") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(filteredProducts);
    }

    // Display products dynamically
    function displayProducts(filteredProducts) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous items
    
        filteredProducts.forEach(product => {
            const productItem = document.createElement("div");
            productItem.className = "product-item";
    
            let priceHTML = `${product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}`;
            
            // Check if the product is AK47 or AW50 Sniper Rifle for discounts
if (product.name === "AK47") {
    const discountedPrice = product.price * 0.9; // 10% discount for AK47
    priceHTML = `
        <span style="text-decoration: line-through; color: red;">
            ${product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
        </span>
        <span style=" margin-left: 10px;">
            ${discountedPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
        </span>
    `;
} else if (product.name === "AW50 Sniper Rifle") {
    const discountedPrice = product.price * 0.95; // 5% discount for AW50 Sniper Rifle
    priceHTML = `
        <span style="text-decoration: line-through; color: red;">
            ${product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
        </span>
        <span style=" margin-left: 10px;">
            ${discountedPrice.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
        </span>
    `;
}

    
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="showDetails('${product.name}')">
                <h3>${product.name}</h3>
                <p>${priceHTML}</p>
                <button onclick="addToCart('${product.name}')">Add to Cart</button>
            `;
    
            productList.appendChild(productItem);
        });
    }

    // Redirect to product details page
    function showDetails(productName) {
        const product = products.find(p => p.name === productName);
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = "details.html";
    }

    // Add product to cart
    function addToCart(productName) {
        const product = products.find(p => p.name === productName);
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart to localStorage
        alert(`${productName} has been added to your cart.`);
    }

    // Redirect to cart page
    function viewCart() {
        window.location.href = "cart.html";
    }









    function showLoginBox() {
        const modal = document.createElement("div");
        modal.className = "login-modal";  // Specific class for the login modal
        modal.id = "login-modal";
        modal.innerHTML = `
        <div class="login-modal-content">
            <h2>Admin</h2>
            <form onsubmit="validateLogin(); return false;">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <button type="submit">Login</button>
            </form>
            <button type="button" onclick="closeLoginBox()">Close</button>
        </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = "flex"; // Show the modal when function is triggered
    }

    function validateLogin() {
        const username = document.getElementById('name').value.trim(); // Remove any leading/trailing spaces
        const password = document.getElementById('password').value.trim(); // Remove any leading/trailing spaces

        if (username === "admin" && password === "admin") {
            window.location.href = "admin.html";
        } else {
            alert("Invalid username or password!");
        }
    }

    function closeLoginBox() {
        const modal = document.getElementById('login-modal');
        if (modal) {
            modal.remove();
        }
    }
    // Flash Sale Timer
    function startFlashSaleTimer() {
        const timerElement = document.getElementById("timer");
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 1); 

        function updateTimer() {
            const now = new Date();
            const timeLeft = endTime - now;

            if (timeLeft > 0) {
                const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
                timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                timerElement.textContent = "Sale Ended!";
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    // Image Slider
    let currentSlide = 0;

    function startImageSlider() {
        const sliderContainer = document.querySelector(".slider-container");
        const slides = document.querySelectorAll(".slider-image");
        const totalSlides = slides.length;

        function showNextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        setInterval(showNextSlide, 3000); // Change slide every 3 seconds
    }

    document.addEventListener("DOMContentLoaded", () => {
        startFlashSaleTimer();
        startImageSlider();
    });






    // Initialize products on page load
    document.addEventListener("DOMContentLoaded", loadProducts);
