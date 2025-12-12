module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        'query',
        'error',
        'warn'
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
const __TURBOPACK__default__export__ = prisma;
}),
"[project]/src/modules/products/repository.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductRepository",
    ()=>ProductRepository,
    "productRepository",
    ()=>productRepository
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
class ProductRepository {
    async findAll(query) {
        const { page = 1, limit = 10, search, category, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const where = {
            ...search && {
                OR: [
                    {
                        name: {
                            contains: search
                        }
                    },
                    {
                        description: {
                            contains: search
                        }
                    },
                    {
                        barcode: {
                            contains: search
                        }
                    }
                ]
            },
            ...category && {
                category
            },
            ...isActive !== undefined && {
                isActive
            }
        };
        const [data, total] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.count({
                where
            })
        ]);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    async findById(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findUnique({
            where: {
                id
            }
        });
    }
    async findByBarcode(barcode) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findUnique({
            where: {
                barcode
            }
        });
    }
    async findActiveProducts(search) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findMany({
            where: {
                isActive: true,
                stock: {
                    gt: 0
                },
                ...search && {
                    OR: [
                        {
                            name: {
                                contains: search
                            }
                        },
                        {
                            barcode: {
                                contains: search
                            }
                        }
                    ]
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
    }
    async create(data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
                imageUrl: data.imageUrl,
                category: data.category,
                barcode: data.barcode,
                isActive: data.isActive ?? true
            }
        });
    }
    async update(id, data) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.update({
            where: {
                id
            },
            data
        });
    }
    async updateStock(id, quantity) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.update({
            where: {
                id
            },
            data: {
                stock: {
                    decrement: quantity
                }
            }
        });
    }
    async delete(id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.delete({
            where: {
                id
            }
        });
    }
    async getCategories() {
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findMany({
            select: {
                category: true
            },
            distinct: [
                'category'
            ],
            where: {
                category: {
                    not: null
                }
            }
        });
        return products.map((p)=>p.category).filter(Boolean);
    }
    async getLowStockProducts(threshold = 10) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].product.findMany({
            where: {
                isActive: true,
                stock: {
                    lte: threshold
                }
            },
            orderBy: {
                stock: 'asc'
            }
        });
    }
}
const productRepository = new ProductRepository();
}),
"[project]/src/modules/products/service.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductService",
    ()=>ProductService,
    "productService",
    ()=>productService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/repository.ts [app-route] (ecmascript)");
;
class ProductService {
    async getProducts(query) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findAll(query);
    }
    async getProductById(id) {
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findById(id);
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        return product;
    }
    async getProductByBarcode(barcode) {
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findByBarcode(barcode);
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        return product;
    }
    async getActiveProducts(search) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findActiveProducts(search);
    }
    async createProduct(data) {
        // Check if barcode already exists
        if (data.barcode) {
            const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findByBarcode(data.barcode);
            if (existingProduct) {
                throw new Error('Barcode sudah digunakan');
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].create(data);
    }
    async updateProduct(id, data) {
        // Check if product exists
        const existingProduct = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findById(id);
        if (!existingProduct) {
            throw new Error('Produk tidak ditemukan');
        }
        // Check if barcode already exists (excluding current product)
        if (data.barcode && data.barcode !== existingProduct.barcode) {
            const productWithBarcode = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findByBarcode(data.barcode);
            if (productWithBarcode) {
                throw new Error('Barcode sudah digunakan');
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].update(id, data);
    }
    async deleteProduct(id) {
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findById(id);
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].delete(id);
    }
    async getCategories() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].getCategories();
    }
    async getLowStockProducts(threshold) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].getLowStockProducts(threshold);
    }
    async updateStock(id, quantity) {
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].findById(id);
        if (!product) {
            throw new Error('Produk tidak ditemukan');
        }
        if (product.stock < quantity) {
            throw new Error('Stok tidak mencukupi');
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productRepository"].updateStock(id, quantity);
    }
}
const productService = new ProductService();
}),
"[project]/src/modules/products/dto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/src/modules/products/entity.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/src/modules/products/index.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$repository$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/repository.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$dto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/dto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$entity$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/entity.ts [app-route] (ecmascript)");
;
;
;
;
}),
"[project]/src/app/api/products/active/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/modules/products/index.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/modules/products/service.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || undefined;
        const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$modules$2f$products$2f$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["productService"].getActiveProducts(search);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(products);
    } catch (error) {
        console.error('Error fetching active products:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Gagal mengambil data produk'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f7f8674c._.js.map