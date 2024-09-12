require('dotenv').config();

const axios = require('axios');

async function getMenu(){
    const placeId = '4e4a1510483b16676e3a760f';
    const url = `https://api.foursquare.com/v3/places/${placeId}/photos?classifications=menu`;
    
  
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `${process.env.FOURSQUARE_API_KEY}`
            }
        });
        console.log(response.data);
        return (response.data);
    } catch (error) {
        console.error(error);
        throw new Error('Menu was not found!');
    }
}

module.exports = { getMenu }