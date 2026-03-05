/**
 * Mock Data for Admin Dashboard
 * 
 * This file contains mock data for the admin dashboard.
 * Once backend APIs are ready, replace the API calls to use real endpoints.
 * 
 * Backend API Response Format Reference:
 * - All responses should follow the structure: { data: {...}, success: true, message: "..." }
 * - Dates should be in ISO 8601 format
 * - Currency values should be numbers (not strings)
 * - Pagination should include: page, limit, total, totalPages
 */

// ==================== DASHBOARD OVERVIEW ====================
export const mockDashboardOverview = {
  success: true,
  data: {
    totalProducts: 156,
    totalOrders: 1248,
    totalRevenue: 89456.78,
    conversionRate: 3.24,
    // Period comparison (vs previous period)
    metrics: {
      productsChange: 12.5,    // +12.5% new products
      ordersChange: 8.3,       // +8.3% more orders
      revenueChange: 15.7,     // +15.7% more revenue
      conversionChange: -0.5   // -0.5% conversion rate
    }
  }
};

// ==================== SALES TRENDS ====================
// Generate dynamic sales trends data for the last 7 days or 6 months
const generateSalesTrends = (period = 'weekly') => {
  const trends = [];
  let totalRevenue = 0;
  let totalOrders = 0;

  if (period === 'weekly') {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD format

      // Generate random but realistic sales data
      const revenue = Math.floor(Math.random() * 2000) + 1000; // 1000-3000
      const orders = Math.floor(revenue / 50); // Approx average order value of 50

      trends.push({
        date: dateStr,
        revenue: revenue,
        orders: orders
      });

      totalRevenue += revenue;
      totalOrders += orders;
    }
  } else {
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const dateStr = `${year}-${month}-01`; // First day of month

      // Generate random but realistic sales data for month
      const revenue = Math.floor(Math.random() * 15000) + 8000; // 8000-23000
      const orders = Math.floor(revenue / 45); // Approx average order value of 45

      trends.push({
        date: dateStr,
        revenue: revenue,
        orders: orders
      });

      totalRevenue += revenue;
      totalOrders += orders;
    }
  }

  return {
    trends,
    summary: {
      totalRevenue: totalRevenue,
      totalOrders: totalOrders,
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0
    }
  };
};

// Generate both weekly and monthly data
const weeklySalesTrends = generateSalesTrends('weekly');
const monthlySalesTrends = generateSalesTrends('monthly');

export const mockSalesTrends = {
  success: true,
  data: {
    period: 'weekly', // default period
    currency: 'INR',
    trends: weeklySalesTrends.trends,
    summary: weeklySalesTrends.summary
  }
};

export const mockMonthlySalesTrends = {
  success: true,
  data: {
    period: 'monthly',
    currency: 'INR',
    trends: monthlySalesTrends.trends,
    summary: monthlySalesTrends.summary
  }
};

// ==================== ORDER STATUS DISTRIBUTION ====================
export const mockOrderStatusDistribution = {
  success: true,
  data: {
    totalOrders: 1248,
    distribution: [
      { status: 'FULFILLED', count: 687, percentage: 55.0, color: '#22c55e' },   // Green
      { status: 'SHIPPING', count: 249, percentage: 20.0, color: '#3b82f6' },    // Blue
      { status: 'CONFIRMED', count: 125, percentage: 10.0, color: '#eab308' },   // Yellow
      { status: 'CREATED', count: 62, percentage: 5.0, color: '#f97316' },       // Orange
      { status: 'CANCELLED', count: 75, percentage: 6.0, color: '#ef4444' },     // Red
      { status: 'FAILED', count: 50, percentage: 4.0, color: '#6b7280' }         // Gray
    ]
  }
};

// ==================== RECENT ORDERS ====================
export const mockRecentOrders = {
  success: true,
  data: {
    orders: [
      {
        _id: '69a72436f593ffecb8e050f5',
        orderNumber: 'ORD-2024-001234',
        customer: {
          _id: '69a6cb4386927cac2b08b250',
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b262',
              title: 'Premium Cotton T-Shirt',
              imageUrl: 'https://cloudinary.com/image1.jpg',
              price: 29.99
            },
            quantity: 2,
            total: 59.98
          }
        ],
        totalAmount: 59.98,
        subtotal: 59.98,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'SHIPPING',
        shippingAddress: {
          fullName: 'John Doe',
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
        orderNumber: 'ORD-2024-001235',
        customer: {
          _id: '69a6cb4386927cac2b08b251',
          name: 'Jane Smith',
          email: 'jane.smith@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b263',
              title: 'Graphic Print Hoodie',
              imageUrl: 'https://cloudinary.com/image2.jpg',
              price: 59.99
            },
            quantity: 1,
            total: 59.99
          }
        ],
        totalAmount: 59.99,
        subtotal: 59.99,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'CONFIRMED',
        shippingAddress: {
          fullName: 'Jane Smith',
          phone: '+91 9876543211',
          addressLine1: '456 Park Avenue',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '69a72436f593ffecb8e050f7',
        orderNumber: 'ORD-2024-001236',
        customer: {
          _id: '69a6cb4386927cac2b08b252',
          name: 'Mike Johnson',
          email: 'mike.j@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b264',
              title: 'Classic Denim Jacket',
              imageUrl: 'https://cloudinary.com/image3.jpg',
              price: 89.99
            },
            quantity: 1,
            total: 89.99
          },
          {
            product: {
              _id: '69a6cbfc86927cac2b08b265',
              title: 'Slim Fit Jeans',
              imageUrl: 'https://cloudinary.com/image4.jpg',
              price: 49.99
            },
            quantity: 2,
            total: 99.98
          }
        ],
        totalAmount: 189.97,
        subtotal: 189.97,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PENDING',
        paymentMethod: 'stripe',
        orderStatus: 'CREATED',
        shippingAddress: {
          fullName: 'Mike Johnson',
          phone: '+91 9876543212',
          addressLine1: '789 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '69a72436f593ffecb8e050f8',
        orderNumber: 'ORD-2024-001237',
        customer: {
          _id: '69a6cb4386927cac2b08b253',
          name: 'Sarah Williams',
          email: 'sarah.w@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b266',
              title: 'Urban Streetwear Hoodie',
              imageUrl: 'https://cloudinary.com/image5.jpg',
              price: 69.99
            },
            quantity: 1,
            total: 69.99
          }
        ],
        totalAmount: 69.99,
        subtotal: 69.99,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'FULFILLED',
        shippingAddress: {
          fullName: 'Sarah Williams',
          phone: '+91 9876543213',
          addressLine1: '321 Brigade Road',
          city: 'Bangalore',
          state: 'Karnataka',
          postalCode: '560025',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '69a72436f593ffecb8e050f9',
        orderNumber: 'ORD-2024-001238',
        customer: {
          _id: '69a6cb4386927cac2b08b254',
          name: 'David Brown',
          email: 'david.b@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b267',
              title: 'Minimalist Logo Tee',
              imageUrl: 'https://cloudinary.com/image6.jpg',
              price: 24.99
            },
            quantity: 3,
            total: 74.97
          }
        ],
        totalAmount: 74.97,
        subtotal: 74.97,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'SHIPPING',
        shippingAddress: {
          fullName: 'David Brown',
          phone: '+91 9876543214',
          addressLine1: '567 FC Road',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411004',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '69a72436f593ffecb8e050fa',
        orderNumber: 'ORD-2024-001239',
        customer: {
          _id: '69a6cb4386927cac2b08b255',
          name: 'Emily Davis',
          email: 'emily.d@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b268',
              title: 'Premium Denim Jacket',
              imageUrl: 'https://cloudinary.com/image7.jpg',
              price: 99.99
            },
            quantity: 1,
            total: 99.99
          }
        ],
        totalAmount: 99.99,
        subtotal: 99.99,
        tax: 0,
        shipping: 0,
        paymentStatus: 'FAILED',
        paymentMethod: 'stripe',
        orderStatus: 'FAILED',
        shippingAddress: {
          fullName: 'Emily Davis',
          phone: '+91 9876543215',
          addressLine1: '890 Connaught Place',
          city: 'Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India'
        },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '69a72436f593ffecb8e050fb',
        orderNumber: 'ORD-2024-001240',
        customer: {
          _id: '69a6cb4386927cac2b08b256',
          name: 'Robert Wilson',
          email: 'robert.w@example.com'
        },
        items: [
          {
            product: {
              _id: '69a6cbfc86927cac2b08b269',
              title: 'Vintage Band Tee',
              imageUrl: 'https://cloudinary.com/image8.jpg',
              price: 34.99
            },
            quantity: 2,
            total: 69.98
          },
          {
            product: {
              _id: '69a6cbfc86927cac2b08b270',
              title: 'Classic Cap',
              imageUrl: 'https://cloudinary.com/image9.jpg',
              price: 19.99
            },
            quantity: 1,
            total: 19.99
          }
        ],
        totalAmount: 89.97,
        subtotal: 89.97,
        tax: 0,
        shipping: 0,
        paymentStatus: 'PAID',
        paymentMethod: 'stripe',
        orderStatus: 'ACCEPTED',
        shippingAddress: {
          fullName: 'Robert Wilson',
          phone: '+91 9876543216',
          addressLine1: '234 Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400020',
          country: 'India'
        },
        createdAt: new Date().toISOString(), // Today
        updatedAt: new Date().toISOString(),
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 1248,
      totalPages: 125
    }
  }
};

// ==================== LOW STOCK PRODUCTS ====================
export const mockLowStockProducts = {
  success: true,
  data: {
    threshold: 5,
    totalLowStock: 8,
    products: [
      {
        _id: '69a6cbfc86927cac2b08b270',
        title: 'Vintage Band T-Shirt',
        category: 'T-Shirts',
        price: 34.99,
        stockQuantity: 2,
        imageUrl: 'https://cloudinary.com/image5.jpg',
        sku: 'TSH-VIN-001'
      },
      {
        _id: '69a6cbfc86927cac2b08b271',
        title: 'Limited Edition Hoodie',
        category: 'Hoodies',
        price: 79.99,
        stockQuantity: 0,
        imageUrl: 'https://cloudinary.com/image6.jpg',
        sku: 'HOO-LIM-001'
      },
      {
        _id: '69a6cbfc86927cac2b08b272',
        title: 'Organic Cotton Tee',
        category: 'T-Shirts',
        price: 29.99,
        stockQuantity: 4,
        imageUrl: 'https://cloudinary.com/image7.jpg',
        sku: 'TSH-ORG-001'
      },
      {
        _id: '69a6cbfc86927cac2b08b273',
        title: 'Winter Fleece Jacket',
        category: 'Jackets',
        price: 99.99,
        stockQuantity: 3,
        imageUrl: 'https://cloudinary.com/image8.jpg',
        sku: 'JAC-WIN-001'
      }
    ]
  }
};

// ==================== CUSTOMERS ====================
export const mockCustomers = {
  success: true,
  data: {
    customers: [
      {
        _id: '69a6cb4386927cac2b08b250',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 9876543210',
        role: 'USER',
        isEmailVerified: true,
        totalOrders: 12,
        totalSpent: 1245.67,
        createdAt: '2024-01-15T08:30:00.000Z',
        lastOrderDate: '2024-03-03T10:30:00.000Z'
      },
      {
        _id: '69a6cb4386927cac2b08b251',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+91 9876543211',
        role: 'USER',
        isEmailVerified: true,
        totalOrders: 8,
        totalSpent: 876.45,
        createdAt: '2024-01-20T14:15:00.000Z',
        lastOrderDate: '2024-03-03T09:15:00.000Z'
      },
      {
        _id: '69a6cb4386927cac2b08b252',
        name: 'Mike Johnson',
        email: 'mike.j@example.com',
        phone: '+91 9876543212',
        role: 'USER',
        isEmailVerified: false,
        totalOrders: 3,
        totalSpent: 345.20,
        createdAt: '2024-02-10T11:00:00.000Z',
        lastOrderDate: '2024-03-02T16:45:00.000Z'
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 456,
      totalPages: 46
    }
  }
};

// ==================== INVENTORY OVERVIEW ====================
export const mockInventoryOverview = {
  success: true,
  data: {
    totalProducts: 156,
    totalStockValue: 45678.90,
    lowStockCount: 8,
    outOfStockCount: 3,
    inStockCount: 145,
    categories: [
      { name: 'T-Shirts', count: 45, stockValue: 12345.67 },
      { name: 'Hoodies', count: 32, stockValue: 15678.90 },
      { name: 'Jackets', count: 28, stockValue: 10234.56 },
      { name: 'Jeans', count: 35, stockValue: 7419.77 },
      { name: 'Accessories', count: 16, stockValue: 0 }
    ]
  }
};

// ==================== TOP PRODUCTS ====================
export const mockTopProducts = {
  success: true,
  data: {
    period: 'monthly',
    topProducts: [
      {
        _id: '69a6cbfc86927cac2b08b262',
        title: 'Premium Cotton T-Shirt',
        category: 'T-Shirts',
        imageUrl: 'https://cloudinary.com/image1.jpg',
        price: 29.99,
        unitsSold: 234,
        revenue: 6997.66
      },
      {
        _id: '69a6cbfc86927cac2b08b263',
        title: 'Graphic Print Hoodie',
        category: 'Hoodies',
        imageUrl: 'https://cloudinary.com/image2.jpg',
        price: 59.99,
        unitsSold: 156,
        revenue: 9358.44
      },
      {
        _id: '69a6cbfc86927cac2b08b264',
        title: 'Classic Denim Jacket',
        category: 'Jackets',
        imageUrl: 'https://cloudinary.com/image3.jpg',
        price: 89.99,
        unitsSold: 89,
        revenue: 8009.11
      }
    ]
  }
};

// ==================== STORE SETTINGS ====================
export const mockStoreSettings = {
  success: true,
  data: {
    storeName: 'ThreadCraft',
    storeEmail: 'support@threadcraft.com',
    storePhone: '+91 9876543210',
    address: {
      addressLine1: '123 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India'
    },
    currency: 'INR',
    taxRate: 18,
    shippingOptions: [
      { name: 'Standard', cost: 50, estimatedDays: '5-7' },
      { name: 'Express', cost: 100, estimatedDays: '2-3' }
    ],
    lowStockThreshold: 5,
    emailNotifications: {
      newOrder: true,
      lowStock: true,
      orderShipped: true
    }
  }
};

// Default export for easy import
export default {
  mockDashboardOverview,
  mockSalesTrends,
  mockOrderStatusDistribution,
  mockRecentOrders,
  mockLowStockProducts,
  mockCustomers,
  mockInventoryOverview,
  mockTopProducts,
  mockStoreSettings
};
