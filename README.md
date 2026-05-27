# Sevens Backoffice Platform

**Enterprise-grade administrative dashboard for blockchain token ecosystem management**

## Overview

The Sevens Backoffice serves as the comprehensive administrative control center for the [Sevens Platform](https://github.com/anatolii-semochko/sevens-platform) - a blockchain-based digital asset tokenization ecosystem. This sophisticated web application provides administrators with powerful tools to manage token operations, user activities, and platform economics across the entire Sevens infrastructure.

## The Challenge

### Business Problem

Managing blockchain token economics across a multi-platform ecosystem presented critical operational challenges:

- **Dynamic Fee Management**: Traditional blockchain systems require contract redeployment for fee changes, creating operational bottlenecks and high costs
- **Multi-Platform Coordination**: Synchronizing administrative actions across web platform, mobile interfaces, and blockchain contracts without data inconsistencies
- **Security vs. Usability**: Implementing enterprise-grade security controls while maintaining intuitive administrative workflows
- **Audit Compliance**: Maintaining complete audit trails for financial operations in a decentralized environment
- **Real-time Operations**: Monitoring thousands of token transactions across multiple contract types with immediate visibility into revenue and system health

### Technical Challenges

**Blockchain Immutability vs. Flexibility**
- Smart contracts are immutable, but business requirements demand dynamic fee structures
- Solution required secure parameter updates without contract redeployment

**Multi-Signature Security Complexity**
- Traditional multi-sig wallets create UX friction for frequent administrative tasks
- Needed cryptographic security without sacrificing operational efficiency

**Cross-System State Synchronization**
- Three independent systems (Platform, Backoffice, Smart Contracts) must maintain consistent state
- Database transactions must align with blockchain state changes

**Performance Under Load**
- Real-time monitoring of high-frequency token operations
- Sub-second response times required for administrative dashboards
- Concurrent admin access without data conflicts

**Regulatory Requirements**
- Complete audit trails for all financial modifications
- Role-based access control with granular permissions
- Tamper-proof logging of administrative actions

## System Architecture

### Role in Sevens Ecosystem

The Sevens Backoffice is the **administrative nerve center** that orchestrates three interconnected systems:

```
┌─────────────────────────────────────────────┐
│              Sevens Ecosystem               │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │              BACKOFFICE               │  │
│  │        Administrative Control         │  │
│  │         • Token Management            │  │
│  │         • Fee Configuration           │  │
│  │         • System Monitoring           │  │
│  │         • User Administration         │  │
│  └──────────────────┬────────────────────┘  │
│                     │                       │
│           ┌─────────┴──────────┐            │
│           │                    │            │
│  ┌────────▼───────┐  ┌─────────▼─────────┐  │
│  │    PLATFORM    │  │       SMART       │  │
│  │ User Interface │  │     CONTRACTS     │  │
│  │ • Material     │  │ • Token Minting   │  │
│  │   Publishing   │  │ • Marketplace     │  │
│  │ • Trading      │  │ • Fee Collection  │  │
│  │ • Wallets      │  │ • Governance      │  │
│  └────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────┘
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
![Tariffs Management](docs/images/Tariffs%20management%20page.png)

*Dynamic fee configuration interface allowing administrators to set and monitor transaction fees across all token operations. Features historical tariff tracking, operator audit trails, and flexible percentage/fixed fee models.*

#### Fee Configuration Interface
![Edit Tariffs Form](docs/images/Edit%20tariffs%20form.png)

*Secure tariff editing interface with wallet integration for blockchain-based fee updates. Administrators can modify mint fees, sale fees, burn fees, and target wallet configurations with real-time wallet signature verification.*

#### Emergency System Control
![Stop All Operations](docs/images/Stop%20all%20operation.png)

*Emergency system control interface that provides administrators with the ability to temporarily halt all smart contract operations on tokens. This critical safety feature ensures system integrity during maintenance, security updates, or emergency situations by suspending all token-related blockchain transactions.*

### End-to-End Token Workflow Integration

#### Token Purchase Process
![Buy Permanent Token](docs/images/Buy%20Permanent%20Token.png)

*Integration with the main Sevens Platform showing the complete token purchase workflow. Displays token metadata, pricing information, sales history analytics, and wallet integration for secure transactions.*

#### Successful Transaction Completion
![Bought Permanent Token](docs/images/Bought%20Permanent%20Token.png)

*Post-purchase interface demonstrating successful token acquisition with download capabilities for associated digital materials. Shows complete transaction verification and blockchain integration.*

These screenshots demonstrate the sophisticated administrative capabilities of the Sevens Backoffice, from high-level transaction monitoring to granular fee management, all integrated seamlessly with blockchain operations and user-facing platform functionality.

## Technical Architecture & Workflow

### Tariff Management System Flow

The Sevens Backoffice implements a sophisticated multi-layer tariff management system that securely updates blockchain-based fee structures through a comprehensive validation and verification process.

#### System Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                 TARIFF MANAGEMENT ARCHITECTURE                │
└───────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    FRONTEND     │    │     BACKEND     │    │   BLOCKCHAIN    │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  React UI   │ │    │ │ PHP/Symfony │ │    │ │   Node.js   │ │
│ │ TariffForm  │◄├────┤►│  API Layer  │◄├────┤►│   Service   │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │   Wallet    │ │    │ │    MySQL    │ │    │ │   Solana    │ │
│ │  Connector  │ │    │ │   Database  │ │    │ │ Blockchain  │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                      │                      │
         │                      │                      │
         └──────── HTTPS ───────┼──── Internal API ────┘
                                │
                        ┌───────────────┐
                        │     SMART     │
                        │    CONTRACT   │
                        │ (Rust/Anchor) │
                        └───────────────┘
```

#### Workflow Process Flow

```
Phase 1: INPUT          Phase 2: GENERATION     Phase 3: SIGNATURE     Phase 4: EXECUTION
┌─────────────┐        ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   ADMIN     │        │    BACKEND      │     │     WALLET      │     │   BLOCKCHAIN    │
│             │        │                 │     │                 │     │                 │
│ 1. Fill     │   2.   │ 3. Create       │  4. │ 5. User Signs   │ 6.  │ 7. Verify &     │
│    Form  ───┼────────┤    Transaction ─┼─────┤    Transaction ─┼─────┤    Execute      │
│             │        │                 │     │                 │     │                 │
│ • Mint Fee  │        │ • Query State   │     │ • Phantom       │     │ • Authority     │
│ • Sale Fee  │        │ • Build TX      │     │ • Solflare      │     │   Check         │
│ • Buy Fee   │        │ • Store in DB   │     │ • Approve       │     │ • Update PDA    │
│ • Target $  │        │ • Return TX ID  │     │ • Sign          │     │ • Log History   │
└─────────────┘        └─────────────────┘     └─────────────────┘     └─────────────────┘
```

#### Security Verification Chain

```
┌─────────────────────────────────────────────────────────────────┐
│                         SECURITY LAYERS                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │
│   │   UI    │    │   API   │    │ NodeJS  │    │  Smart  │      │
│   │ Layer   │    │ Layer   │    │ Layer   │    │Contract │      │
│   └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘      │
│        │              │              │              │           │
│   ✓ Wallet       ✓ JWT Auth     ✓ TX Store    ✓ Authority       │
│     Connect        Admin Role     & Verify      Validation      │
│                                                                 │
│   ✓ Form         ✓ Signature    ✓ Blockchain  ✓ On-chain        │
│     Validation     Matching       Interface     State Update    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Complete Technical Flow

The tariff management process involves a sophisticated multi-phase workflow:

**Phase 1: User Input & Validation**
- Admin configures fees (mint, sale, buy, burn) and target wallet
- Wallet connection for authority verification

**Phase 2: Transaction Generation**
- Backoffice API requests unsigned transaction from NodeJS service
- NodeJS queries blockchain state and builds appropriate instructions
- Transaction serialized and stored with unique ID for verification

**Phase 3: Wallet Signature**
- User signs transaction in connected wallet (Phantom/Solflare)
- Client-side transaction serialization for secure transmission

**Phase 4: Verification & Execution**
- Backend verifies transaction integrity against stored data
- Signed transaction broadcast to Solana blockchain
- Smart contract validates authority and updates tariffs PDA
- Complete audit trail recorded in database

### Architecture Components

#### Frontend Layer (React/Redux)
```javascript
// TariffForm.js - Main workflow orchestrator
const handleSubmit = async (e) => {
  // Phase 2: Get transaction from backend
  const transactionData = await tokenManagementApi.getTariffTransaction({
    authorityPublicKey: wallet.publicKey.toString(),
    targetWallet: formData.targetWallet,
    mint, setSale, buy, burn, paused
  });

  // Phase 3: Sign with wallet
  const txSignature = await wallet.signTransaction(
    Transaction.from(deserializeTransaction(transactionData.transaction))
  );

  // Phase 4: Submit signed transaction
  await tokenManagementApi.postTariffTransaction({
    transactionId: transactionData.transactionId,
    txSignature: serializeTransaction(txSignature),
    // ... parameters for verification
  });
};
```

#### Backend API Layer (PHP/Symfony)
```php
// TokenManagementTariffsService.php
public function getTariffsTransaction(
    string $authorityPublicKey,
    string $targetWallet,
    float $mint, float $setSale, int $buy, float $burn, bool $paused
): array {
    $transaction = $this->nodeApi->getTariffTransaction(/*...*/);

    return [
        'transactionId' => $this->walletService->saveTransaction($transaction),
        'transaction' => $transaction,
    ];
}

public function postTransaction(/*...*/, string $transactionId, string $txSignature): void {
    // Critical security verification
    $this->walletService->matchTransactionSignature($transactionId, $txSignature);

    // Send to blockchain
    $this->nodeApi->sendSignedTransaction($txSignature);

    // Record in database
    $tariffHistory = new ManageTariffHistory();
    // ... set properties and persist
}
```

#### NodeJS Service Layer
```javascript
// tariffsService.js - Blockchain interface
async getSetTariffsTransaction(
    authorityPublicKey, targetWallet, mintSol, setSaleSol, buy, burnSol, paused
) {
    const authority = new PublicKey(authorityPublicKey);
    const tariffsPda = this.getTariffsPda();

    const tx = new Transaction();

    // Check if first time initialization needed
    const accountExists = await this.connection.getAccountInfo(tariffsPda);

    if (!accountExists) {
        // initialize() instruction
        const initIx = await this.program.methods.initialize(/*...*/).instruction();
        tx.add(initIx);
    } else {
        // update_tariffs() instruction
        const updateIx = await this.program.methods.updateTariffs(/*...*/).instruction();
        tx.add(updateIx);
    }

    // set_paused() instruction
    const setPausedIx = await this.program.methods.setPaused(paused).instruction();
    tx.add(setPausedIx);

    tx.feePayer = authority;
    tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

    return serializeTransaction(tx);
}
```

#### Smart Contract Layer (Rust/Anchor)
```rust
// Token Management Contract
#[program]
pub mod sevens_token_management {
    pub fn update_tariffs(
        ctx: Context<UpdateTariffs>,
        target_wallet: Pubkey,
        mint: u64,
        set_sale: u64,
        buy: u8,
        burn: u64,
    ) -> Result<()> {
        let tariffs = &mut ctx.accounts.tariffs;

        // Validate authority
        require!(
            ctx.accounts.authority.key() == tariffs.authority,
            ErrorCode::UnauthorizedAccess
        );

        // Update tariff values
        tariffs.target_wallet = target_wallet;
        tariffs.mint = mint;
        tariffs.set_sale = set_sale;
        tariffs.buy = buy;
        tariffs.burn = burn;

        Ok(())
    }

    pub fn set_paused(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
        let tariffs = &mut ctx.accounts.tariffs;
        tariffs.paused = paused;
        Ok(())
    }
}
```

### Detailed Technical Flow

```mermaid
sequenceDiagram
    participant UI as Backoffice UI<br/>(React)
    participant Wallet as Wallet Signer<br/>(Phantom/Solflare)
    participant API as Backoffice API<br/>(PHP/Symfony)
    participant NodeJS as Platform NodeJS<br/>(Node.js/Express)
    participant DB as Database<br/>(MySQL)
    participant BC as Blockchain<br/>(Solana)
    participant SC as Smart Contract<br/>(Token Management)

    Note over UI,SC: Phase 1: User Input & Validation
    UI->>UI: 1. Admin fills tariff form<br/>- Mint Fee (SOL)<br/>- Sale Fee (SOL)<br/>- Buy Fee (%)<br/>- Burn Fee (SOL)<br/>- Target Wallet<br/>- Paused Status

    UI->>Wallet: 2. Connect wallet for<br/>authority verification
    Wallet-->>UI: Wallet connected<br/>(Public Key)

    Note over UI,SC: Phase 2: Transaction Generation
    UI->>API: 3. POST /api/token-management/<br/>get-tariffs-transaction<br/>{authorityPublicKey, targetWallet,<br/>mint, setSale, buy, burn, paused}

    API->>NodeJS: 4. GET /tariffs/transaction<br/>Create unsigned transaction

    NodeJS->>BC: 5. Query current tariffs<br/>from blockchain PDA
    BC-->>NodeJS: Current tariffs data<br/>(or null if first time)

    NodeJS->>NodeJS: 6. Build transaction:<br/>- initialize() OR update_tariffs()<br/>- set_paused()<br/>- Calculate fees<br/>- Set blockhash & fee payer

    NodeJS->>NodeJS: 7. Serialize transaction<br/>Buffer.from(tx.serialize({<br/>requireAllSignatures: false}))

    NodeJS->>DB: 8. Save transaction for<br/>verification: INSERT INTO<br/>wallet_transactions
    DB-->>NodeJS: transactionId

    NodeJS-->>API: 9. Return {transaction, transactionId}
    API-->>UI: Transaction ready for signing

    Note over UI,SC: Phase 3: User Signature & Verification
    UI->>UI: 10. Deserialize transaction<br/>Transaction.from(Buffer)

    UI->>Wallet: 11. Request signature<br/>wallet.signTransaction(tx)
    Wallet->>Wallet: User approves in wallet
    Wallet-->>UI: Signed transaction

    UI->>UI: 12. Serialize signed tx<br/>Buffer.from(signedTx.serialize())

    Note over UI,SC: Phase 4: Verification & Execution
    UI->>API: 13. POST /api/token-management/<br/>post-tariffs-transaction<br/>{transactionId, txSignature,<br/>+ all original parameters}

    API->>API: 14. Verify transaction integrity<br/>WalletService::matchTransaction<br/>Signature(transactionId, signature)

    API->>DB: 15. SELECT * FROM wallet_transactions<br/>WHERE id = transactionId
    DB-->>API: Original transaction data

    API->>API: 16. Compare signatures<br/>ensure integrity

    API->>NodeJS: 17. POST /send-signed-transaction<br/>{txSignature}

    NodeJS->>BC: 18. Broadcast to blockchain<br/>connection.sendRawTransaction(signature)
    BC->>SC: 19. Execute smart contract:<br/>- Validate authority<br/>- Update tariffs PDA<br/>- Set operational status<br/>- Emit events

    SC-->>BC: Transaction confirmed
    BC-->>NodeJS: Transaction success
    NodeJS-->>API: Blockchain confirmation

    API->>DB: 20. Record in tariff history<br/>INSERT INTO manage_tariff_history<br/>{admin_user, target_wallet,<br/>mint, set_sale, buy, burn, paused}

    API-->>UI: 21. Success response
    UI->>UI: 22. Update UI & show success<br/>toast notification

    Note over UI,SC: Phase 5: UI State Refresh
    UI->>API: 23. GET /api/token-management/<br/>current-tariffs
    API->>NodeJS: 24. GET /tariffs<br/>(fetch from blockchain)
    NodeJS->>BC: 25. Query tariffs PDA
    BC-->>NodeJS: Updated tariffs
    NodeJS-->>API: Fresh tariff data
    API-->>UI: Updated tariffs displayed
```

### Security Features

#### Transaction Integrity Verification
- **Database Verification**: Original transaction stored and compared
- **Signature Matching**: Exact signature comparison prevents tampering
- **Authority Validation**: Smart contract validates signer authority
- **Parameter Consistency**: All parameters re-verified on submission

#### Multi-Layer Access Control
- **UI Level**: Wallet connection required
- **API Level**: JWT admin authentication required
- **Blockchain Level**: Authority signature validation
- **Smart Contract Level**: On-chain authority verification

#### State Consistency
- **Database Logging**: Complete audit trail in `manage_tariff_history`
- **Blockchain State**: Immutable record in tariffs PDA
- **UI Synchronization**: Real-time state refresh after updates
- **Error Handling**: Rollback on any failure point

### Database Schema

#### Tariff History Tracking
```sql
CREATE TABLE manage_tariff_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_user_id BIGINT NOT NULL,
    target_wallet VARCHAR(44) NOT NULL,
    mint DECIMAL(15,9) NOT NULL,
    set_sale DECIMAL(15,9) NOT NULL,
    buy TINYINT UNSIGNED NOT NULL,
    burn DECIMAL(15,9) NOT NULL,
    paused BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (admin_user_id) REFERENCES users(id)
);
```

#### Transaction Verification Storage
```sql
CREATE TABLE wallet_transactions (
    id VARCHAR(36) PRIMARY KEY,
    transaction_data LONGTEXT NOT NULL,
    signature VARCHAR(128) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

### Error Handling & Edge Cases

#### Frontend Validation
- **Wallet Connection**: Verify wallet is connected before proceeding
- **Input Validation**: Client-side validation for immediate feedback
- **Network Errors**: Graceful handling of API timeouts
- **Transaction Failures**: User-friendly error messages

#### Backend Validation
- **Parameter Validation**: Server-side validation of all inputs
- **Authority Verification**: Ensure signer has admin privileges
- **Transaction Expiry**: Time-limited transaction validity
- **Duplicate Prevention**: Prevent double-submission

#### Blockchain Integration
- **Network Issues**: Retry logic for blockchain communication
- **Insufficient Funds**: Clear error messages for fee payment
- **Program Errors**: Smart contract error handling and reporting
- **State Conflicts**: Handle concurrent modification attempts

### Performance Considerations

#### Optimization Strategies
- **Transaction Caching**: Store prepared transactions temporarily
- **Batch Operations**: Group multiple fee updates when possible
- **Connection Pooling**: Efficient blockchain connection management
- **Database Indexing**: Optimized queries for tariff history

#### Scalability Features
- **Async Processing**: Non-blocking transaction handling
- **Error Recovery**: Automatic retry mechanisms
- **Load Balancing**: Distributed API processing
- **Monitoring**: Comprehensive logging and metrics

This architecture ensures **cryptographic security**, **transaction integrity**, and **complete audit trails** while maintaining usability for administrative operations.

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

## Sevens Ecosystem

The Sevens platform consists of four interconnected projects that work together to provide a complete blockchain tokenization solution:

### **[Sevens Backoffice](https://github.com/anatolii-semochko/sevens-backoffice)**
*Administrative control center and revenue management platform*
- **Technology**: PHP/Symfony, React/Redux, MySQL, Docker
- **Purpose**: Administrative dashboard for token operations monitoring, fee configuration, user management, and financial analytics
- **Key Features**: Real-time transaction monitoring, emergency system controls, tariff management, comprehensive reporting

### **[Sevens Platform](https://github.com/anatolii-semochko/sevens-platform)**
*Main user-facing application for digital material tokenization and trading*
- **Technology**: PHP/Symfony, React/TypeScript, MySQL, AWS S3, Docker
- **Purpose**: Complete web platform for creating, managing, and trading blockchain tokens representing digital materials
- **Key Features**: Token creation & management, marketplace functionality, wallet integration, file storage & CDN

### **[Sevens Smart Contracts](https://github.com/anatolii-semochko/sevens-smartcontracts)**
*Enterprise-grade NFT marketplace infrastructure built on Solana*
- **Technology**: Rust, Anchor Framework, Solana blockchain
- **Purpose**: Dual-contract token ecosystem with hash-validated NFTs and built-in marketplace functionality
- **Key Features**: Hash-based uniqueness validation, dynamic fee collection, inter-contract communication, governance layer

### **[Sevens Wallet React](https://github.com/anatolii-semochko/custom-solana-wallet-react)**
*Custom Solana wallet interface library with extended functionality*
- **Technology**: React, TypeScript, Solana Web3.js, CryptoJS
- **Purpose**: Comprehensive React library for building custom wallet interfaces compatible with Phantom API
- **Key Features**: Multi-language support, encrypted storage, transaction validation, modular architecture

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        SEVENS ECOSYSTEM                          │
│                                                                  │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐  │
│  │   BACKOFFICE    │    │    PLATFORM     │    │   WALLET     │  │
│  │   (Admin)       │◄──►│  (User App)     │◄──►│  (Library)   │  │
│  │ • Fee Config    │    │ • Token Trading │    │ • UI Comps   │  │
│  │ • Monitoring    │    │ • Marketplace   │    │ • Security   │  │
│  │ • Analytics     │    │ • File Storage  │    │ • Multi-lang │  │
│  └─────────────────┘    └─────────────────┘    └──────────────┘  │
│           │                      │                     │         │
│           │                      │                     │         │
│           └──────────────────────┼─────────────────────┘         │
│                                  │                               │
│                  ┌───────────────▼───────────────┐               │
│                  │        SMART CONTRACTS        │               │
│                  │         (Blockchain)          │               │
│                  │     • Token Operations        │               │
│                  │     • Marketplace Logic       │               │
│                  │     • Fee Collection          │               │
│                  │     • Hash Validation         │               │
│                  └───────────────────────────────┘               │
└──────────────────────────────────────────────────────────────────┘
```

This integrated ecosystem provides a complete solution for blockchain-based digital asset tokenization, from smart contract infrastructure to user interfaces and administrative tools.

---

## License & Contact

**License**: Educational and portfolio demonstration project

**Developer**: [Anatolii Semochko](https://linkedin.com/in/anatolii-semochko)
**GitHub**: [github.com/anatolii-semochko](https://github.com/anatolii-semochko)
**Email**: anatoliy.semochko@gmail.com

**Built with**: PHP/Symfony, React/Redux, MySQL, Docker, Blockchain Integration
**Architecture**: Administrative control center for enterprise blockchain token ecosystem
**Security**: Enterprise-grade authentication, authorization, and audit capabilities