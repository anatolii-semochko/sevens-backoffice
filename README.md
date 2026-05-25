# Sevens Backoffice Platform

**Enterprise-grade administrative dashboard for blockchain token ecosystem management**

## Overview

The Sevens Backoffice serves as the comprehensive administrative control center for the [Sevens Platform](https://github.com/anatolii-semochko/sevens-platform) - a blockchain-based digital asset tokenization ecosystem. This sophisticated web application provides administrators with powerful tools to manage token operations, user activities, and platform economics across the entire Sevens infrastructure.

## System Architecture

### Role in Sevens Ecosystem

The Sevens Backoffice is the **administrative nerve center** that orchestrates three interconnected systems:

```
┌────────────────────────────────────────────┐
│         Sevens Ecosystem                   │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │     ️  BACKOFFICE                    │   │
│  │   Administrative Control            │   │
│  │   • Token Management                │   │
│  │   • Fee Configuration               │   │
│  │   • System Monitoring               │   │
│  │   • User Administration             │   │
│  └─────────────┬───────────────────────┘   │
│                │                           │
│      ┌─────────┴─────────┐                 │
│      │                   │                 │
│  ┌───▼────────────┐  ┌───▼───────────────┐ │
│  │   PLATFORM     │  │   ️  SMART         │ │
│  │ User Interface │  │  CONTRACTS        │ │
│  │ • Material     │  │ • Token Minting   │ │
│  │   Publishing   │  │ • Marketplace     │ │
│  │ • Trading      │  │ • Fee Collection  │ │
│  │ • Wallets      │  │ • Governance      │ │
│  └────────────────┘  └───────────────────┘ │
└────────────────────────────────────────────┘
```

## Key Features

### **Token Operations Management**
- **Transaction Monitoring**: Real-time tracking of token mint, burn, buy, and sell operations
- **Revenue Analytics**: Comprehensive income reporting with date range filtering
- **Fee Management**: Dynamic configuration of blockchain transaction fees
- **System Pause Controls**: Emergency system-wide operation suspension

### **Platform Administration**
- **User Management**: Role-based access control and user activity monitoring
- **Content Management**: Language support, categories, and help content administration
- **Tariff Configuration**: Flexible pricing models for platform operations

### **Business Intelligence**
- **Financial Reporting**: Detailed revenue tracking and transaction analytics
- **Operational Metrics**: System usage statistics and performance monitoring
- **Data Export**: Comprehensive reporting for business analysis

### **Security & Access Control**
- **JWT Authentication**: Secure admin access with token-based authentication
- **Role-Based Permissions**: Granular access control for different admin levels
- **Audit Trails**: Complete logging of administrative actions

## Technology Stack

### Backend Architecture
- **PHP 8.3** with **Symfony 7** framework
- **MySQL** database with Doctrine ORM
- **JWT Authentication** for secure admin access
- **RESTful API** design for frontend integration

### Frontend Technologies
- **React 18** with modern hooks architecture
- **Redux** for centralized state management
- **CoreUI** component library for admin interfaces
- **Real-time Updates** via WebSocket connections

### Infrastructure
- **Docker** containerization for consistent deployment
- **Nginx** web server with SSL termination
- **Multi-environment** support (development, production)

## Core Functionality

### Token Management Dashboard
```php
// Token operations monitoring
class TokenManageController extends BaseController
{
    #[Route('/token-management')]
    #[IsGranted('ROLE_ADMIN')]
    public function dashboard(): JsonResponse
    {
        // Real-time transaction monitoring
        // Fee collection analytics
        // System health checks
    }
}
```

### Financial Analytics
```javascript
// Revenue tracking and reporting
const TokenTransactions = () => {
  const [items, setItems] = useState([])
  const [incomeSum, setIncomeSum] = useState(0)
  const [filterParams, setFilterParams] = useState(null)

  // Date range filtering
  // Revenue calculations
  // Export functionality
}
```

## Integration with Smart Contracts

The backoffice directly interfaces with the [Sevens Smart Contracts](https://github.com/anatolii-semochko/sevens-smartcontracts) system to:

- **Monitor Token Operations**: Track all minting, burning, and trading activities
- **Configure Economics**: Update fee structures and operational parameters
- **Emergency Controls**: Pause/resume system operations when needed
- **Revenue Collection**: Monitor and analyze fee collection from token operations

## Screenshots & User Interface

### Administrative Dashboard

#### Token Operations Management
![Token Operations Control](docs/images/Token%20operations%20control%20and%20accounting.png)

*Real-time token transaction monitoring with comprehensive analytics including transaction types (Buy, Sell, Mint, Burn), revenue tracking, and detailed operation history. The dashboard provides complete visibility into blockchain operations with filtering capabilities and income reporting.*

#### Tariff Management System
![Tariffs Management](docs/images/Tarrifs%20management%20page.png)

*Dynamic fee configuration interface allowing administrators to set and monitor transaction fees across all token operations. Features historical tariff tracking, operator audit trails, and flexible percentage/fixed fee models.*

#### Fee Configuration Interface
![Edit Tariffs Form](docs/images/Edit%20tarifd%20form.png)

*Secure tariff editing interface with wallet integration for blockchain-based fee updates. Administrators can modify mint fees, sale fees, burn fees, and target wallet configurations with real-time wallet signature verification.*

### End-to-End Token Workflow Integration

#### Token Purchase Process
![Buy Permanent Token](docs/images/Buy%20Permanent%20Token.png)

*Integration with the main Sevens Platform showing the complete token purchase workflow. Displays token metadata, pricing information, sales history analytics, and wallet integration for secure transactions.*

#### Successful Transaction Completion
![Bought Permanent Token](docs/images/Bought%20Permanent%20Token.png)

*Post-purchase interface demonstrating successful token acquisition with download capabilities for associated digital materials. Shows complete transaction verification and blockchain integration.*

These screenshots demonstrate the sophisticated administrative capabilities of the Sevens Backoffice, from high-level transaction monitoring to granular fee management, all integrated seamlessly with blockchain operations and user-facing platform functionality.

## Quick Start

### Prerequisites
```bash
# Required software
Docker 24+                # Container runtime
Docker Compose 2.20+      # Multi-container orchestration
Node.js 20+               # Frontend asset compilation
PHP 8.3+                  # Backend runtime
MySQL 8+                  # Database server
```

### Installation

1. **Repository Setup**
   ```bash
   git clone https://github.com/anatolii-semochko/sevens-backoffice.git
   cd sevens-backoffice
   ```

2. **Environment Configuration**
   ```bash
   cp .env.dist .env
   # Configure database, JWT secrets, and service endpoints
   ```

3. **SSL Certificates** (Development)
   ```bash
   # Generate local development certificates
   mkcert example-backoffice.local "*.example-backoffice.local" localhost 127.0.0.1 ::1
   ```

4. **Development Startup**
   ```bash
   # Start all services
   make up

   # Install dependencies
   make composer-install
   make yarn-install

   # Database setup
   make migration-migrate

   # Build frontend assets
   make encore-dev
   ```

5. **Access the Application**
   - **Admin Interface**: https://example-backoffice.local:8090
   - **API Endpoints**: https://example-backoffice.local:8090/api

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin authentication
- `POST /api/auth/logout` - Session termination

### Token Management
- `GET /api/token-management/transactions` - Transaction history
- `GET /api/token-management/tariffs` - Current fee configuration
- `POST /api/token-management/update-tariffs` - Update fee structure
- `POST /api/token-management/pause` - Emergency system control

### Administration
- `GET /api/users` - User management
- `GET /api/categories` - Content categories
- `GET /api/languages` - Platform localization
- `POST /api/pages/generate` - Content generation

## Database Architecture

### Core Entities

**ManageTransaction**
- Token operation tracking (mint, burn, buy, sell)
- Revenue calculation and fee collection
- User association and timestamp logging

**ManageTariffHistory**
- Fee structure versioning
- Historical pricing analysis
- Administrative change tracking

**User & PlatformUser**
- Administrative user management
- Role-based access control
- Activity monitoring and authentication

## Security Features

### Administrative Access Control
- **JWT Token Authentication**: Secure session management
- **Role-Based Authorization**: Granular permission system
- **IP Restrictions**: Optional IP-based access control
- **Session Management**: Automatic timeout and security logging

### Data Protection
- **Input Validation**: Comprehensive sanitization of all inputs
- **CSRF Protection**: Cross-site request forgery prevention
- **SQL Injection Prevention**: Parameterized queries via Doctrine ORM
- **XSS Protection**: Output escaping and content security policies

### Operational Security
- **Audit Logging**: Complete administrative action tracking
- **Emergency Controls**: System-wide pause capabilities
- **Rate Limiting**: API abuse prevention
- **Secure Headers**: HTTPS enforcement and security headers

## Production Deployment

### Environment Setup
```bash
# Production environment variables
APP_ENV=prod
APP_SECRET=your-production-secret
DATABASE_URL=mysql://admin:secure-password@db-host:3306/sevens_backoffice
JWT_PASSPHRASE=production-jwt-secret

# External service integration
NODE_SERVER_BASE_URL=https://your-node-server/api
MAIN_SITE_URL=https://your-sevens-platform.com
```

### Deployment Steps
```bash
# Build production assets
yarn encore production

# Database migration
php bin/console doctrine:migrations:migrate --env=prod

# Clear caches
php bin/console cache:clear --env=prod

# Generate JWT keys
php bin/console lexik:jwt:generate-keypair --env=prod
```

## Performance Characteristics

### Optimizations
- **Database Indexing**: Optimized queries for transaction history
- **Caching Strategy**: Redis integration for session and data caching
- **Asset Optimization**: Webpack bundling and minification
- **CDN Integration**: Static asset delivery optimization

### Scalability
- **Horizontal Scaling**: Docker-based architecture supports load balancing
- **Database Optimization**: Connection pooling and query optimization
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Resource Monitoring**: Comprehensive performance metrics

## Development Standards

### Code Quality
- **PSR-12 Compliance**: PHP coding standards
- **TypeScript**: Type-safe frontend development
- **Unit Testing**: PHPUnit for backend testing
- **Integration Testing**: API endpoint validation

### Documentation
- **API Documentation**: OpenAPI/Swagger specifications
- **Code Comments**: Comprehensive inline documentation
- **Architecture Diagrams**: System design documentation
- **Deployment Guides**: Production setup instructions

## Business Impact

### Operational Efficiency
- **Automated Monitoring**: Reduces manual oversight requirements
- **Real-time Analytics**: Immediate visibility into system performance
- **Streamlined Administration**: Centralized control interface
- **Comprehensive Reporting**: Data-driven business decisions

### Revenue Management
- **Dynamic Fee Configuration**: Flexible pricing strategies
- **Revenue Tracking**: Detailed financial analytics
- **Cost Optimization**: Efficient resource utilization
- **Fraud Prevention**: Transaction monitoring and anomaly detection

## Integration Examples

### Smart Contract Fee Updates
```php
// Update token management fees
public function updateTariffs(Request $request): JsonResponse
{
    $tariffs = $this->tokenManagementTariffsService->updateTariffs(
        mintFee: $request->get('mint_fee'),
        saleFee: $request->get('sale_fee'),
        buyFee: $request->get('buy_fee'),
        burnFee: $request->get('burn_fee')
    );

    return $this->json($tariffs, groups: self::TARIFF_HISTORY_GROUPS);
}
```

### Real-time Transaction Monitoring
```javascript
// Live transaction dashboard
const TransactionMonitor = () => {
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await tokenManagementApi.getTransactions({
        page: currentPage,
        limit: pageSize,
        dateFrom: filterParams?.dateFrom,
        dateTo: filterParams?.dateTo
      });

      setItems(response.data);
      setIncomeSum(response.income_sum);
    };

    fetchTransactions();
  }, [currentPage, filterParams]);
};
```

## License & Contact

**License**: Educational and portfolio demonstration project

**Developer**: [Anatolii Semochko](https://linkedin.com/in/anatolii-semochko)
**GitHub**: [github.com/anatolii-semochko](https://github.com/anatolii-semochko)
**Email**: anatoliy.semochko@gmail.com

---

## Related Projects

- **[Sevens Platform](https://github.com/anatolii-semochko/sevens-platform)** - Main user-facing application for token creation and trading
- **[Sevens Smart Contracts](https://github.com/anatolii-semochko/sevens-smartcontracts)** - Solana blockchain smart contracts for token operations

**Built with**: PHP/Symfony, React/Redux, MySQL, Docker, Blockchain Integration
**Architecture**: Administrative control center for enterprise blockchain token ecosystem
**Security**: Enterprise-grade authentication, authorization, and audit capabilities