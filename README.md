# NFT Store

A simple Node.js API that fetches random PNG NFTs from Pinata IPFS metadata.

## Features

- 🎨 Fetches NFT metadata from Pinata IPFS
- 🖼️ Filters for PNG images only
- 🎲 Returns 5 random NFTs per request
- ⚡ Caching for better performance
- 🚀 Simple Express.js API

## Tech Stack

- **Backend**: Node.js, Express.js
- **File Storage**: IPFS (Pinata)
- **CORS**: Cross-origin resource sharing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nft-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Random NFTs
- `GET /api/random-nfts` - Get 5 random PNG NFTs from Pinata IPFS

### Health Check
- `GET /` - API status and version info

## Project Structure

```
nft-store/
├── src/
│   ├── utils/
│   │   └── nftFetcher.js    # Fetches and filters PNG NFTs from Pinata
│   └── server.js            # Main Express server
├── package.json
└── README.md
```

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (auto-restart)

## Example Response

```json
{
  "success": true,
  "count": 5,
  "nfts": [
    {
      "id": 20,
      "name": "Cat",
      "creator": "Noobisoft Gamers",
      "description": "This is a monkey",
      "imageUrl": "https://gateway.pinata.cloud/ipfs/...",
      "attributes": [...],
      "custom_fields": {...}
    }
    // ... 4 more random NFTs
  ]
}
```

## License

MIT License
