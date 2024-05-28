const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const port = 3000;

// Path to your service account key JSON file
const serviceAccount = require("./privateKey/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://products-67eef-default-rtdb.asia-southeast1.firebasedatabase.app/", // Replace with your Realtime Database URL
});

const db = admin.database();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint to store product data
app.post("/products", (req, res) => {
  try {
    const products = req.body;
    console.log("Received products:", products);

    // Store product data in Realtime Database
    const productsRef = db.ref("products");
    products.forEach((product) => {
      const newProductRef = productsRef.push();
      newProductRef
        .set(product)
        .then(() => {
          console.log("Product added successfully.");
        })
        .catch((error) => {
          console.error("Error adding product: ", error);
        });
    });

    // Respond with a success message
    res.status(200).send("Products received successfully.");
  } catch (error) {
    console.error("Error processing products:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to retrieve products data
app.get("/products", (req, res) => {
  const productsRef = db.ref("products");
  productsRef.once(
    "value",
    (snapshot) => {
      const data = snapshot.val();
      res.status(200).json(data);
    },
    (error) => {
      console.error("Error fetching data: ", error);
      res.status(500).send("Internal Server Error");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
