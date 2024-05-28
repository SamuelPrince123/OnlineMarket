document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("productList");
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // Function to fetch products from the server based on category
  function fetchProductsByCategory(category) {
    fetch(`http://localhost:3000/products?category=${category}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        displayProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  // Function to display products
  function displayProducts(products) {
    productList.innerHTML = ""; // Clear the list first

    for (let key in products) {
      if (products.hasOwnProperty(key)) {
        const product = products[key];
        const listItem = document.createElement("li");
        const image = document.createElement("img");
        image.src = product.imageUrl;
        image.alt = product.name;
        image.style.maxWidth = "100px"; // Adjust as needed
        image.style.maxHeight = "100px"; // Adjust as needed

        listItem.appendChild(image);

        const details = document.createElement("div");
        const productName = document.createElement("p");
        productName.textContent = product.name;
        details.appendChild(productName);

        const productPrice = document.createElement("p");
        productPrice.textContent = `Price: ${product.price}`;
        details.appendChild(productPrice);

        const productDescription = document.createElement("p");
        productDescription.textContent = `Description: ${product.description}`;
        details.appendChild(productDescription);

        listItem.appendChild(details);

        productList.appendChild(listItem);
      }
    }
  }

  // Fetch products based on category when the page loads
  fetchProductsByCategory(category);
});

function handleSearch() {
  const query = document.getElementById("searchInput").value.trim();
  if (query !== "") {
    const productList = extractProductsFromList();
    localStorage.setItem("searchQuery", query);
    localStorage.setItem("productList", JSON.stringify(productList));
    window.location.href = "./searchInfo.html";
  }
}

function extractProductsFromList() {
  const productList = document.getElementById("productList");
  const productItems = Array.from(productList.getElementsByTagName("li"));
  return productItems.map((item) => {
    return item.textContent.trim();
  });
}
