

const express = require('express');
const axios = require('axios');
const app = express();
const port = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  if (!urls) {
    console.log("if ");
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }
  else if(!Array.isArray(urls)){
    console.log("else if");
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }

  const mergedNumbers = [];

  async function numbersFetchandMerge(url) {
    console.log(url);
    try {
      const response = await axios.get(url, { timeout: 500 });

      if (response.status === 200) {
        const data = response.data;
        console.log("demo data: ",data);
        const numbers = data.numbers.filter((num) => typeof num === 'number');
        mergedNumbers.push(...numbers);
      }
    } catch (error) {
      // Error handling
      console.error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  // Fetch numbers from all the URLs
  await Promise.all(urls.map((url) => numbersFetchandMerge(url)));

  // Sorting in ascending order of numbers
  const uniqueNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

  res.json({ numbers: uniqueNumbers });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});