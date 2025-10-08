🚀 Express.js Product API
A professional RESTful API for product management with full CRUD operations and authentication.

📋 Features
CRUD Operations - Create, read, update, delete products

Authentication - API key protection

Validation - Input validation middleware

Error Handling - Comprehensive error management

Search & Filter - Advanced query capabilities

Pagination - Efficient data browsing

Statistics - Product analytics

🛠️ Installation
bash
# Clone repository
git clone https://github.com/kimenjuivy/express-js-server-side-framework-kimenjuivy.git

# Navigate to project
cd express-js-server-side-framework-kimenjuivy

# Install dependencies
npm install

# Create environment file
echo "PORT=3000" > .env
echo "API_KEY=mysecretkey123" >> .env

# Start development server
npm run dev
🔑 Authentication
All API requests require this header:

http
x-api-key: mysecretkey123
📚 API Endpoints
Products
Method	Endpoint	Description
GET	/api/products	List all products
GET	/api/products/:id	Get single product
POST	/api/products	Create new product
PUT	/api/products/:id	Update product
DELETE	/api/products/:id	Delete product
Statistics
Method	Endpoint	Description
GET	/api/stats	Overall statistics
GET	/api/stats/category/:category	Category stats
🧪 Quick Testing
bash
# Test authentication
curl -H "x-api-key: mysecretkey123" http://localhost:3000/api/products

# Create a product
curl -X POST -H "x-api-key: mysecretkey123" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","description":"High-performance laptop","price":1200,"category":"electronics"}' \
  http://localhost:3000/api/products
📁 Project Structure
text
├── server.js          # Main server file
├── middleware/        # Custom middleware
├── routes/           # API route handlers
├── .env             # Environment variables
└── package.json     # Dependencies
Server runs at: http://localhost:3000

🎯 Assignment Coverage
✅ Express.js setup

✅ RESTful API routes

✅ Middleware implementation

✅ Error handling

✅ Advanced features

Ready to use! 🚀

