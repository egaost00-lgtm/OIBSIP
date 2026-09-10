require("dotenv").config();

const express = require("express");
const cors = require("cors");
const {
  MongoClient,
  ObjectId,
} = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cron = require("node-cron");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5001;
/* =========================
   INVENTORY USAGE
========================= */

function getInventoryUsage(items = []) {
  const usage = {};

  const addStockUsage = (name, quantity) => {
    usage[name] = (usage[name] || 0) + quantity;
  };

  items.forEach((item) => {
    const quantity = Number(item.quantity) || 1;
    const pizzaName = String(item.name || "").toLowerCase();

    // Every pizza uses these basic ingredients
    addStockUsage("Pizza Bases", quantity);
    addStockUsage("Tomato Sauce", quantity);
    addStockUsage("Mozzarella Cheese", quantity);

    // Specific ingredients
    if (pizzaName.includes("pepperoni")) {
      addStockUsage("Pepperoni", quantity);
    }

    if (pizzaName.includes("chicken")) {
      addStockUsage("Chicken", quantity);
    }
  });

  return usage;
}

const client = new MongoClient(
  process.env.MONGODB_URI
);

const JWT_SECRET =
  process.env.JWT_SECRET || "crust-co-dev-secret";
  const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* =========================
   EMAIL
========================= */

const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
/* =========================
   SCHEDULED LOW-STOCK CHECKER
========================= */

async function checkLowStock() {
  try {
    const database = client.db("crust-co");
    const inventory = database.collection("inventory");

    const lowStockItems = await inventory
      .find({
        $expr: {
          $lte: ["$stock", "$lowStockThreshold"],
        },
      })
      .toArray();

    if (lowStockItems.length === 0) {
      console.log("Scheduled stock check: All inventory levels are good.");
      return;
    }

    for (const item of lowStockItems) {
      try {
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `⚠️ Scheduled Low Stock Alert - ${item.name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
              <h2>Crust & Co. 🍕</h2>

              <h3>Scheduled Low Stock Alert</h3>

              <p>
                Inventory item <strong>${item.name}</strong>
                is currently below the configured threshold.
              </p>

              <p>
                <strong>Current Stock:</strong> ${item.stock}
              </p>

              <p>
                <strong>Low-stock Threshold:</strong>
                ${item.lowStockThreshold}
              </p>

              <p>
                Please update the inventory soon.
              </p>
            </div>
          `,
        });

        console.log(
          `Scheduled low-stock email sent for ${item.name}`
        );
      } catch (emailError) {
        console.error(
          `Scheduled low-stock email failed for ${item.name}:`,
          emailError.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Scheduled low-stock check failed:",
      error.message
    );
  }
}

/* =========================
   HOME / HEALTH CHECK
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "Crust & Co. API is running 🍕",
  });
});

/* =========================
   CUSTOMER REGISTER
========================= */

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const database = client.db("crust-co");
    const users = database.collection("users");

    const existingUser = await users.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const result = await users.insertOne({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      emailVerified: false,
      createdAt: new Date(),
    });

    const verificationToken = jwt.sign(
  {
    userId: result.insertedId.toString(),
    email: cleanEmail,
    purpose: "email-verification",
  },
  JWT_SECRET,
  {
    expiresIn: "24h",
  }
);

const verificationLink =
  `http://localhost:5173/verify-email?token=${verificationToken}`;

try {
  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to: cleanEmail,
    subject: "Verify your Crust & Co. account 🍕",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>Welcome to Crust & Co. 🍕</h2>

        <p>Hi ${cleanName},</p>

        <p>
          Thanks for creating your Crust & Co. account.
          Please verify your email address to activate your account.
        </p>

        <p>
          <a
            href="${verificationLink}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#b91c1c;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Verify Email
          </a>
        </p>

        <p>This verification link expires in 24 hours.</p>

        <p>Crust & Co. 🍕</p>
      </div>
    `,
  });
} catch (emailError) {
  console.error(
    "Verification email failed:",
    emailError.message
  );
}

res.status(201).json({
  message:
    "Account created successfully 🍕 Please check your email to verify your account.",
  user: {
    id: result.insertedId,
    name: cleanName,
    email: cleanEmail,
    emailVerified: false,
  },
});
  } catch (error) {
    console.error(
      "Registration failed:",
      error.message
    );

    res.status(500).json({
      message: "Registration failed",
    });
  }
});
/* =========================
   EMAIL VERIFICATION
========================= */

app.get("/api/auth/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    if (decoded.purpose !== "email-verification") {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token.",
      });
    }

    const database = client.db("crust-co");
    const users = database.collection("users");

    const result = await users.updateOne(
      {
        _id: new ObjectId(decoded.userId),
      },
      {
        $set: {
          emailVerified: true,
          verifiedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    res.json({
      success: true,
      message:
        "Email verified successfully 🍕 You can now login.",
    });
  } catch (error) {
    console.error(
      "Email verification failed:",
      error.message
    );

    res.status(400).json({
      success: false,
      message:
        "Verification link is invalid or expired.",
    });
  }
});
/* =========================
   CUSTOMER LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const database = client.db("crust-co");
    const users = database.collection("users");

    const user = await users.findOne({
      email: cleanEmail,
    });
    if (!user) {
  return res.status(401).json({
    message: "Invalid email or password.",
  });
}

if (!user.emailVerified) {
  return res.status(403).json({
    message:
      "Please verify your email before logging in. Check your inbox for the verification link.",
  });
}

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful 🍕",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      "Login failed:",
      error.message
    );

    res.status(500).json({
      message: "Login failed",
    });
  }
});

/* =========================
   FORGOT PASSWORD
========================= */

app.post(
  "/api/auth/forgot-password",
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      const cleanEmail =
        email.trim().toLowerCase();

      const database = client.db("crust-co");
      const users =
        database.collection("users");

      const user = await users.findOne({
        email: cleanEmail,
      });

      if (!user) {
        return res.status(404).json({
          message:
            "No account found with this email",
        });
      }

      const resetToken = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          purpose: "password-reset",
        },
        JWT_SECRET,
        {
          expiresIn: "15m",
        }
      );

      const resetLink =
        `http://localhost:5173/reset-password?token=${resetToken}`;

      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject:
          "Reset your Crust & Co. password 🍕",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
            <h2>Crust & Co. 🍕</h2>

            <p>Hi ${user.name},</p>

            <p>
              You requested to reset your
              Crust & Co. password.
            </p>

            <p>
              <a
                href="${resetLink}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#e52b20;
                  color:white;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Reset My Password
              </a>
            </p>

            <p>
              This link expires in 15 minutes.
            </p>

            <p>
              If you did not request this,
              you can safely ignore this email.
            </p>
          </div>
        `,
      });

      res.json({
        message:
          "Password reset link sent to your email. 🍕",
      });
    } catch (error) {
      console.error(
        "Forgot password failed:",
        error.message
      );

      res.status(500).json({
        message:
          "Failed to send password reset email",
      });
    }
  }
);

/* =========================
   RESET PASSWORD
========================= */

app.post(
  "/api/auth/reset-password",
  async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({
          message:
            "Reset token and new password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Password must be at least 6 characters",
        });
      }

      const decoded = jwt.verify(
        token,
        JWT_SECRET
      );

      if (
        decoded.purpose !==
        "password-reset"
      ) {
        return res.status(400).json({
          message:
            "Invalid password reset token",
        });
      }

      const database = client.db("crust-co");
      const users =
        database.collection("users");

      const user = await users.findOne({
        _id: new ObjectId(decoded.userId),
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const hashedPassword =
        await bcrypt.hash(password, 10);

      await users.updateOne(
        {
          _id: user._id,
        },
        {
          $set: {
            password: hashedPassword,
          },
        }
      );

      res.json({
        message:
          "Password reset successfully. 🍕",
      });
    } catch (error) {
      console.error(
        "Password reset failed:",
        error.message
      );

      res.status(400).json({
        message:
          "Invalid or expired reset link",
      });
    }
  }
);

/* =========================
   ADMIN LOGIN
========================= */

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            "Admin email and password are required",
        });
      }

      const cleanEmail =
        email.trim().toLowerCase();

      if (
        cleanEmail !==
          process.env.ADMIN_EMAIL
            ?.trim()
            .toLowerCase() ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(401).json({
          message:
            "Invalid admin credentials",
        });
      }

      const token = jwt.sign(
        {
          role: "admin",
          email: cleanEmail,
        },
        JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      res.json({
        message:
          "Admin login successful 🍕",
        token,
        admin: {
          email: cleanEmail,
          role: "admin",
        },
      });
    } catch (error) {
      console.error(
        "Admin login failed:",
        error.message
      );

      res.status(500).json({
        message: "Admin login failed",
      });
    }
  }
);

/* =========================
   SAVE ORDER + UPDATE INVENTORY
========================= */

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;

    const database = client.db("crust-co");
    const orders = database.collection("orders");
    const inventory = database.collection("inventory");

    // Save the order first
    const result = await orders.insertOne({
      ...order,
      status: "Pending",
      createdAt: new Date(),
    });
    const inventoryUsage = getInventoryUsage(order.items);

for (const [ingredientName, quantityUsed] of Object.entries(inventoryUsage)) {
  await inventory.updateOne(
    { name: ingredientName },
    {
      $inc: {
        stock: -quantityUsed,
      },
      $set: {
        updatedAt: new Date(),
      },
    }
  );
}

    // Decrease pizza base stock by number of pizzas ordered
    const pizzaQuantity = (order.items || []).reduce(
      (total, item) => total + (item.quantity || 1),
      0
    );

    if (pizzaQuantity > 0) {
      await inventory.updateOne(
        { name: "Pizza Bases" },
        {
          $inc: {
            stock: -pizzaQuantity,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      );
    }

    res.status(201).json({
      message: "Order saved successfully 🍕",
      orderId: result.insertedId,
    });
  } catch (error) {
    console.error(
      "Order save failed:",
      error.message
    );

    res.status(500).json({
      message: "Failed to save order",
    });
  }
});
/* =========================
   ADMIN - UPDATE INVENTORY
========================= */

app.patch("/api/admin/inventory/:inventoryId", async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { stock } = req.body;

    if (!ObjectId.isValid(inventoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid inventory ID.",
      });
    }

    const newStock = Number(stock);

    if (!Number.isInteger(newStock) || newStock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative whole number.",
      });
    }

    const database = client.db("crust-co");
    const inventory = database.collection("inventory");

    const result = await inventory.updateOne(
      { _id: new ObjectId(inventoryId) },
      {
        $set: {
          stock: newStock,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found.",
      });
    }
    const updatedItem = await inventory.findOne({
  _id: new ObjectId(inventoryId),
});

if (
  updatedItem &&
  updatedItem.stock <= updatedItem.lowStockThreshold
) {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `⚠️ Low Stock Alert - ${updatedItem.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
          <h2>Crust & Co. 🍕</h2>

          <h3>Low Stock Alert</h3>

          <p>
            Inventory item <strong>${updatedItem.name}</strong>
            is running low.
          </p>

          <p>
            <strong>Current Stock:</strong> ${updatedItem.stock}
          </p>

          <p>
            <strong>Low-stock Threshold:</strong>
            ${updatedItem.lowStockThreshold}
          </p>

          <p>
            Please update the inventory soon.
          </p>
        </div>
      `,
    });

    console.log(
      `Low-stock email sent for ${updatedItem.name}`
    );
  } catch (emailError) {
    console.error(
      "Low-stock email failed:",
      emailError.message
    );
  }
}

    res.json({
      success: true,
      message: "Inventory updated successfully.",
      stock: newStock,
    });
  } catch (error) {
    console.error(
      "Inventory update failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to update inventory.",
    });
  }
});
/* =========================
   ADMIN - GET INVENTORY
========================= */

app.get("/api/admin/inventory", async (req, res) => {
  try {
    const database = client.db("crust-co");
    const inventory = database.collection("inventory");

    let items = await inventory
      .find({})
      .sort({ name: 1 })
      .toArray();

    // Create initial inventory if collection is empty
    if (items.length === 0) {
      const initialInventory = [
        { name: "Pizza Bases", stock: 100, lowStockThreshold: 20 },
        { name: "Tomato Sauce", stock: 100, lowStockThreshold: 20 },
        { name: "Mozzarella Cheese", stock: 100, lowStockThreshold: 20 },
        { name: "Vegetables", stock: 100, lowStockThreshold: 20 },
        { name: "Pepperoni", stock: 100, lowStockThreshold: 20 },
        { name: "Chicken", stock: 100, lowStockThreshold: 20 },
      ];

      await inventory.insertMany(initialInventory);

      items = await inventory
        .find({})
        .sort({ name: 1 })
        .toArray();
    }

    res.json({
      success: true,
      inventory: items,
    });
  } catch (error) {
    console.error(
      "Inventory fetch failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch inventory.",
    });
  }
});
/* =========================
   ADMIN - GET ALL ORDERS
========================= */

app.get("/api/admin/orders", async (req, res) => {
  try {
    const database = client.db("crust-co");
    const orders = database.collection("orders");

    const allOrders = await orders
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      orders: allOrders,
    });
  } catch (error) {
    console.error(
      "Admin orders fetch failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});
/* =========================
   ADMIN - UPDATE ORDER STATUS
========================= */

app.patch("/api/admin/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Out for Delivery",
      "Delivered",
    ];

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const database = client.db("crust-co");
    const orders = database.collection("orders");

    const result = await orders.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully.",
      status,
    });
  } catch (error) {
    console.error(
      "Admin order status update failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
});
/* =========================
   GET ORDER TRACKING
========================= */

app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!ObjectId.isValid(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID.",
      });
    }

    const database = client.db("crust-co");
    const orders = database.collection("orders");

    const order = await orders.findOne({
      _id: new ObjectId(orderId),
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "Order tracking failed:",
      error.message
    );

    res.status(500).json({
      message: "Unable to fetch order tracking.",
    });
  }
});
/* =========================
   VERIFY RAZORPAY PAYMENT
========================= */

app.post("/api/payment/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are required.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    const isAuthentic =
      generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    res.json({
      success: true,
      message: "Payment verified successfully 🍕",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error(
      "Razorpay payment verification failed:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
});

/* =========================
   START SERVER
========================= */

async function startServer() {
  try {
    await client.connect();

    console.log(
      "MongoDB connected successfully 🍕"
    );

    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
    cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled low-stock check...");
  await checkLowStock();
});
  }
}

startServer();