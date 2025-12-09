const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Config = require('../models/Config');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return;
    } else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            status: 'Pending',
        });

        const createdOrder = await order.save();

        // Send Email to Customer
        try {
            await sendEmail({
                email: req.user.email,
                subject: 'Order Confirmation - The Cosmetic Shop',
                message: `
                    <h1>Thank you for your order!</h1>
                    <p>Hi ${req.user.name},</p>
                    <p>We have received your order <strong>#${createdOrder._id}</strong>.</p>
                    <p>Total Amount: <strong>₹${totalPrice}</strong></p>
                    <p>We will notify you once your order is shipped.</p>
                `
            });
        } catch (error) {
            console.error('Error sending customer email:', error);
        }

        // Send Email to Delivery Team (if configured)
        try {
            const deliveryConfig = await Config.findOne({ key: 'deliveryEmail' });
            if (deliveryConfig && deliveryConfig.value) {
                await sendEmail({
                    email: deliveryConfig.value,
                    subject: 'New Order Received',
                    message: `
                        <h1>New Order Alert</h1>
                        <p>Order ID: <strong>#${createdOrder._id}</strong></p>
                        <p>Customer: ${req.user.name}</p>
                        <p>Total: ₹${totalPrice}</p>
                        <p>Please check the admin panel for details.</p>
                    `
                });
            }
        } catch (error) {
            console.error('Error sending delivery team email:', error);
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            if (order.paymentMethod === 'COD') {
                order.isPaid = true;
                order.paidAt = Date.now();
            }
        }

        if (status === 'Shipped') {
            // Optional: Add shippedAt date if schema supported it
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderStatus,
    getMyOrders,
    getOrders,
};
