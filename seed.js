const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_DB_URI || "mongodb+srv://luxe_stay_db_user:GxsNIzesJZCwu4Lt@cluster0.wenolut.mongodb.net/?appName=Cluster0";
const dbName = process.env.AUTH_DB_NAME || "luxestay_db";

const stays = [
  {
    "id": "stay-1783673059800",
    "title": "Cumiila Shlbon Bihar",
    "shortDescription": "shalbon bihar",
    "fullDescription": "shalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon biharshalbon bihar",
    "price": 100,
    "rating": 5,
    "location": "Cumilla",
    "category": "Treehouses",
    "date": "Available Now",
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuevztHXkNiKEcvClL-4Q6NB0kIP0TGXpq-CY8gGXFPC_xTL_ET0_kT8Gk&s=10",
    "images": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuevztHXkNiKEcvClL-4Q6NB0kIP0TGXpq-CY8gGXFPC_xTL_ET0_kT8Gk&s=10"
    ],
    "beds": 1,
    "guests": 2,
    "bathrooms": 1,
    "wifi": true,
    "pool": true,
    "kitchen": true,
    "hostId": "user-1783672885768",
    "hostName": "Mithu",
    "reviews": []
  },
  {
    "id": "stay-1783664877480",
    "title": "vdvdsfvdsf",
    "shortDescription": "dsfsdf",
    "fullDescription": "sdfsdf",
    "price": 251,
    "rating": 5,
    "location": "dfsdfdsfsd",
    "category": "Villas",
    "date": "Available Now",
    "image": "https://static.vecteezy.com/system/resources/previews/011/826/370/large_2x/maldives-islands-ocean-tropical-beach-exotic-sea-lagoon-palm-trees-over-white-sand-idyllic-nature-landscape-amazing-beach-scenic-shore-bright-tropical-summer-sun-and-blue-sky-with-light-clouds-photo.jpg",
    "images": [
      "https://static.vecteezy.com/system/resources/previews/011/826/370/large_2x/maldives-islands-ocean-tropical-beach-exotic-sea-lagoon-palm-trees-over-white-sand-idyllic-nature-landscape-amazing-beach-scenic-shore-bright-tropical-summer-sun-and-blue-sky-with-light-clouds-photo.jpg",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 1,
    "guests": 2,
    "bathrooms": 1,
    "wifi": true,
    "pool": false,
    "kitchen": true,
    "hostId": "user-2",
    "hostName": "Elena Rostova",
    "reviews": []
  },
  {
    "id": "stay-1783664644616",
    "title": "dfdsfsdf",
    "shortDescription": "dsfdsf",
    "fullDescription": "dsfsdfsdf",
    "price": 250,
    "rating": 5,
    "location": "sdfdsfdsf",
    "category": "Beachfront",
    "date": "Available Now",
    "image": "https://thumbs.dreamstime.com/b/sea-water-ocean-wave-surfing-surface-colorful-vibrant-sunset-barrel-shape-124362369.jpg",
    "images": [
      "https://thumbs.dreamstime.com/b/sea-water-ocean-wave-surfing-surface-colorful-vibrant-sunset-barrel-shape-124362369.jpg"
    ],
    "beds": 1,
    "guests": 2,
    "bathrooms": 1,
    "wifi": true,
    "pool": false,
    "kitchen": true,
    "hostId": "user-2",
    "hostName": "Elena Rostova",
    "reviews": []
  },
  {
    "id": "stay-1",
    "title": "Aura Glass Cottage",
    "shortDescription": "Immersive nature dwelling with transparent walls and private cedar hot tub.",
    "fullDescription": "Nestled in the heart of the Oregon wilderness, Aura Glass Cottage offers an unparalleled connection to nature. Featuring 360-degree glass walls that polarize for privacy, you can stargaze from the luxury of your king-sized bed. The outdoor deck features a hand-carved cedar hot tub, custom fireplace, and panoramic views of the dense pine forests. Perfectly isolated for an unforgettable retreat.",
    "price": 380,
    "rating": 4.92,
    "location": "Oregon, USA",
    "date": "Available Jul 15 - 22",
    "category": "Cabins",
    "image": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 2,
    "guests": 4,
    "bathrooms": 1.5,
    "wifi": true,
    "pool": true,
    "kitchen": true,
    "hostId": "user-1",
    "hostName": "Alexander Vane",
    "reviews": [
      {
        "id": "rev-1",
        "author": "Sophia Bennett",
        "rating": 5,
        "comment": "An absolute dream. Waking up to the sunrise through the glass walls was therapeutic.",
        "date": "2026-06-12"
      },
      {
        "id": "rev-2",
        "author": "Marcus Thorne",
        "rating": 4.8,
        "comment": "Stunning design and complete isolation. The cedar hot tub was fantastic.",
        "date": "2026-06-25"
      }
    ]
  },
  {
    "id": "stay-2",
    "title": "Vela Beachfront Villa",
    "shortDescription": "Ultra-luxury overwater villa with private infinity pool and reef access.",
    "fullDescription": "Vela Overwater Villa redefines coastal luxury. Perched over the pristine turquoise waters of the Maldives, this architecturally stunning villa features a glass-bottom floor, private infinity plunge pool, and direct ladder access to the coral reef. Enjoy a dedicated 24/7 host, outdoor ocean shower, and sunset views from your private suspended hammock.",
    "price": 850,
    "rating": 4.97,
    "location": "Maldives",
    "date": "Available Aug 01 - 08",
    "category": "Beachfront",
    "image": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 4,
    "guests": 6,
    "bathrooms": 4,
    "wifi": true,
    "pool": true,
    "kitchen": true,
    "hostId": "user-1",
    "hostName": "Alexander Vane",
    "reviews": [
      {
        "id": "rev-3",
        "author": "Emily Rose",
        "rating": 5,
        "comment": "I could see manta rays swimming under the floor glass! Exceeded all my expectations.",
        "date": "2026-05-18"
      }
    ]
  },
  {
    "id": "stay-3",
    "title": "Edge Horizon Penthouse",
    "shortDescription": "Sky-high luxury penthouse with wraparound terrace and skyline views.",
    "fullDescription": "Hover above Manhattan in this custom-designed 3-bedroom luxury penthouse. Featuring double-height ceilings, a professional chef's kitchen, and a private wraparound heated terrace, Edge Horizon offers the ultimate urban luxury. Relax in the master suite's marble soaking tub overlooking the Empire State Building.",
    "price": 620,
    "rating": 4.88,
    "location": "New York, USA",
    "date": "Available Jul 24 - 31",
    "category": "Penthouses",
    "image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 3,
    "guests": 6,
    "bathrooms": 3.5,
    "wifi": true,
    "pool": false,
    "kitchen": true,
    "hostId": "user-2",
    "hostName": "Elena Rostova",
    "reviews": [
      {
        "id": "rev-4",
        "author": "Sarah Jenkins",
        "rating": 5,
        "comment": "The views are simply unmatched. Centrally located, secure, and absolutely pristine.",
        "date": "2026-06-02"
      }
    ]
  },
  {
    "id": "stay-4",
    "title": "Nordic Cabin Escape",
    "shortDescription": "Minimalist geometric cabin in the snowy spruce forests.",
    "fullDescription": "Experience the magic of the Arctic in this custom architectural cabin. Positioned perfectly near Tromsø to observe the Aurora Borealis, the cabin's inclined floor-to-ceiling glass wall provides a comfortable viewpoint for the night sky. Equipped with an indoor Finnish sauna, cast-iron woodstove, and Nordic wool interiors.",
    "price": 310,
    "rating": 4.95,
    "location": "Tromsø, Norway",
    "date": "Available Oct 12 - 19",
    "category": "Cabins",
    "image": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 1,
    "guests": 2,
    "bathrooms": 1,
    "wifi": true,
    "pool": false,
    "kitchen": true,
    "hostId": "user-2",
    "hostName": "Elena Rostova",
    "reviews": []
  },
  {
    "id": "stay-5",
    "title": "The Bamboo Oasis",
    "shortDescription": "Multi-level eco-luxury treehouse surrounded by tropical jungle.",
    "fullDescription": "Crafted entirely from sustainably sourced giant petung bamboo, this masterpiece of organic architecture hangs over the sacred Ayung River valley. The open-air design invites the soothing sounds of the jungle, featuring an outdoor hammock suspended 15 meters high, custom copper bathtubs, and a private natural plunge pool fed by spring water.",
    "price": 290,
    "rating": 4.89,
    "location": "Bali, Indonesia",
    "date": "Available Sep 04 - 11",
    "category": "Treehouses",
    "image": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 2,
    "guests": 4,
    "bathrooms": 2,
    "wifi": true,
    "pool": true,
    "kitchen": true,
    "hostId": "user-1",
    "hostName": "Alexander Vane",
    "reviews": [
      {
        "id": "rev-5",
        "author": "Luka Modric",
        "rating": 4.7,
        "comment": "Waking up to the sound of the river and jungle was incredible. A structural masterpiece.",
        "date": "2026-06-30"
      }
    ]
  },
  {
    "id": "stay-6",
    "title": "Sanctuary Desert Dome",
    "shortDescription": "Futuristic solar-powered dome overlooking desert landscape.",
    "fullDescription": "A minimalist off-grid architectural marvel nestled amongst monolithic boulders. The Sanctuary Desert Dome features solar-power, raw concrete details, luxury linens, and a high-end telescopes for stargazing under some of the darkest skies in California. An outdoor wood-fired hot tub offers the perfect evening retreat.",
    "price": 340,
    "rating": 4.85,
    "location": "California, USA",
    "date": "Available Nov 01 - 08",
    "category": "Villas",
    "image": "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80",
    "images": [
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
    ],
    "beds": 1,
    "guests": 2,
    "bathrooms": 1,
    "wifi": true,
    "pool": false,
    "kitchen": true,
    "hostId": "user-2",
    "hostName": "Elena Rostova",
    "reviews": []
  }
];

const users = [
  {
    "id": "user-1",
    "name": "Alexander Vane",
    "email": "alex@luxestay.com",
    "emailVerified": false,
    "createdAt": new Date("2026-01-10T12:00:00Z"),
    "updatedAt": new Date("2026-01-10T12:00:00Z"),
    "role": "user"
  },
  {
    "id": "user-2",
    "name": "Elena Rostova",
    "email": "elena@luxestay.com",
    "emailVerified": false,
    "createdAt": new Date("2026-02-15T12:00:00Z"),
    "updatedAt": new Date("2026-02-15T12:00:00Z"),
    "role": "user"
  },
  {
    "id": "user-1783672885768",
    "name": "Mithu",
    "email": "mithu@yahoo.com",
    "emailVerified": false,
    "createdAt": new Date("2026-07-10T08:41:25.768Z"),
    "updatedAt": new Date("2026-07-10T08:41:25.768Z"),
    "role": "user"
  },
  {
    "_id": new ObjectId("6a567453ead3a6c8f9d65ec4"),
    "name": "admin",
    "email": "admin@admin.com",
    "emailVerified": false,
    "image": "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png",
    "createdAt": new Date("2026-07-14T17:39:31.704Z"),
    "updatedAt": new Date("2026-07-14T17:39:31.704Z"),
    "role": "admin"
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB for seeding...");
    const db = client.db(dbName);
    
    // Clear collections
    await db.collection("stays").deleteMany({});
    await db.collection("user").deleteMany({});
    
    // Insert stays
    const stayResult = await db.collection("stays").insertMany(stays);
    console.log(`Inserted ${stayResult.insertedCount} stays.`);
    
    // Insert users
    const userResult = await db.collection("user").insertMany(users);
    console.log(`Inserted ${userResult.insertedCount} users.`);
    
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await client.close();
    console.log("DB connection closed.");
  }
}

seed();
