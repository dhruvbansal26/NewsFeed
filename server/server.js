const express = require("express");
const app = express();
const port = 3000;

require("dotenv").config();

const { MongoClient } = require("mongodb");
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const jwt = require("jsonwebtoken");

const { auth } = require("./middleware");
let USER_ID_COUNTER = 1;

const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());

async function connectToCluster(DB_URI) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(DB_URI);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit(1);
  }
}

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to NewsFeed",
  });
});

app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const client = await connectToCluster(DB_URI);
  const collection = client.db("Users").collection("user");

  try {
    // Check if the user already exists in the database
    const existingUser = await collection.findOne({ email: email });
    if (existingUser) {
      return res.status(403).json({ msg: "Email already exists" });
    }

    // Create a new user document
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      userId: USER_ID_COUNTER++,
      saved_articles: [],
    };

    // Insert the new user into the database
    await collection.insertOne(newUser);

    return res.json({
      msg: "Successfully added user.",
    });
  } catch (error) {
    console.error("Error occurred during signup", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  } finally {
    client.close();
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const client = await connectToCluster(DB_URI);
  const collection = client.db("Users").collection("user");

  try {
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(403).json({ msg: "User not found" });
    }

    if (user.password !== password) {
      return res.status(403).json({ msg: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.userId }, JWT_SECRET);

    return res.json({ token, userId: user.userId });
  } catch (error) {
    console.error("Error occurred during login", error);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.close();
  }
});

app.get("/me", auth, async (req, res) => {
  try {
    const client = await connectToCluster(DB_URI);
    const collection = client.db("Users").collection("user");

    const user = await collection.findOne({ userId: req.userId });

    res.json({ user });
  } catch (error) {
    console.error("Error occurred while fetching user data", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/saveArticle", auth, async (req, res) => {
  const article_id = req.body.article_id;
  const title = req.body.title;
  const url = req.body.url;
  const description = req.body.description;
  const stock = req.body.stock;

  try {
    const client = await connectToCluster(DB_URI);
    const collection = client.db("Users").collection("user");

    // Find the user based on the userId
    const user = await collection.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create a new article object with the correct property values
    const article = {
      ID: article_id,
      Title: title,
      URL: url,
    };

    // Add the description if it exists
    if (description && stock) {
      article.Description = description;
      article.Stock = stock;
    }

    // Add the article to the saved_articles array of the user
    user.saved_articles.push(article);

    // Update the user document in the database
    await collection.updateOne(
      { userId: req.userId },
      { $set: { saved_articles: user.saved_articles } }
    );

    return res.json({
      msg: "Article saved successfully.",
    });
  } catch (error) {
    console.error("Error occurred while saving article", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/unsaveArticle", auth, async (req, res) => {
  const { article_id } = req.body;

  try {
    const client = await connectToCluster(DB_URI);
    const collection = client.db("Users").collection("user");

    // Find the user based on the userId
    const user = await collection.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove the article from the saved_articles array of the user
    user.saved_articles = user.saved_articles.filter(
      (article) => article.ID !== article_id
    );

    // Update the user document in the database
    await collection.updateOne(
      { userId: req.userId },
      { $set: { saved_articles: user.saved_articles } }
    );

    return res.json({
      msg: "Article unsaved successfully.",
    });
  } catch (error) {
    console.error("Error occurred while unsaving article", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/scrape", auth, (req, res) => {
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn("python3", ["./script.py"]);

  let scrapedData = "";

  pythonProcess.stdout.on("data", (data) => {
    scrapedData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
    res.status(500).json({ error: "An error occurred" });
  });

  pythonProcess.stdout.on("end", function () {
    try {
      const jsonArray = JSON.parse(scrapedData);
      res.send(jsonArray);
    } catch (error) {
      console.error("Error occurred while parsing scraped data", error);
      res.status(500).json({ error: "An error occurred" });
    }
  });
});

app.get("/saved", auth, async (req, res) => {
  try {
    const client = await connectToCluster(DB_URI);
    const collection = client.db("Users").collection("user");

    const user = await collection.findOne({ userId: req.userId });
    const saved_articles = user.saved_articles || [];

    res.json(saved_articles);
  } catch (error) {
    console.error("Error occurred while fetching user data", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    return res.json({
      msg: "Successfully Logged Out.",
    });
  } catch (error) {
    console.error("Error occurred during logout", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/edit-name", auth, async (req, res) => {
  const newFirstName = req.body.newFirstName;
  const newLastName = req.body.newLastName;
  const password = req.body.password;

  const client = await connectToCluster(DB_URI);
  const collection = client.db("Users").collection("user");

  try {
    // Find the user based on the userId
    const user = await collection.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the provided password matches the user's password
    if (user.password !== password) {
      return res.status(403).json({ msg: "Incorrect password" });
    }

    // Update the user's first name and last name
    await collection.updateOne(
      { userId: req.userId },
      { $set: { firstName: newFirstName, lastName: newLastName } }
    );

    return res.json({
      msg: "Name updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred while updating name", error);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.close();
  }
});

app.post("/edit-email", auth, async (req, res) => {
  const newEmail = req.body.newEmail;
  const password = req.body.password;

  try {
    const client = await connectToCluster(DB_URI);
    const collection = client.db("Users").collection("user");

    // Find the user based on the userId
    const user = await collection.findOne({ userId: req.userId });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the provided password matches the user's password
    if (user.password !== password) {
      return res.status(403).json({ msg: "Incorrect password" });
    }

    // Update the user's email address
    await collection.updateOne(
      { userId: req.userId },
      { $set: { email: newEmail } }
    );

    return res.json({
      msg: "Email address updated successfully.",
    });
  } catch (error) {
    console.error("Error occurred while updating email", error);
    return res.status(500).json({ msg: "Internal server error" });
  } finally {
    client.close();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
