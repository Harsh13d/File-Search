import express from "express";
import upload from "./services/file.upload.js";
import BinaryTree from "./schemas/tree.schema.js";
import cors from "cors";

const app = express();

//  Configure CORS to allow frontend requests
const corsOptions = {
  origin: "https://file-search-anshika.vercel.app", // Allow requests from this frontend
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

//  Handle Preflight (OPTIONS) requests
app.options("*", cors(corsOptions));

const tree = new BinaryTree();

//  Upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://file-search-anshika.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  // Insert file metadata into binary tree
  tree.insert(file.filename, {
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
  });

  res.json({ success: true, message: "File uploaded successfully", data: tree, file });
});

//  API to search for a file
app.get("/search", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://file-search-anshika.vercel.app");

  const key = req.query.key;
  const result = tree.search(key);

  if (result) {
    res.json({ success: true, data: result });
  } else {
    res.json({ success: false, message: "File not found" });
  }
});

//  API to show the tree structure
app.get("/show-tree", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://file-search-anshika.vercel.app");
  res.json({ success: true, data: tree.toJSON() });
});

//  Start the backend server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
