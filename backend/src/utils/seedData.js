const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const connectDB = require('../config/db');
require('dotenv').config();

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log('🧹 Clearing existing collections...');
    await User.deleteMany();
    await Item.deleteMany();

    console.log('🌱 Creating demo users...');
    const user1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@campus.edu',
      password: 'password123',
      studentId: 'CS-2024-042',
      department: 'Computer Science',
      phone: '+1 (555) 234-5678',
      whatsapp: '+15552345678',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alex',
      role: 'student',
    });

    const user2 = await User.create({
      name: 'Sarah Miller',
      email: 'sarah@campus.edu',
      password: 'password123',
      studentId: 'EE-2024-118',
      department: 'Electrical Engineering',
      phone: '+1 (555) 876-5432',
      whatsapp: '+15558765432',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sarah',
      role: 'student',
    });

    const user3 = await User.create({
      name: 'Campus Admin',
      email: 'admin@campus.edu',
      password: 'admin123',
      studentId: 'STAFF-001',
      department: 'Student Affairs & Campus Security',
      phone: '+1 (555) 999-0000',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      role: 'admin',
    });

    console.log('🌱 Creating lost and found items with smart match pairings...');

    const today = new Date();
    const oneDayAgo = new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);

    const items = [
      // 1. LOST - AirPods (Alex)
      {
        title: 'Apple AirPods Pro 2 in White Case',
        type: 'lost',
        category: 'Electronics',
        location: 'Central Library',
        specificLocation: '2nd Floor Quiet Study Area, Desk #14 near window',
        date: twoDaysAgo,
        description:
          'Lost my Apple AirPods Pro 2nd Gen while studying for midterm exams. The white charging case has a small blue sticker at the back. Left earbud has tiny scratch.',
        brand: 'Apple',
        color: 'White',
        tags: ['airpods', 'apple', 'earbuds', 'white', 'bluetooth', 'audio'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-airpods-1',
          },
        ],
        status: 'active',
        postedBy: user1._id,
        contactPreference: 'whatsapp',
        contactPhone: '+1 (555) 234-5678',
        reward: '$30 Reward for safe return',
      },

      // 2. FOUND - Matching AirPods (Sarah) -> Should show ~90% match!
      {
        title: 'Found Apple AirPods in White Case',
        type: 'found',
        category: 'Electronics',
        location: 'Central Library',
        specificLocation: '2nd Floor Reading Section Table 14',
        date: oneDayAgo,
        description:
          'Found a set of white Apple AirPods Pro on the study table after the library closed yesterday evening. Submitted temporarily with library reception desk.',
        brand: 'Apple',
        color: 'White',
        tags: ['airpods', 'apple', 'case', 'white', 'headphones'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-airpods-found',
          },
        ],
        status: 'active',
        postedBy: user2._id,
        contactPreference: 'in_app',
        contactEmail: 'sarah@campus.edu',
      },

      // 3. LOST - Dell Laptop Charger (Sarah)
      {
        title: 'Dell 65W USB-C Laptop Power Adapter',
        type: 'lost',
        category: 'Electronics',
        location: 'Computer Labs & Server Hub',
        specificLocation: 'Lab 302, workstation next to printer',
        date: threeDaysAgo,
        description:
          'Black Dell 65-Watt USB-C charger left behind after afternoon lab session. Has silver masking tape wrapped around the cable connector.',
        brand: 'Dell',
        color: 'Black',
        tags: ['dell', 'charger', 'adapter', 'usbc', 'power', 'laptop'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-charger-1',
          },
        ],
        status: 'active',
        postedBy: user2._id,
        contactPreference: 'phone',
        contactPhone: '+1 (555) 876-5432',
      },

      // 4. FOUND - Matching Dell Charger (Alex) -> Should show ~85% match!
      {
        title: 'Dell Laptop Power Adapter & Cord Found',
        type: 'found',
        category: 'Electronics',
        location: 'Computer Labs & Server Hub',
        specificLocation: 'Lab 302 rear bench',
        date: twoDaysAgo,
        description:
          'Found a black Dell laptop power brick with USB-C tip plugged into wall outlet in Lab 302. Still with security desk.',
        brand: 'Dell',
        color: 'Black',
        tags: ['dell', 'power', 'adapter', 'cord', 'usbc'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-charger-found',
          },
        ],
        status: 'active',
        postedBy: user1._id,
        contactPreference: 'in_app',
        contactEmail: 'alex@campus.edu',
      },

      // 5. LOST - Brown Leather Wallet (Alex)
      {
        title: 'Brown Leather Fossil Wallet with Student ID',
        type: 'lost',
        category: 'Bags & Wallets',
        location: 'Main Cafeteria & Food Court',
        specificLocation: 'Near Subway / Coffee counter seating booth',
        date: twoDaysAgo,
        description:
          'Lost brown bi-fold Fossil wallet containing my student identification card, debit card, and driver license. Great sentimental value.',
        brand: 'Fossil',
        color: 'Brown',
        tags: ['wallet', 'leather', 'brown', 'id', 'cards', 'fossil'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-wallet-1',
          },
        ],
        status: 'active',
        postedBy: user1._id,
        contactPreference: 'whatsapp',
        contactPhone: '+1 (555) 234-5678',
        reward: '$50 for return of cards and ID',
      },

      // 6. FOUND - Matching Brown Wallet (Admin) -> Match ~88%!
      {
        title: 'Brown Leather Wallet Found at Food Court',
        type: 'found',
        category: 'Bags & Wallets',
        location: 'Main Cafeteria & Food Court',
        specificLocation: 'Under booth table near beverage counter',
        date: oneDayAgo,
        description:
          'Brown leather bifold wallet handed over to Campus Security. Contains university student cards. Please claim with valid identity verification at Admin Block Room 102.',
        brand: 'Fossil',
        color: 'Brown',
        tags: ['wallet', 'brown', 'cards', 'leather'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-wallet-found',
          },
        ],
        status: 'active',
        postedBy: user3._id,
        contactPreference: 'in_app',
        contactEmail: 'admin@campus.edu',
      },

      // 7. LOST - Casio Calculator (Sarah)
      {
        title: 'Casio fx-991EX Scientific Calculator',
        type: 'lost',
        category: 'Books & Stationery',
        location: 'Science & Tech Block (Block B)',
        specificLocation: 'Physics Hall B104',
        date: fiveDaysAgo,
        description:
          'Casio ClassWiz fx-991EX scientific calculator with black cover. Has small math formula cheat-sheet sticker inside the protective slide case.',
        brand: 'Casio',
        color: 'Black',
        tags: ['calculator', 'casio', 'scientific', 'classwiz', 'math'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-calc-1',
          },
        ],
        status: 'active',
        postedBy: user2._id,
        contactPreference: 'email',
        contactEmail: 'sarah@campus.edu',
      },

      // 8. FOUND - Matching Casio Calculator (Alex) -> Match ~92%!
      {
        title: 'Found Casio Scientific Calculator ClassWiz',
        type: 'found',
        category: 'Books & Stationery',
        location: 'Science & Tech Block (Block B)',
        specificLocation: 'Lecture room B104 front row bench',
        date: fourDaysAgo = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
        description:
          'Found a black Casio fx-991 scientific calculator left on lecture bench after Calculus class. Has sticker on the inner cover.',
        brand: 'Casio',
        color: 'Black',
        tags: ['calculator', 'casio', 'scientific', 'physics'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-calc-found',
          },
        ],
        status: 'active',
        postedBy: user1._id,
        contactPreference: 'in_app',
      },

      // 9. LOST - Bike Keys (Alex)
      {
        title: 'Key Ring with 3 Keys and Iron Man Keychain',
        type: 'lost',
        category: 'Keys',
        location: 'Hostel Zone (North/South)',
        specificLocation: 'Bicycle parking shed near Block D hostel',
        date: threeDaysAgo,
        description:
          'Bunch of 3 metallic keys with red Marvel Iron Man mask metallic keychain and mini silver carabiner.',
        brand: 'Marvel',
        color: 'Red & Silver',
        tags: ['keys', 'keychain', 'ironman', 'hostel', 'bike'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-keys-1',
          },
        ],
        status: 'active',
        postedBy: user1._id,
        contactPreference: 'phone',
        contactPhone: '+1 (555) 234-5678',
      },

      // 10. RESOLVED SAMPLE - Stainless Steel Water Bottle
      {
        title: 'Hydro Flask 32oz Insulated Bottle (Cobalt Blue)',
        type: 'lost',
        category: 'Bottles & Flasks',
        location: 'Sports Complex & Gym',
        specificLocation: 'Basketball court bleachers',
        date: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        description:
          'Cobalt blue Hydro Flask water bottle with silicone boot and stickers. Returned successfully via CampusFind!',
        brand: 'Hydro Flask',
        color: 'Blue',
        tags: ['bottle', 'water', 'hydroflask', 'blue', 'gym'],
        images: [
          {
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
            public_id: 'seed-bottle-1',
          },
        ],
        status: 'resolved',
        postedBy: user2._id,
        resolvedAt: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
    ];

    await Item.insertMany(items);

    // Update user stats
    await User.findByIdAndUpdate(user1._id, {
      itemsLostCount: 3,
      itemsFoundCount: 2,
      itemsResolvedCount: 1,
    });

    await User.findByIdAndUpdate(user2._id, {
      itemsLostCount: 2,
      itemsFoundCount: 1,
      itemsResolvedCount: 1,
    });

    console.log('✅ Seed data successfully inserted!');
    console.log('----------------------------------------------------');
    console.log('Demo Accounts:');
    console.log('1. Student 1: alex@campus.edu  / password123');
    console.log('2. Student 2: sarah@campus.edu / password123');
    console.log('3. Admin:     admin@campus.edu / admin123');
    console.log('----------------------------------------------------');

    return true;
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
};

// If run directly via `npm run seed`
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('Seeding finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
