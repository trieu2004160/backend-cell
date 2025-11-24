const axios = require('axios');

async function testSearch() {
    try {
        // Assuming backend runs on port 5000 or similar. I need to check the port.
        // I'll assume 3000 or look for .env but I can't read .env easily if it's not in the list.
        // Let's try 3000 based on common practices or previous context if available.
        // Actually, I can check the frontend vite proxy or backend server file.
        // Let's assume http://localhost:3000/api/products based on typical setups.

        const response = await axios.get('http://127.0.0.1:3001/api/products', {
            params: {
                search: 'iphone',
                limit: 10
            }
        });

        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testSearch();
