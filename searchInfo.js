document.addEventListener("DOMContentLoaded", function () {
  const productList = document.getElementById("productList");
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");

  // Retrieve search query from localStorage and convert to lowercase
  const storedQuery = localStorage.getItem("searchQuery");
  const query = storedQuery ? storedQuery.toLowerCase() : "";

  // Function to fetch products from the server based on category
  function fetchProductsByCategory(category, query) {
    fetch(`http://localhost:3000/products?category=${category}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        displayProducts(data, query);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  // Function to display products
  function displayProducts(products, query) {
    productList.innerHTML = ""; // Clear the list first

    for (let key in products) {
      if (products.hasOwnProperty(key)) {
        const product = products[key];
        if (query === "" || product.name.toLowerCase().includes(query)) {
          // Check if the product name contains the query or if the query is empty
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
          productPrice.textContent = `Price: Nu:${product.price}`;
          details.appendChild(productPrice);

          const productDescription = document.createElement("p");
          productDescription.textContent = `Description: ${product.description}`;
          details.appendChild(productDescription);

          listItem.appendChild(details);

          productList.appendChild(listItem);
        }
      }
    }
  }

  // Fetch products based on category when the page loads
  fetchProductsByCategory(category, query);
});

// Function to handle search
function handleSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchTerm = searchInput.value.trim().toLowerCase(); // Extract and normalize the search term
  if (searchTerm !== "") {
    // Store the search term in localStorage
    localStorage.setItem("searchQuery", searchTerm);
    // Redirect to the search results page
    window.location.href = "./searchInfo.html";
  }
}

// Attach handleSearch function to search input element
// document.getElementById("searchInput").addEventListener("input", handleSearch);
