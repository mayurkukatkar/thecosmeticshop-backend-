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
                name: 'Luxury Lipstick',
                image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=300&h=300',
                description: 'Long-lasting matte lipstick in vibrant red.',
                brand: 'Luxe',
                category: 'Lips',
                price: 24.99,
                originalPrice: 29.99,
                countInStock: 20,
                ingredients: 'Castor Oil, Beeswax, Vitamin E, Red 7 Lake, Shea Butter',
                benefits: 'Long-lasting wear, Hydrating formula, Vibrant color pay-off',
                howToUse: 'Apply directly to lips from the bullet or use a lip brush for more precision.',
            },
            {
                user: createdUser._id,
                name: 'Hydrating Face Cream',
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=300&h=300',
                description: 'Deeply moisturizing cream for all skin types.',
                brand: 'Glow',
                category: 'Face',
                price: 45.00,
                originalPrice: 55.00,
                countInStock: 15,
                ingredients: 'Water, Hyaluronic Acid, Aloe Vera Extract, Jojoba Oil',
                benefits: 'Deep hydration, Soothes irritated skin, Lightweight texture',
                howToUse: 'after cleansing, apply a small amount to face and neck. Massage gently until absorbed.',
            },
            {
                user: createdUser._id,
                name: 'Volume Mascara',
                image: 'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&q=80&w=300&h=300',
                description: 'Dramatic volume for your lashes.',
                brand: 'Luxe',
                category: 'Eyes',
                price: 18.50,
                countInStock: 50,
            }
        ];

        await Product.insertMany(products);

        // Sample Banner
        const sampleBanner = new Banner({
            image: 'https://images.unsplash.com/photo-1487412947132-23c53f7158dc?auto=format&fit=crop&q=80&w=1200&h=400',
            title: 'Summer Collection',
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
