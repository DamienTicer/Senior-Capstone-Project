const axios = require('axios');

// Dummy API details (Replace with real credentials)
const AMAZON_TAG = 'yourtag-20';
const ITEM_IDS = ['B07XJ8C8F5', 'B09G9FPGTN'];  // Example ASINs

const fetchAmazonProducts = async () => {
  const response = await axios.post(
    'https://webservices.amazon.com/paapi5/getitems',
    {
      ItemIds: ITEM_IDS,
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'Images.Primary.Medium'
      ],
      PartnerTag: AMAZON_TAG,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.com'
    },
    {
      headers: {
        'Content-Type': 'application/json'
        // AWS Signature Header needed here in production
      }
    }
  );

  return response.data.ItemsResult.Items.map(item => ({
    name: item.ItemInfo.Title.DisplayValue,
    price: item.Offers.Listings[0].Price.Amount,
    discount_price: (item.Offers.Listings[0].Price.Amount * 0.9).toFixed(2),
    image_url: item.Images.Primary.Medium.URL
  }));
};

module.exports = fetchAmazonProducts;
