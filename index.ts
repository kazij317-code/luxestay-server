const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
dotenv.config();

const uri = process.env.MONGO_DB_URI;
const dbName = process.env.AUTH_DB_NAME || "luxestay_db";
const app = express();
const PORT = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    credentials: true,
    origin: [clientUrl],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello LuxeStay Server!");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const JWKS = createRemoteJWKSet(
  new URL(`${clientUrl}/api/auth/jwks`),
);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    
    const db = client.db(dbName);
    const staysCollection = db.collection("stays");
    const userCollection = db.collection("user");

    // Initialize mock data if collection is empty
    const count = await staysCollection.countDocuments();
    if (count === 0) {
      console.log("Stays collection is empty, inserting initial stays...");
      const initialStays = [
        {
          title: "Aura Glass Cottage",
          shortDescription: "Immersive nature dwelling with transparent walls and private cedar hot tub.",
          fullDescription: "Nestled in the heart of the Oregon wilderness, Aura Glass Cottage offers an unparalleled connection to nature. Featuring 360-degree glass walls that polarize for privacy, you can stargaze from the luxury of your king-sized bed.",
          price: 380,
          rating: 4.92,
          location: "Oregon, USA",
          date: "Available Jul 15 - 22",
          category: "Cabins",
          image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
          images: ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"],
          beds: 2,
          guests: 4,
          bathrooms: 1.5,
          wifi: true,
          pool: true,
          kitchen: true,
          hostId: "admin-id",
          hostName: "Alexander Vane",
          reviews: []
        },
        {
          title: "Vela Beachfront Villa",
          shortDescription: "Ultra-luxury overwater villa with private infinity pool and reef access.",
          fullDescription: "Vela Overwater Villa redefines coastal luxury. Perched over the pristine turquoise waters of the Maldives, this architecturally stunning villa features a glass-bottom floor, private infinity plunge pool.",
          price: 850,
          rating: 4.97,
          location: "Maldives",
          date: "Available Aug 01 - 08",
          category: "Beachfront",
          image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80",
          images: ["https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80"],
          beds: 4,
          guests: 6,
          bathrooms: 4,
          wifi: true,
          pool: true,
          kitchen: true,
          hostId: "admin-id",
          hostName: "Alexander Vane",
          reviews: []
        }
      ];
      await staysCollection.insertMany(initialStays);
    }

    // 1. GET /api/stays
    app.get("/api/stays", async (req, res) => {
      try {
        const search = req.query.search || '';
        const category = req.query.category || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 10000;
        const minRating = parseFloat(req.query.minRating) || 0;
        const sort = req.query.sort || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;

        let query = {};
        
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } },
            { shortDescription: { $regex: search, $options: 'i' } }
          ];
        }

        if (category && category !== 'All') {
          query.category = { $regex: `^${category}$`, $options: 'i' };
        }

        query.price = { $gte: minPrice, $lte: maxPrice };
        query.rating = { $gte: minRating };

        let sortOption = {};
        if (sort === 'price_asc') {
          sortOption = { price: 1 };
        } else if (sort === 'price_desc') {
          sortOption = { price: -1 };
        } else if (sort === 'rating_desc') {
          sortOption = { rating: -1 };
        }

        const skip = (page - 1) * limit;
        const totalCount = await staysCollection.countDocuments(query);
        const stays = await staysCollection.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .toArray();

        // Map _id to id
        const mappedStays = stays.map(s => ({ ...s, id: s._id.toString() }));

        res.status(200).json({
          success: true,
          data: mappedStays,
          totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit)
        });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 2. GET /api/stays/:id
    app.get("/api/stays/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: "Invalid stay ID" });
        }
        const stay = await staysCollection.findOne({ _id: new ObjectId(id) });
        if (!stay) {
          return res.status(404).json({ success: false, error: "Stay not found" });
        }
        res.status(200).json({ success: true, data: { ...stay, id: stay._id.toString() } });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 3. POST /api/stays (create)
    app.post("/api/stays", verifyToken, async (req, res) => {
      try {
        const {
          title,
          shortDescription,
          fullDescription,
          price,
          location,
          category,
          image,
          beds,
          guests,
          bathrooms,
          wifi,
          pool,
          kitchen
        } = req.body;

        if (!title || !shortDescription || !fullDescription || !price || !location || !category) {
          return res.status(400).json({ success: false, error: "Required fields missing" });
        }

        const mainImage = image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80";

        const newStay = {
          title,
          shortDescription,
          fullDescription,
          price: Number(price),
          rating: 5.0,
          location,
          category,
          date: "Available Now",
          image: mainImage,
          images: [mainImage],
          beds: Number(beds || 1),
          guests: Number(guests || 1),
          bathrooms: Number(bathrooms || 1),
          wifi: Boolean(wifi),
          pool: Boolean(pool),
          kitchen: Boolean(kitchen),
          hostId: req.user.id || req.user.userId,
          hostName: req.user.name || "Host",
          reviews: []
        };

        const result = await staysCollection.insertOne(newStay);
        res.status(201).json({ success: true, data: { ...newStay, id: result.insertedId.toString() } });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 4. DELETE /api/stays/:id
    app.delete("/api/stays/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: "Invalid stay ID" });
        }
        const stay = await staysCollection.findOne({ _id: new ObjectId(id) });
        if (!stay) {
          return res.status(404).json({ success: false, error: "Stay not found" });
        }

        const userId = req.user.id || req.user.userId;
        if (stay.hostId !== userId && req.user.role !== "admin") {
          return res.status(403).json({ success: false, error: "Forbidden: You do not own this listing" });
        }

        await staysCollection.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ success: true, message: "Stay deleted successfully" });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 5. POST /api/stays/:id/reviews
    app.post("/api/stays/:id/reviews", async (req, res) => {
      try {
        const { id } = req.params;
        const { author, rating, comment } = req.body;

        if (!author || !rating || !comment) {
          return res.status(400).json({ success: false, error: "Author, rating, and comment are required" });
        }

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, error: "Invalid stay ID" });
        }

        const stay = await staysCollection.findOne({ _id: new ObjectId(id) });
        if (!stay) {
          return res.status(404).json({ success: false, error: "Stay not found" });
        }

        const newReview = {
          id: `rev-${Date.now()}`,
          author,
          rating: parseFloat(rating),
          comment,
          date: new Date().toISOString().split('T')[0]
        };

        const updatedReviews = [...(stay.reviews || []), newReview];
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = parseFloat((totalRating / updatedReviews.length).toFixed(2));

        await staysCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { reviews: updatedReviews, rating: averageRating } }
        );

        res.status(200).json({ success: true, data: { ...stay, reviews: updatedReviews, rating: averageRating, id } });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 6. GET /api/user/watchlist
    app.get("/api/user/watchlist", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id || req.user.userId;
        const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
        const user = await userCollection.findOne(query);
        if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).json({ success: true, watchlist: user.watchlist || [] });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    // 7. POST /api/user/watchlist (toggle)
    app.post("/api/user/watchlist", verifyToken, async (req, res) => {
      try {
        const userId = req.user.id || req.user.userId;
        const { stayId } = req.body;
        if (!stayId) {
          return res.status(400).json({ success: false, error: "stayId is required" });
        }

        const query = ObjectId.isValid(userId) ? { _id: new ObjectId(userId) } : { _id: userId };
        const user = await userCollection.findOne(query);
        if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
        }

        let watchlist = user.watchlist || [];
        const isWatchlisted = watchlist.includes(stayId);

        if (isWatchlisted) {
          watchlist = watchlist.filter(id => id !== stayId);
        } else {
          watchlist.push(stayId);
        }

        await userCollection.updateOne(
          query,
          { $set: { watchlist } }
        );

        res.status(200).json({ success: true, watchlist, isWatchlisted: !isWatchlisted });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

  } catch (err) {
    console.error(err);
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`LuxeStay Server running on port ${PORT}`);
});

module.exports = app;