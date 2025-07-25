require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Redis = require("redis");
const cors = require("cors");
const router = express.Router();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Redis client

const redisClient = Redis.createClient({ url: "redis://redis:6379" });
redisClient.connect();

const Item = mongoose.model("Item", { name: String });



router.get("/items", async (req, res) => {
  const cache = await redisClient.get("items");
  if (cache) res.json(JSON.parse(cache));
  const items = await Item.find();
  await redisClient.set("items", JSON.stringify(items));
  res.json(items);
});

router.post("/items", async (req, res) => {
  const item = new Item({ name: req.body.name });
  await item.save();
  await redisClient.del("items");
  res.json(201).json(item);
});

router.put("/items/:id", async (req, res) => {
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  await redisClient.del("items");
  res.json(item);
});

router.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  await redisClient.del("items");
  res.status(204).send();
});
// Then mount this router on your app with a path prefix:
app.use("/api", router);
app.listen(5000, () => console.log("Server running on port 5000"));
