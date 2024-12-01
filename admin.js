function updateStatsFields() {
    const type = document.getElementById('product-type').value;
    const stat3Label = document.getElementById('stat3-label');
    const stat3Input = document.getElementById('stat3');

    if (["pistol", "rifle", "shotgun", "sniper", "smg", "mg"].includes(type)) {
        stat3Label.textContent = "Recoil:";
        stat3Input.placeholder = "Recoil";
    } else {
        stat3Label.textContent = "Durability:";
        stat3Input.placeholder = "Durability";
    }
}

function validateStats() {
    const attack = parseInt(document.getElementById('attack').value) || 0;
    const range = parseInt(document.getElementById('range').value) || 0;
    const stat3 = parseInt(document.getElementById('stat3').value) || 0;
    const automatic = parseInt(document.getElementById('automatic').value) || 0;

    if (attack > 100 || range > 100 || stat3 > 100 || automatic > 100) {
        alert('Stats values cannot exceed 100.');
        return false;
    }
    return true;
}

// Add new product to localStorage and display it
function addProduct() {
    if (!validateStats()) return;

    const name = document.getElementById('product-name').value;
    const type = document.getElementById('product-type').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const attack = parseInt(document.getElementById('attack').value);
    const range = parseInt(document.getElementById('range').value);
    const stat3 = parseInt(document.getElementById('stat3').value);
    const automatic = parseInt(document.getElementById('automatic').value);
    const imageFile = document.getElementById('product-image').files[0];

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageUrl = e.target.result;

            const newProduct = {
                name,
                type,
                price,
                quantity,
                stats: { attack, range, stat3, automatic },
                image: imageUrl
            };

            // Get current products from localStorage, if any
            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.push(newProduct); // Add new product to the array
            localStorage.setItem('products', JSON.stringify(products)); // Save updated products to localStorage

            alert('Product successfully added!');
            document.getElementById('add-product-form').reset();
            document.getElementById('stats-form').reset();

            displayProducts(products); // Refresh displayed products
        };

        reader.readAsDataURL(imageFile);
    } else {
        alert('Please select an image file.');
    }
}

document.addEventListener("DOMContentLoaded", loadProducts);


