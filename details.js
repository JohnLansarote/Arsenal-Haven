// Retrieve product details from localStorage
const product = JSON.parse(localStorage.getItem('selectedProduct'));
const detailsContent = document.getElementById("product-details");
const statsContainer = document.getElementById("stats-container");

if (product) {
    // Check if the category is "Knife" or "Tactical Equipment"
    const isKnifeOrTactical = product.type === "knife" || product.type === "equipment";

    // Dynamically render the product details
    detailsContent.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.image}" alt="${product.name}">
        <p><strong>Price:</strong> ${product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
        <p><strong>Description:</strong> ${product.description}</p>
        ${
            isKnifeOrTactical
                ? `<p><strong>Material:</strong> ${product.material}</p>` // Show material for Knife or Tactical Equipment
                : `<p><strong>Caliber:</strong> ${product.caliber}</p>`   // Show caliber for other categories
        }
        <p><strong>Weight:</strong> ${product.weight}</p>
    `;

    // Render stats if available
    if (product.stats) {
        Object.keys(product.stats).forEach(stat => {
            const statValue = product.stats[stat];
            statsContainer.innerHTML += `
                <p><strong>${capitalize(stat)}:</strong> ${statValue}</p>
                <div class="stat-bar">
                    <div class="stat-progress" style="width: ${statValue}%"></div>
                </div>
            `;
        });
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function closeDetails() {
    // Clear product from localStorage and go to index.html
    localStorage.removeItem('selectedProduct');
    window.location.href = 'index.html'; // Navigate to index.html
}
