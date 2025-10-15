const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { getRandomNFTs } = require('./utils/nftFetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NFT Store API',
      version: '1.0.0',
      description: 'A simple API that fetches random PNG NFTs from Pinata IPFS',
      contact: {
        name: 'NFT Store API',
        email: 'contact@nftstore.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://nft-store.open-elements.cloud' 
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      }
    ]
  },
  apis: ['./src/server.js'] // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://nft-store.open-elements.cloud', 'https://*.open-elements.cloud']
    : true,
  credentials: true
}));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'NFT Store API Documentation'
}));

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Returns the API status and version information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "NFT Store API"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 status:
 *                   type: string
 *                   example: "running"
 */
app.get('/', (req, res) => {
  res.json({
    message: 'NFT Store API',
    version: '1.0.0',
    status: 'running'
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     NFT:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the NFT
 *           example: 20
 *         name:
 *           type: string
 *           description: Name of the NFT
 *           example: "Cat"
 *         creator:
 *           type: string
 *           description: Creator of the NFT
 *           example: "Noobisoft Gamers"
 *         description:
 *           type: string
 *           description: Description of the NFT
 *           example: "This is a monkey"
 *         imageUrl:
 *           type: string
 *           description: Direct URL to the NFT image
 *           example: "https://gateway.pinata.cloud/ipfs/..."
 *         attributes:
 *           type: array
 *           description: NFT attributes/traits
 *           items:
 *             type: object
 *             properties:
 *               trait_type:
 *                 type: string
 *               value:
 *                 type: string
 *         custom_fields:
 *           type: object
 *           description: Additional custom fields
 *     NFTResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         count:
 *           type: integer
 *           description: Number of NFTs returned
 *           example: 5
 *         nfts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NFT'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Failed to fetch NFTs"
 *         error:
 *           type: string
 *           example: "Error details"
 */

/**
 * @swagger
 * /api/random-nfts:
 *   get:
 *     summary: Get Random NFTs
 *     description: Fetches 5 random PNG NFTs from Pinata IPFS metadata
 *     tags: [NFTs]
 *     responses:
 *       200:
 *         description: Successfully retrieved random NFTs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NFTResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get('/api/random-nfts', async (req, res) => {
  try {
    const randomNFTs = await getRandomNFTs(5);
    res.json({
      success: true,
      count: randomNFTs.length,
      nfts: randomNFTs
    });
  } catch (error) {
    console.error('Error fetching random NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFTs',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NFT Store server running on port ${PORT}`);
});

module.exports = app;
