const CID = [
  "bafybeibyfslaitpxikvyvlo7ruza6iq3auuz3hj3ciqqeemzb4qcrkvaue/metadata.json",
  "bafybeid5vhhz35zmsmpytsojrzsbsxjmfiuymjiooomulao4q6vb76nbwa/metadata.json",
  "bafybeieg3dpzjsseu5c62zvt7xi54kxc63tbgnw6zdj5qy2242j2ecde2u/metadata.json",
  "bafybeih6e3cq3qbuxbdrrhenolj3fxaqlazg6kq4lu67j7gi72deay6vy4/metadata.json",
  "bafybeib674v6puikaaomzywgssa6vlkjbhpmpvzy3d4my4njyfxviovcfy/metadata.json",
  "bafybeie5tojzeo2zqmitigytmnhyztmrllrhnvsq74zc2n3ielu3hcnqza/metadata.json",
  "bafybeicyhntm53c3zxajqir22iwo7nhewmkos3gzc5psr2xyhu335a63e4/metadata.json",
  "bafybeiahak2ohv4xplcw6i62be2fwe6eddh3475bhfjkbdutiyrp3dtcfq/metadata.json",
  "bafybeifze2wdhosgrffsl3dm3ardwqchhxskdghmvwzol62i2tvwhollyu/metadata.json",
  "bafybeihcyf6uiuyzypvmaojcwp3ng7uto22bjrj44z4pjayjwaitdn7zhy/metadata.json",
  "bafybeicoixl3blwncfj2ozw5t2bvospzfmymnkcbb7ht4pekkki3vq6hte/metadata.json",
  "bafybeifujjtobq7oxvp5qfgbjaswh5fctsom4pfmjuzxvgpykdozhgtcge/metadata.json",
  "bafybeianu73os327p2mpqxgj4rhhxyro66rt2aijnbawfqfx5qa27o43fy/metadata.json",
  "bafybeif3iiboogrwelxvfnemya4tu6ij3y7fd3cdnw6dcvwaxnwycrbnbu/metadata.json",
  "bafybeihttolmu7iea2ifjjeyhx4l5iz7vrrjhnl7rewo7jn2jmshet6fr4/metadata.json",
  "bafybeibwbpca4urb5lvc2ncbgf6mv3sldzntgorkw35jbivf7ramfnfeoy/metadata.json",
  "bafybeieyngbfkc7qu4qkfuxf27su4ct447bmbpamjyawql7k56eci55d5i/metadata.json",
  "bafybeieuyefg6fbnl5lrn3mlbqsix2w72xyrn3fdswx7k65iuq5xhe6xc4/metadata.json",
  "bafybeiavcio57ubhssj4jjy4htnmxwcvmhsvp6nbt5tp6hcsfauag6e3iq/metadata.json",
  "bafybeihz2j2q7wtomhkmqbe7zqfq6ubeshzjjwwjrkjww3vv7xsed7xlw4/metadata.json",
  "bafybeigvbxfeoesqo3likz2tvyrdjnrmazlpn5namfqcv52cvar35pd6nq/metadata.json",
  "bafybeibo23rpexqe7x2mpdufgt6imopo75ybb2f2bb7hrslc3ucpwkdxom/metadata.json",
];

// Cache for storing fetched NFT data
let nftCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch metadata from Pinata IPFS
 */
async function fetchMetadata(cid) {
  try {
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching metadata for ${cid}:`, error);
    return null;
  }
}

/**
 * Check if NFT image is PNG format
 */
function isPNGNFT(metadata) {
  if (!metadata || !metadata.image) return false;
  
  const imageUrl = metadata.image.toLowerCase();
  return imageUrl.includes('.png') || imageUrl.includes('png');
}

/**
 * Fetch all NFT metadata and filter for PNG files
 */
async function fetchAllNFTs() {
  const currentTime = Date.now();
  
  // Return cached data if still valid
  if (nftCache && (currentTime - lastFetchTime) < CACHE_DURATION) {
    return nftCache;
  }

  console.log('Fetching NFT metadata from Pinata...');
  const allNFTs = [];
  
  // Fetch metadata for all CIDs
  const fetchPromises = CID.map(cid => fetchMetadata(cid));
  const results = await Promise.all(fetchPromises);
  
  // Filter for PNG NFTs only
  results.forEach((metadata, index) => {
    if (metadata && isPNGNFT(metadata)) {
      allNFTs.push({
        id: index + 1,
        cid: CID[index],
        ...metadata,
        imageUrl: `https://gateway.pinata.cloud/ipfs/${metadata.image.replace('ipfs://', '')}`
      });
    }
  });

  console.log(`Found ${allNFTs.length} PNG NFTs out of ${CID.length} total`);
  
  // Update cache
  nftCache = allNFTs;
  lastFetchTime = currentTime;
  
  return allNFTs;
}

/**
 * Get random NFTs from the collection
 */
async function getRandomNFTs(count = 5) {
  const allNFTs = await fetchAllNFTs();
  
  if (allNFTs.length === 0) {
    throw new Error('No PNG NFTs found');
  }
  
  if (allNFTs.length <= count) {
    return allNFTs;
  }
  
  // Shuffle array and take first 'count' items
  const shuffled = [...allNFTs].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = {
  getRandomNFTs,
  fetchAllNFTs
};
