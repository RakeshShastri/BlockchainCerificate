const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// In-memory blockchain for simplicity
const blockchain = [];

function createBlock(studentName, course, grade) {
  const prevBlockHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : null;
  const data = `${studentName}-${course}-${grade}-${prevBlockHash || ''}`;
  const block = {
    studentName,
    course,
    grade,
    prevBlockHash,
    timestamp: new Date().toISOString()
  };
  block.hash = calculateBlockHash(data);
  return block;
}

function calculateBlockHash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

app.post('/create-certificate', async (req, res) => {
  const { studentName, course, grade } = req.body;

  // Create a block with the certificate details
  const block = createBlock(studentName, course, grade);

  // Simulate blockchain interaction
  // In a real scenario, you would store the block on the Sepolia blockchain
  // Here, we're just pushing to the in-memory array for simplicity
  blockchain.push(block);

  res.json({ success: true, message: 'Certificate created successfully', block });
});

app.get('/verify-certificate', (req, res) => {
  // In a real scenario, you would verify the certificate against Sepolia blockchain
  // Here, we're just checking against the in-memory blockchain for simplicity

  console.log(req.query);
  const blockHash = req.query.certificateHash;

  let isValid = false;

  console.log(blockHash);

  for (let i = 0; i < blockchain.length; i++) {
    const block = blockchain[i];
    console.log(block.hash);
    if (block.hash === blockHash) {
      isValid = true;
      break;
    }
  }

  if (isValid) {
    res.json({ success: true, message: 'Certificate is valid' });
  } else {
    res.json({ success: false, message: 'Certificate not found or invalid' });
  }
});

app.get('/get-certificate-info', (req, res) => {
    // Retrieve all information about a certificate given its hash
    const { blockHash } = req.query;
  
    const certificate = blockchain.find((block) => block.hash === blockHash);
  
    if (certificate) {
      res.json({ success: true, certificateDetails: certificate });
    } else {
      res.json({ success: false, message: 'Certificate not found' });
    }
  });

app.get('/get-blockchain', (req, res) => {
  // Return the in-memory blockchain
  res.json(blockchain);
});

// Serve the HTML page on the '/home' endpoint
app.use('/home', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
