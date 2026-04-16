# NexusFlow Backend - Secure Authentication API

> **The Power Behind the Revolution** - Enterprise-grade authentication server powering the 3D NexusFlow experience with military-grade security and blazing performance.

## **Backend Architecture**

NexusFlow Backend is the **fortress** that secures the entire authentication ecosystem. Built with **Node.js** and **Express**, it delivers **lightning-fast API responses** while maintaining **bank-level security** standards.

## **Core Technologies**

### **Server Framework**
- **Express 5** - Ultra-fast minimalist web framework
- **Node.js** - High-performance JavaScript runtime
- **MongoDB** - Scalable NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication

### **Security Stack**
- **Passport.js** - Authentication middleware for Node
- **JWT** - JSON Web Tokens for stateless authentication
- **bcryptjs** - Secure password hashing (12 rounds)
- **Helmet.js** - Security headers and protections
- **express-rate-limit** - Brute force protection

### **OAuth Integration**
- **passport-google-oauth20** - Google OAuth 2.0 strategy
- **express-session** - Secure session management
- **dotenv** - Environment variable protection

## **API Endpoints**

### **Authentication Routes**
```
POST /api/auth/signup     # User registration
POST /api/auth/login      # User login
GET  /api/auth/google     # Initiate Google OAuth
GET  /api/auth/google/callback  # Handle OAuth response
GET  /api/auth/me         # Get current user profile (protected)
```

### **Task Management**
```
GET    /api/tasks         # Get all tasks (protected)
POST   /api/tasks         # Create new task (protected)
PUT    /api/tasks/:id     # Update task (protected)
DELETE /api/tasks/:id     # Delete task (protected)
```

## **Security Features**

### **Multi-Layer Protection**
- **OAuth 2.0** - Industry-standard social authentication
- **JWT Tokens** - Secure, stateless authentication with 1-hour expiry
- **Rate Limiting** - 50 requests per 15 minutes per IP
- **CORS Configuration** - Cross-origin resource sharing security
- **Input Validation** - Joi schema validation for all inputs
- **Password Security** - bcryptjs with 12-round hashing

### **Session Management**
- **Secure Cookies** - HTTP-only, secure cookie settings
- **Token Expiration** - Automatic token expiry handling
- **Session Store** - Memory-based session storage
- **Logout Protection** - Secure token invalidation

## **Database Schema**

### **User Model**
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (conditional - not required for OAuth),
  googleId: String (unique, sparse),
  avatar: String,
  provider: String (enum: ['local', 'google']),
  createdAt: Date (default: Date.now)
}
```

### **Task Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  completed: Boolean (default: false),
  dueDate: Date,
  userId: ObjectId (required, ref: 'User'),
  createdAt: Date (default: Date.now)
}
```

## **Environment Configuration**

### **Required Environment Variables**
```env
# Server Configuration
PORT=5000
CLIENT_ORIGIN=http://localhost:5173

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/nexusflow

# Security
JWT_SECRET=your-secure-64-byte-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### **Security Best Practices**
- Use **strong JWT secrets** (64+ characters)
- Enable **HTTPS** in production
- Set **secure cookies** in production
- Use **environment-specific** configurations
- Rotate **secrets regularly**

## **Performance Optimizations**

### **Database Performance**
- **MongoDB Indexing** - Optimized query performance
- **Connection Pooling** - Efficient database connections
- **Lean Queries** - Minimal data retrieval
- **Caching Ready** - Redis-compatible architecture

### **API Performance**
- **Async/Await** - Non-blocking I/O operations
- **Error Handling** - Comprehensive error management
- **Validation Middleware** - Input preprocessing
- **Compression** - Response size optimization

## **Middleware Stack**

```javascript
// Security & Performance
app.use(helmet())                    // Security headers
app.use(cors(options))               // CORS configuration
app.use(express.json())              // JSON parsing
app.use(expressSession(options))      // Session management
app.use(passport.initialize())       // Passport initialization
app.use(passport.session())          // Passport sessions
app.use(rateLimit(options))          // Rate limiting

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  // JWT verification logic
}
```

## **OAuth Flow Architecture**

### **Google OAuth Integration**
1. **Initiation**: `GET /api/auth/google`
2. **Redirect**: User authenticates with Google
3. **Callback**: `GET /api/auth/google/callback`
4. **Token Exchange**: Google tokens for JWT
5. **User Creation/Update**: Database operations
6. **Frontend Redirect**: JWT token passed to client

### **Security Considerations**
- **State Parameter** - CSRF protection
- **PKCE** - Code exchange proof key
- **Token Validation** - Google token verification
- **Scope Limitation** - Minimal requested permissions

## **Development Setup**

### **Prerequisites**
- Node.js 18+
- MongoDB Atlas or local MongoDB
- Google Cloud Console project

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd nexusflow/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your credentials
```

### **Development Server**
```bash
# Start development server
npm run dev

# Start production server
npm start
```

## **Testing Strategy**

### **Security Testing**
- **OAuth Flow Testing** - Complete authentication cycle
- **JWT Validation** - Token verification testing
- **Rate Limiting** - DDoS protection testing
- **Input Validation** - Malicious input testing

### **Performance Testing**
- **Load Testing** - Concurrent user handling
- **Database Performance** - Query optimization
- **Memory Usage** - Resource consumption
- **Response Times** - API latency testing

## **Deployment Considerations**

### **Production Environment**
- **HTTPS Required** - SSL/TLS certificates
- **Environment Variables** - Secure configuration
- **Database Security** - MongoDB Atlas security
- **Monitoring** - Error tracking and performance
- **Logging** - Comprehensive audit trails

### **Scaling Strategy**
- **Horizontal Scaling** - Multiple server instances
- **Database Scaling** - MongoDB sharding
- **CDN Integration** - Static asset delivery
- **Load Balancing** - Traffic distribution

## **Error Handling**

### **Comprehensive Error Management**
```javascript
// Authentication Errors
- Invalid credentials
- Token expiration
- OAuth failures
- User not found

// Validation Errors
- Input validation failures
- Schema violations
- Malformed requests

// System Errors
- Database connection issues
- External API failures
- Server errors
```

## **Monitoring & Analytics**

### **Key Metrics**
- **Authentication Success Rate**
- **API Response Times**
- **Error Rates**
- **User Activity Patterns**
- **Security Events**

### **Security Monitoring**
- **Failed Login Attempts**
- **Token Validation Failures**
- **OAuth Anomalies**
- **Rate Limit Triggers**

## **Contributing Guidelines**

### **Backend Contributions**
1. **Security First** - Always prioritize security
2. **Performance** - Optimize for speed and efficiency
3. **Testing** - Comprehensive test coverage
4. **Documentation** - Clear API documentation
5. **Code Quality** - Follow established patterns

### **Pull Request Process**
1. **Fork Repository**
2. **Create Feature Branch**
3. **Implement Changes**
4. **Add Tests**
5. **Update Documentation**
6. **Submit Pull Request**

---

## **The NexusFlow Promise**

Our backend isn't just code - it's a **security fortress** that protects user data while delivering **lightning-fast performance**. Every line is written with **security-first principles** and **performance optimization** in mind.

**Built to protect. Designed to perform.**

---

**NexusFlow Backend** - Where Security Meets Speed.

> *"Security is always excessive until it's not enough."* - Robbie Sinclair

**Engineered with precision, secured by design.**
