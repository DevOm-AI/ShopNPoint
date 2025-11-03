const axios = require('axios');
require('dotenv').config();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5000';

class MLServiceClient {
  constructor() {
    this.client = axios.create({
      baseURL: ML_SERVICE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Predict product recommendations
  async getRecommendations(userId, limit = 10) {
    try {
      const response = await this.client.post('/api/recommendations', {
        user_id: userId,
        limit: limit
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Recommendations error:', error.message);
      throw new Error('Failed to get recommendations');
    }
  }

  // Predict optimal token value for a product
  async predictTokenValue(productData) {
    try {
      const response = await this.client.post('/api/predict-tokens', productData);
      return response.data;
    } catch (error) {
      console.error('ML Service - Token prediction error:', error.message);
      throw new Error('Failed to predict token value');
    }
  }

  // Analyze user purchase patterns
  async analyzePurchasePattern(userId) {
    try {
      const response = await this.client.post('/api/analyze-pattern', {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Pattern analysis error:', error.message);
      throw new Error('Failed to analyze purchase pattern');
    }
  }

  // Price optimization
  async optimizePrice(productId, marketData) {
    try {
      const response = await this.client.post('/api/optimize-price', {
        product_id: productId,
        market_data: marketData
      });
      return response.data;
    } catch (error) {
      console.error('ML Service - Price optimization error:', error.message);
      throw new Error('Failed to optimize price');
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('ML Service - Health check failed:', error.message);
      return { status: 'unhealthy' };
    }
  }
}

module.exports = new MLServiceClient();