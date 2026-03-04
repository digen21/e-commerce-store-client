export const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@threadcraft.com', password: 'password123', role: 'ADMIN' },
    { id: '2', name: 'Test User', email: 'user@test.com', password: 'password123', role: 'USER' },
];

export const mockProducts = [
    {
        id: '1',
        title: 'Neon Nights Graphic Tee',
        description: 'A vibrant streetwear graphic tee featuring neon accents and premium cotton blend.',
        price: 35.00,
        category: 'Streetwear',
        stockQuantity: 45,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Classic Minimalist White Tee',
        description: 'The perfectly tailored white t-shirt. Essential for any wardrobe.',
        price: 25.00,
        category: 'Classic',
        stockQuantity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '3',
        title: 'Vintage Fade Logo Shirt',
        description: 'Washed and faded for that perfect vintage look featuring our heritage logo.',
        price: 30.00,
        category: 'Graphic',
        stockQuantity: 3, // Low stock for testing
        imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '4',
        title: 'Heavyweight Premium Blank',
        description: 'Thick 280gsm cotton. Boxy fit. Uncompromised quality.',
        price: 45.00,
        category: 'Premium',
        stockQuantity: 0, // Out of stock
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '5',
        title: 'Cyberpunk Cyber-Glitch Tee',
        description: 'Digital glitch art printed on a soft, breathable synthetic blend.',
        price: 38.00,
        category: 'Streetwear',
        stockQuantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const mockOrders = [
    {
        _id: '69a72436f593ffecb8e050f5',
        userId: '2',
        items: [
            {
                product: {
                    _id: '1',
                    title: 'Neon Nights Graphic Tee',
                    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
                    price: 35.00
                },
                quantity: 2,
                total: 70.00
            }
        ],
        totalAmount: 70.00,
        subtotal: 70.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'FULFILLED',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: '69a72436f593ffecb8e050f6',
        userId: '2',
        items: [
            {
                product: {
                    _id: '2',
                    title: 'Classic Minimalist White Tee',
                    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
                    price: 25.00
                },
                quantity: 3,
                total: 75.00
            }
        ],
        totalAmount: 75.00,
        subtotal: 75.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'SHIPPING',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: '69a72436f593ffecb8e050f7',
        userId: '2',
        items: [
            {
                product: {
                    _id: '3',
                    title: 'Vintage Fade Logo Shirt',
                    imageUrl: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&q=80',
                    price: 30.00
                },
                quantity: 1,
                total: 30.00
            },
            {
                product: {
                    _id: '5',
                    title: 'Cyberpunk Cyber-Glitch Tee',
                    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
                    price: 38.00
                },
                quantity: 1,
                total: 38.00
            }
        ],
        totalAmount: 68.00,
        subtotal: 68.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PENDING',
        paymentMethod: 'stripe',
        orderStatus: 'CONFIRMED',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: '69a72436f593ffecb8e050f8',
        userId: '2',
        items: [
            {
                product: {
                    _id: '4',
                    title: 'Heavyweight Premium Blank',
                    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80',
                    price: 45.00
                },
                quantity: 2,
                total: 90.00
            }
        ],
        totalAmount: 90.00,
        subtotal: 90.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'CREATED',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: '69a72436f593ffecb8e050f9',
        userId: '2',
        items: [
            {
                product: {
                    _id: '1',
                    title: 'Neon Nights Graphic Tee',
                    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
                    price: 35.00
                },
                quantity: 1,
                total: 35.00
            }
        ],
        totalAmount: 35.00,
        subtotal: 35.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'FAILED',
        paymentMethod: 'stripe',
        orderStatus: 'FAILED',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        _id: '69a72436f593ffecb8e050fa',
        userId: '2',
        items: [
            {
                product: {
                    _id: '2',
                    title: 'Classic Minimalist White Tee',
                    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80',
                    price: 25.00
                },
                quantity: 4,
                total: 100.00
            }
        ],
        totalAmount: 100.00,
        subtotal: 100.00,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'FULFILLED',
        shippingAddress: {
            fullName: 'Test User',
            phone: '+91 9876543210',
            addressLine1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400001',
            country: 'India'
        },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

export const mockSales = {
    totalRevenue: 438.00,
    totalOrders: 6,
};
