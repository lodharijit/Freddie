const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id INTEGER,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 4.5,
      review_count INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 10,
      description TEXT,
      features TEXT,
      specs TEXT,
      image_url TEXT,
      gallery TEXT,
      is_featured INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      shipping_fee REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Processing',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.get("SELECT COUNT(*) AS count FROM categories", [], (err, row) => {
    if (!err && row && row.count === 0) {
      seedData();
    }
  });
});

function seedData() {
  console.log("Seeding initial household ecommerce data...");

  const categories = [
    {
      slug: 'kitchen',
      name: 'Kitchen & Dining',
      description: 'Premium cookware, espresso machines, artisanal dinnerware, and essential kitchen gadgets.',
      image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000'
    },
    {
      slug: 'bed-bath',
      name: 'Bed & Bath',
      description: 'Ultra-soft organic cotton linens, plush bath towels, and soothing bathroom essentials.',
      image_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=1000'
    },
    {
      slug: 'home-decor',
      name: 'Home Decor',
      description: 'Modern ceramic vases, ambient lighting, handwoven rugs, and wall art.',
      image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000'
    },
    {
      slug: 'cleaning-storage',
      name: 'Cleaning & Storage',
      description: 'Smart storage organizers, eco-friendly laundry hampers, and cordless vacuums.',
      image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000'
    },
    {
      slug: 'furniture',
      name: 'Living & Furniture',
      description: 'Ergonomic lounge chairs, solid wood coffee tables, and elegant shelving units.',
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  const stmtCategory = db.prepare("INSERT INTO categories (slug, name, description, image_url) VALUES (?, ?, ?, ?)");
  categories.forEach((cat) => {
    stmtCategory.run(cat.slug, cat.name, cat.description, cat.image_url);
  });
  stmtCategory.finalize(() => {
    seedProducts();
  });
}

function seedProducts() {
  const products = [
    {
      name: "Artisan Cast Iron Dutch Oven (5.5 Qt)",
      slug: "artisan-cast-iron-dutch-oven",
      category_id: 1,
      price: 129.99,
      original_price: 159.99,
      rating: 4.9,
      review_count: 128,
      stock: 25,
      description: "Heavy-duty enameled cast iron Dutch oven ideal for slow cooking, braising, baking sourdough bread, and simmering soups.",
      features: JSON.stringify(["Enameled smooth finish, easy to clean", "Oven safe up to 500°F (260°C)", "Stainless steel lid knob", "Compatible with induction, gas, electric"]),
      specs: JSON.stringify({"Capacity": "5.5 Quarts", "Material": "Enameled Cast Iron", "Weight": "12.8 lbs", "Color": "Forest Emerald"}),
      image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 0
    },
    {
      name: "Smart Precision Espresso Machine",
      slug: "smart-precision-espresso-machine",
      category_id: 1,
      price: 299.00,
      original_price: 349.99,
      rating: 4.8,
      review_count: 94,
      stock: 15,
      description: "Barista-quality 15-bar Italian pump espresso machine with integrated PID temperature control.",
      features: JSON.stringify(["15 Bar Italian Pressure Pump", "PID Precise Water Temperature Control", "Powerful Commercial-Style Steam Wand"]),
      specs: JSON.stringify({"Pump Pressure": "15 Bar", "Water Tank": "1.8 Liters", "Power": "1450W"}),
      image_url: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 1
    },
    {
      name: "Ceramic Minimalist Dinnerware Set (16-Piece)",
      slug: "ceramic-minimalist-dinnerware-set",
      category_id: 1,
      price: 89.50,
      original_price: 110.00,
      rating: 4.7,
      review_count: 62,
      stock: 40,
      description: "Hand-finished stoneware set including dinner plates, salad plates, soup bowls, and mugs.",
      features: JSON.stringify(["Service for 4 (16 pieces total)", "Lead-free stoneware", "Microwave & Dishwasher safe"]),
      specs: JSON.stringify({"Material": "Natural Stoneware", "Dishwasher Safe": "Yes"}),
      image_url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 0
    },
    {
      name: "Organic French Linen Sheet Set (Queen)",
      slug: "organic-french-linen-sheet-set",
      category_id: 2,
      price: 168.00,
      original_price: 199.00,
      rating: 4.9,
      review_count: 210,
      stock: 30,
      description: "Woven from 100% certified French flax linen. Breathable, thermoregulating, and pre-washed for ultimate softness.",
      features: JSON.stringify(["100% French Flax Linen", "16-inch deep pocket", "Naturally hypoallergenic"]),
      specs: JSON.stringify({"Size": "Queen", "Material": "100% French Flax"}),
      image_url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 0
    },
    {
      name: "Plush Organic Turkish Cotton Bath Towel Set (6-Piece)",
      slug: "plush-turkish-cotton-bath-towel-set",
      category_id: 2,
      price: 64.99,
      original_price: 79.99,
      rating: 4.8,
      review_count: 85,
      stock: 50,
      description: "Super absorbent 700 GSM long-staple Turkish cotton towels. Ultra soft, low linting, and fast drying.",
      features: JSON.stringify(["700 GSM Heavyweight Density", "2 Bath Towels, 2 Hand Towels, 2 Washcloths"]),
      specs: JSON.stringify({"Fabric": "100% Aegean Turkish Cotton", "GSM": "700 GSM"}),
      image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 1
    },
    {
      name: "Handcrafted Ceramic Ribbed Table Lamp",
      slug: "handcrafted-ceramic-ribbed-table-lamp",
      category_id: 3,
      price: 95.00,
      original_price: 120.00,
      rating: 4.6,
      review_count: 43,
      stock: 18,
      description: "Textured ceramic base paired with a natural linen drum shade. Warm ambient lighting.",
      features: JSON.stringify(["Textured Off-White Ceramic Base", "Natural Linen Drum Shade", "3-Way Rotary Switch"]),
      specs: JSON.stringify({"Height": "22 inches", "Shade Diameter": "12 inches"}),
      image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 0
    },
    {
      name: "Nordic Wool & Cotton Area Rug (5x8 ft)",
      slug: "nordic-wool-cotton-area-rug",
      category_id: 3,
      price: 185.00,
      original_price: 220.00,
      rating: 4.7,
      review_count: 53,
      stock: 12,
      description: "Hand-woven geometric wool and cotton blend rug. Cozy texture underfoot.",
      features: JSON.stringify(["70% Wool, 30% Cotton", "Low-pile, easy to vacuum"]),
      specs: JSON.stringify({"Dimensions": "5 ft x 8 ft"}),
      image_url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 0
    },
    {
      name: "Aromatherapy Essential Oil Ceramic Diffuser",
      slug: "aromatherapy-essential-oil-ceramic-diffuser",
      category_id: 3,
      price: 45.00,
      original_price: 55.00,
      rating: 4.8,
      review_count: 112,
      stock: 60,
      description: "Ultrasonic matte ceramic stone diffuser with ambient warm light modes.",
      features: JSON.stringify(["Whisper-quiet ultrasonic misting", "Continuous & intermittent timer modes"]),
      specs: JSON.stringify({"Capacity": "200 ml", "Run Time": "8 hours"}),
      image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 1
    },
    {
      name: "Modular Bamboo Pantry & Closet Organizers (Set of 4)",
      slug: "modular-bamboo-pantry-organizers",
      category_id: 4,
      price: 39.99,
      original_price: 49.99,
      rating: 4.9,
      review_count: 76,
      stock: 45,
      description: "Sustainable solid Moso bamboo stackable bins with cutout handles.",
      features: JSON.stringify(["100% Natural Moso Bamboo", "Stackable design"]),
      specs: JSON.stringify({"Dimensions": "11 x 8 x 6 in each"}),
      image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 0
    },
    {
      name: "Ultra-Light Cordless Stick Vacuum Cleaner",
      slug: "ultra-light-cordless-stick-vacuum-cleaner",
      category_id: 4,
      price: 179.99,
      original_price: 219.99,
      rating: 4.7,
      review_count: 140,
      stock: 20,
      description: "Powerful 250W brushless motor with HEPA filtration and LED headlights.",
      features: JSON.stringify(["250W Brushless Motor", "4-Stage HEPA Filtration", "45 Min Runtime"]),
      specs: JSON.stringify({"Weight": "4.8 lbs", "Runtime": "45 Mins"}),
      image_url: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 0
    },
    {
      name: "Mid-Century Modern Bouclé Lounge Chair",
      slug: "mid-century-modern-boucle-lounge-chair",
      category_id: 5,
      price: 349.00,
      original_price: 420.00,
      rating: 4.9,
      review_count: 38,
      stock: 8,
      description: "Iconic accent chair crafted with rich cream bouclé fabric upholstery and solid ash wood frame.",
      features: JSON.stringify(["Premium cozy Bouclé fabric", "Solid kiln-dried ash wood legs"]),
      specs: JSON.stringify({"Dimensions": "30 W x 32 D x 31 H in"}),
      image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 1,
      is_new: 1
    },
    {
      name: "Solid Oak Nesting Coffee Tables (Set of 2)",
      slug: "solid-oak-nesting-coffee-tables",
      category_id: 5,
      price: 210.00,
      original_price: 250.00,
      rating: 4.8,
      review_count: 29,
      stock: 14,
      description: "Versatile organic curves carved from sustainably harvested solid oak wood.",
      features: JSON.stringify(["100% Solid White Oak Wood", "Waterproof clear protective finish"]),
      specs: JSON.stringify({"Material": "Solid White Oak"}),
      image_url: "https://images.unsplash.com/photo-1532372688190-3498f3957297?auto=format&fit=crop&q=80&w=800",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1532372688190-3498f3957297?auto=format&fit=crop&q=80&w=800"
      ]),
      is_featured: 0,
      is_new: 0
    }
  ];

  const stmtProduct = db.prepare(`
    INSERT INTO products (name, slug, category_id, price, original_price, rating, review_count, stock, description, features, specs, image_url, gallery, is_featured, is_new)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach((p) => {
    stmtProduct.run(p.name, p.slug, p.category_id, p.price, p.original_price, p.rating, p.review_count, p.stock, p.description, p.features, p.specs, p.image_url, p.gallery, p.is_featured, p.is_new);
  });

  stmtProduct.finalize(() => {
    seedReviews();
  });
}

function seedReviews() {
  const reviews = [
    { product_id: 1, user_name: "Eleanor Vance", rating: 5, comment: "Absolutly stunning Dutch Oven! The heat distribution is perfect." },
    { product_id: 2, user_name: "David Kim", rating: 5, comment: "Makes perfect espresso every morning with rich crema." }
  ];

  const stmtReview = db.prepare("INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)");
  reviews.forEach((r) => {
    stmtReview.run(r.product_id, r.user_name, r.rating, r.comment);
  });
  stmtReview.finalize(() => {
    console.log("Database seeded successfully.");
  });
}

module.exports = db;
