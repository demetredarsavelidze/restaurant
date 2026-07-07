import bcrypt from "bcrypt";
import "dotenv/config";
import { closePool, getPool, sql } from "../utils/sqlServer.js";

const menuItems = [
  {
    name: "Charred Sourdough & Cultured Butter",
    description: "House sourdough served warm with whipped cultured butter and sea salt.",
    price: 9,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Burrata with Roasted Fig",
    description: "Creamy burrata, roasted figs, toasted pistachio, and aged balsamic.",
    price: 16,
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Caesar Verde",
    description: "Baby romaine, parmesan crisp, sourdough crumb, and herb caesar dressing.",
    price: 14,
    category: "Salads",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Harvest Grain Salad",
    description: "Farro, roasted squash, arugula, apple, walnut, and champagne vinaigrette.",
    price: 15,
    category: "Salads",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Tagliatelle al Ragu",
    description: "Fresh tagliatelle with slow-braised beef ragu and shaved pecorino.",
    price: 24,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Lemon Ricotta Ravioli",
    description: "Hand-filled ravioli, brown butter, sage, lemon zest, and parmesan.",
    price: 23,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Margherita Classica",
    description: "San Marzano tomato, fresh mozzarella, basil, and extra virgin olive oil.",
    price: 18,
    category: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Wild Mushroom Pizza",
    description: "Fontina, roasted mushrooms, thyme, garlic cream, and black pepper.",
    price: 21,
    category: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Aurora Burger",
    description: "Dry-aged beef, cheddar, caramelized onion, house pickles, and aioli.",
    price: 22,
    category: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Crispy Chicken Sandwich",
    description: "Buttermilk chicken, cabbage slaw, dill pickles, and smoked paprika mayo.",
    price: 19,
    category: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e2a13086?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Herb Roasted Chicken",
    description: "Half chicken, potato puree, seasonal vegetables, and natural jus.",
    price: 29,
    category: "Main Courses",
    imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Prime New York Strip",
    description: "12 oz strip steak, roasted garlic butter, watercress, and pommes frites.",
    price: 46,
    category: "Main Courses",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pan-Seared Salmon",
    description: "Atlantic salmon, fennel, citrus beurre blanc, and crispy capers.",
    price: 32,
    category: "Seafood",
    imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mussels with White Wine",
    description: "Prince Edward Island mussels, garlic, herbs, white wine, and grilled bread.",
    price: 26,
    category: "Seafood",
    imageUrl: "https://images.unsplash.com/photo-1606850780554-b55ea0d30d70?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dark Chocolate Torte",
    description: "Flourless chocolate torte, espresso cream, and cocoa nib crumble.",
    price: 12,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Vanilla Bean Panna Cotta",
    description: "Silky panna cotta with seasonal berry compote and almond lace.",
    price: 11,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "House Sparkling Lemonade",
    description: "Fresh lemon, mineral water, mint, and a touch of cane sugar.",
    price: 7,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Zero-Proof Negroni",
    description: "Bitter orange, botanicals, rosemary, and a large clear cube.",
    price: 10,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=80",
  },
];

const testimonials = [
  {
    customerName: "Elena Morris",
    comment: "Elegant room, thoughtful service, and a reservation flow that made the evening easy.",
    rating: 5,
  },
  {
    customerName: "Marcus Lee",
    comment: "The QR menu was fast at the table and the seasonal dishes were excellent.",
    rating: 5,
  },
  {
    customerName: "Priya Shah",
    comment: "Professional, warm, and polished from booking to dessert.",
    rating: 5,
  },
];

async function main() {
  const pool = await getPool();
  const password = await bcrypt.hash("Admin123!", 12);

  await pool
    .request()
    .input("name", sql.NVarChar(255), "Restaurant Admin")
    .input("email", sql.NVarChar(320), "admin@restaurant.com")
    .input("password", sql.NVarChar(255), password)
    .query(`
      IF EXISTS (SELECT 1 FROM [User] WHERE [email] = @email)
      BEGIN
        UPDATE [User]
        SET [name] = @name,
            [password] = @password,
            [role] = N'ADMIN',
            [updatedAt] = SYSUTCDATETIME()
        WHERE [email] = @email;
      END
      ELSE
      BEGIN
        INSERT INTO [User] ([name], [email], [password], [role])
        VALUES (@name, @email, @password, N'ADMIN');
      END
    `);

  for (const [index, item] of menuItems.entries()) {
    await pool
      .request()
      .input("id", sql.Int, index + 1)
      .input("name", sql.NVarChar(255), item.name)
      .input("description", sql.NVarChar(sql.MAX), item.description)
      .input("price", sql.Decimal(10, 2), item.price)
      .input("category", sql.NVarChar(120), item.category)
      .input("imageUrl", sql.NVarChar(2048), item.imageUrl)
      .query(`
        IF EXISTS (SELECT 1 FROM [MenuItem] WHERE [id] = @id)
        BEGIN
          UPDATE [MenuItem]
          SET [name] = @name,
              [description] = @description,
              [price] = @price,
              [category] = @category,
              [imageUrl] = @imageUrl,
              [updatedAt] = SYSUTCDATETIME()
          WHERE [id] = @id;
        END
        ELSE
        BEGIN
          SET IDENTITY_INSERT [MenuItem] ON;
          INSERT INTO [MenuItem] ([id], [name], [description], [price], [category], [imageUrl])
          VALUES (@id, @name, @description, @price, @category, @imageUrl);
          SET IDENTITY_INSERT [MenuItem] OFF;
        END
      `);
  }

  const capacities = [2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 2, 2, 4, 4, 6, 6, 8, 8, 4, 10];

  for (const [index, capacity] of capacities.entries()) {
    await pool
      .request()
      .input("tableNumber", sql.Int, index + 1)
      .input("capacity", sql.Int, capacity)
      .query(`
        IF EXISTS (SELECT 1 FROM [RestaurantTable] WHERE [tableNumber] = @tableNumber)
        BEGIN
          UPDATE [RestaurantTable]
          SET [capacity] = @capacity,
              [status] = N'AVAILABLE',
              [updatedAt] = SYSUTCDATETIME()
          WHERE [tableNumber] = @tableNumber;
        END
        ELSE
        BEGIN
          INSERT INTO [RestaurantTable] ([tableNumber], [capacity], [status])
          VALUES (@tableNumber, @capacity, N'AVAILABLE');
        END
      `);
  }

  await pool.request().query("DELETE FROM [Testimonial];");

  for (const testimonial of testimonials) {
    await pool
      .request()
      .input("customerName", sql.NVarChar(255), testimonial.customerName)
      .input("comment", sql.NVarChar(sql.MAX), testimonial.comment)
      .input("rating", sql.Int, testimonial.rating)
      .query(`
        INSERT INTO [Testimonial] ([customerName], [comment], [rating])
        VALUES (@customerName, @comment, @rating);
      `);
  }

  console.log("SQL Server database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
