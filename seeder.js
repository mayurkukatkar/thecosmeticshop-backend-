const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Banner = require('./models/Banner');
const connectDB = require('./config/db');

dotenv.config();

const runSeeder = async () => {
    await connectDB();
    importData();
};

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Banner.deleteMany();

        // Admin User
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password', // Will be hashed by pre-save hooks in User model
            isAdmin: true,
            isVerified: true,
        });

        const createdUser = await adminUser.save();

        // Sample Products
        const products = [
            {
                user: createdUser._id,
                name: 'Royal Emerald Banarasi Saree',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
                description: 'A luxurious Royal Emerald Green Banarasi Saree handcrafted with premium mulberry silk and adorned with intricate gold zari brocade work.',
                brand: 'Chawke Legacy',
                category: 'sarees',
                price: 8499.00,
                originalPrice: 9999.00,
                countInStock: 10,
                ingredients: '100% Pure Katan Silk, Gold Zari metallic threads, Handloom woven in Varanasi',
                benefits: 'Handmade luxury, Dry clean only, Stored in muslin fabric for durability',
                howToUse: 'Pair with a matching emerald green blouse and traditional gold temple jewelry for an elegant wedding or festive look.',
            },
            {
                user: createdUser._id,
                name: 'Crimson Maroon Embroidered Lehenga',
                image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
                description: 'A breathtaking Crimson Maroon bridal lehenga featuring exquisite floral dori, gota patti and zardozi embroidery across the flared skirt.',
                brand: 'Chawke Bridal',
                category: 'lehengas',
                price: 18500.00,
                originalPrice: 22000.00,
                countInStock: 5,
                ingredients: 'Premium Velvet Silk Lehenga, Organza Dupatta with border zardozi, Soft Satin Lining',
                benefits: 'Intricate Zardozi handwork, Dry clean only, Handle dupatta with care',
                howToUse: 'Drape the organza dupatta pleated on one shoulder and style with statement kundan choker and matching maang tikka.',
            },
            {
                user: createdUser._id,
                name: 'Mustard Yellow Festive Kurta Set',
                image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=800',
                description: 'An elegant mustard yellow straight kurta with gold foil prints, paired with matching ankle-length palazzo pants and a sheer organza dupatta.',
                brand: 'Chawke Daily',
                category: 'kurtis-tunics',
                price: 2499.00,
                originalPrice: 2999.00,
                countInStock: 25,
                ingredients: 'Chanderi Cotton Silk blend kurta & pants, Pure Organza dupatta, Cotton inner lining',
                benefits: 'Lightweight & breathable fabric, Mild hand wash, Iron on reverse',
                howToUse: 'Perfect for Haldi functions or daytime festivities. Style with jhumkas and mojari flats.',
            },
            {
                user: createdUser._id,
                name: 'Royal Navy Anarkali palazzo Set',
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
                description: 'A majestic flowy Anarkali suit set in royal navy blue, highlighted by delicate gota-patti work on the neckline and bottom borders.',
                brand: 'Chawke Couture',
                category: 'anarkalis-suits',
                price: 4200.00,
                originalPrice: 4999.00,
                countInStock: 15,
                ingredients: 'Premium Georgette Anarkali & Palazzo, Chiffon Dupatta with Gota borders',
                benefits: 'Flowy flared silhouette, Gentle hand wash or dry clean, Steam iron only',
                howToUse: 'Wear with high heels and drop earrings. Fits true to size with adjustable side ties.',
            },
            {
                user: createdUser._id,
                name: 'Zari Banarasi Border Dupatta',
                image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
                description: 'A classic handwoven gold Banarasi silk dupatta designed to instantly elevate any simple kurta or suit set.',
                brand: 'Chawke Legacy',
                category: 'dupattas-accessories',
                price: 1500.00,
                originalPrice: 1999.00,
                countInStock: 30,
                ingredients: 'Art Silk, woven gold zari border, Tassel finishes',
                benefits: 'Luxurious gold sheen, Dry clean only, Store away from direct sunlight',
                howToUse: 'Drape elegantly over both shoulders or on one side of a solid black, white, or red kurta set.',
            }
        ];

        await Product.insertMany(products);

        // Sample Banner
        const sampleBanner = new Banner({
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=90&w=1920',
            title: 'Royal Ethnic Wear Collection',
            link: '/products',
            isActive: true,
        });

        await sampleBanner.save();

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

runSeeder();
