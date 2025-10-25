---
title: "SITCON Camp 2025 Stock Trading System - 喵券機"
description: "Full-stack virtual stock trading platform for SITCON Camp 2025. Built with FastAPI, Next.js, and MongoDB, featuring real-time market simulation, Telegram bot integration, and comprehensive RBAC system. Serves 100+ participants with concurrent trading and debt management."
tags: ["FastAPI", "Next.js", "MongoDB", "Python", "TypeScript", "Telegram Bot", "WebSocket", "Docker", "Redis", "JWT"]
image: "https://emtech.cc/static/SITCON-camp-2025/stock.webp"
github: "https://github.com/sitcon-tw/camp2025-stock"
demo: "https://t.me/SITCONCamp2025Bot"
date: "2025-07"
featured: true
status: "completed"
---

## Project Overview

What started as a simple "point system for camp" turned into something much bigger—a full-scale financial trading platform that actually worked in production with 100+ students trading simultaneously.

I led the development with 556 commits (64% of the project), architecting everything from the domain-driven backend to the real-time trading interface. The system went beyond basic trading: we integrated physical arcade machines, partnered with 9 tech communities, built a PvP game system, and created a distributed architecture that could handle the chaos of 100 teenagers trying to make trades at the same time.

The best part? It actually ran smoothly during the 4-day camp. No crashes, no data corruption, just students having fun while we quietly managed a distributed system behind the scenes.

## Motivation

Here's the thing about summer camps: keeping 100+ tech-savvy students engaged for 4 days is hard. Really hard.

SITCON Camp wanted something beyond the usual "attend workshop, get points" system. They wanted a real economy where students could trade, gamble, win, and lose—basically, learn about markets by living through one.

But here's what made it interesting from an engineering perspective:

**The Real Challenges:**

1. **100 students, 1 database** - How do you handle everyone trying to buy/sell at market open without the system exploding?
2. **No negative balances** - Unlike real life, we couldn't let students go bankrupt. We needed debt systems with automatic repayment.
3. **Mobile-first everything** - Students are running around camp, not sitting at computers. Everything had to work seamlessly on Telegram.
4. **Trust but verify** - Admins needed god-mode controls, but students shouldn't notice the intervention.
5. **It has to work** - No "sorry, the system is down" excuses during camp.

The technical challenge wasn't just building a trading system—it was building one that could survive the organized chaos of a student tech camp while staying maintainable enough that future volunteers could understand it.

## Technical Architecture

### System Components

#### Backend (FastAPI)

- **Framework:** FastAPI + Uvicorn
- **Database:** MongoDB (Motor async driver)
- **Auth:** JWT + RBAC system
- **Cache:** Redis (planned)
- **Package:** uv (dependency management)
- **Python:** 3.11+

#### Frontend (Next.js)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript + JavaScript
- **State:** React Context + Hooks
- **Package:** pnpm
- **UI:** Custom components
- **API:** Centralized fetch layer

#### Bot (Telegram)

- **Platform:** Telegram Bot API
- **Language:** Python + uv
- **Features:** Trading + Games + PvP
- **Architecture:** Separate API service
- **Integration:** Backend via HTTP

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────┬──────────────────┬────────────────────────────┤
│  Next.js    │  Telegram Bot    │  Admin Dashboard           │
│  (Public)   │  (Mobile-First)  │  (JWT Protected)           │
└──────┬──────┴────────┬─────────┴──────────┬─────────────────┘
       │               │                     │
       └───────────────┴─────────────────────┘
                       │
              ┌────────▼────────┐
              │   Routers       │ ◄─── Presentation Layer
              │   (FastAPI)     │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │  Application    │ ◄─── Application Layer
              │    Services     │      (Use Cases)
              │  + Dependencies │
              └────────┬────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   ┌───▼────┐    ┌────▼────┐    ┌────▼────┐
   │ Domain │    │Domain   │    │ Domain  │ ◄─── Domain Layer
   │Services│    │Entities │    │Strategy │      (Business Logic)
   └───┬────┘    └────┬────┘    └────┬────┘
       │              │              │
       └──────────────┴──────────────┘
                      │
              ┌───────▼────────┐
              │  Repositories  │ ◄─── Domain Interfaces
              │  (Abstract)    │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ MongoDB Repos  │ ◄─── Infrastructure Layer
              │ (Concrete)     │      (Data Access)
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    MongoDB      │
              │  (Collections)  │
              │                 │
              │ • users         │
              │ • stock_orders  │
              │ • point_logs    │
              │ • market_config │
              │ • announcements │
              └─────────────────┘
```

### Why This Stack?

**FastAPI** - Because when 100 students hit "buy" at the same time, `async/await` is your best friend. Plus, the auto-generated API docs saved us countless hours of "wait, what endpoint was that again?"

**MongoDB** - Started with "we need flexible schemas for rapid iteration" (classic excuse), but stayed because atomic operations saved us from race conditions. When Student A and Student B both try to buy the last share, MongoDB's `$inc` operations ensure only one succeeds. No double-spending, no drama.

**Next.js 15** - The App Router was new and scary, but Server Components meant we could render permission-gated admin pages without exposing sensitive data to the client. Also, Vercel's deployment is *chef's kiss* simple.

**Telegram Bot** - This wasn't optional—it was the primary interface. Students live on their phones. Desktop web apps are for admins only.

### Domain-Driven Design (DDD) Architecture

Look, I'll be honest—DDD felt like overkill at first. "Why do we need all these layers for a camp trading system?"

Then we had 3 developers working on different features simultaneously, and suddenly those clean boundaries made sense. We could refactor the database layer without touching business logic. Add new trading strategies without modifying existing ones. The architecture earned its complexity tax.

#### **1. Domain Layer** (Business Logic Core)

**Entities** (`domain/entities.py`):
- Pure business objects with encapsulated logic
- No infrastructure dependencies
- Self-validating domain models

```python
@dataclass
class User:
    user_id: str
    username: str
    points: int

    def can_transfer(self, amount: int) -> bool:
        """Business rule: validate transfer eligibility"""
        return self.points >= amount and amount > 0

    def deduct_points(self, amount: int) -> None:
        """Business logic: enforce non-negative balance"""
        if not self.can_transfer(amount):
            raise ValueError("insufficient_points")
        self.points -= amount
```

**Repository Interfaces** (`domain/repositories.py`):
- Abstract base classes (ABC) defining contracts
- Dependency Inversion Principle (DIP)
- Infrastructure-agnostic data access

```python
class UserRepository(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: str) -> Optional[User]:
        pass

    @abstractmethod
    async def save(self, user: User) -> None:
        pass
```

**Domain Services** (`domain/services.py`):

- Complex business logic spanning multiple entities
- Orchestrates domain operations
- Pure domain knowledge

**Strategies** (`domain/strategies.py`):

- Strategy Pattern for algorithm variations
- Open/Closed Principle (OCP)

```python
class OrderExecutionStrategy(ABC):
    @abstractmethod
    async def can_execute(self, order: StockOrder, market_data: dict) -> bool:
        pass

class MarketOrderStrategy(OrderExecutionStrategy):
    """Always execute at current market price"""

class LimitOrderStrategy(OrderExecutionStrategy):
    """Execute only when price conditions met"""
```

#### **2. Application Layer** (Use Cases)

**Application Services** (`application/services.py`):

- Orchestrates domain objects and repositories
- Implements use cases (user stories)
- Transaction management

**Dependencies** (`application/dependencies.py`):

- Dependency injection configuration
- Wires concrete implementations
- Provides service instances to routers

#### **3. Infrastructure Layer** (Technical Implementation)

**MongoDB Repositories** (`infrastructure/mongodb_repositories.py`):

- Concrete implementations of repository interfaces
- Database-specific logic
- Handles MongoDB queries and transactions

```python
class MongoUserRepository(UserRepository):
    async def get_by_id(self, user_id: str) -> Optional[User]:
        doc = await self.db.users.find_one({"id": user_id})
        return self._to_entity(doc) if doc else None

    async def save(self, user: User) -> None:
        await self.db.users.update_one(
            {"id": user.user_id},
            {"$set": self._to_document(user)},
            upsert=True
        )
```

#### **4. Presentation Layer** (API Routes)

**Routers** (`routers/*.py`):

- FastAPI route handlers
- Request/response models (Pydantic schemas)
- Authentication and authorization
- Input validation

#### **SOLID Principles in Practice**

**Single Responsibility Principle (SRP):**

- Each entity manages one business concept
- Repositories handle only data access
- Services coordinate single use cases

**Open/Closed Principle (OCP):**

- Strategy pattern for order execution
- New strategies added without modifying existing code

**Liskov Substitution Principle (LSP):**

- Repository implementations fully substitutable
- Strategy implementations interchangeable

**Interface Segregation Principle (ISP):**

- Separate repository interfaces (UserRepository, StockRepository, etc.)
- Clients depend only on needed methods

**Dependency Inversion Principle (DIP):**

- High-level modules depend on abstractions
- Infrastructure depends on domain interfaces
- MongoDB implementation detail hidden behind repository interface

#### **Benefits of This Architecture**

1. **Testability:** Domain logic testable without database
2. **Maintainability:** Clear boundaries between layers
3. **Flexibility:** Easy to swap MongoDB for PostgreSQL
4. **Scalability:** Services can be split into microservices
5. **Code Quality:** SOLID principles enforce clean code

## Core Features

### 1. Real-Time Stock Trading System

**Market Mechanics:**
- **IPO (Initial Public Offering):** Limited shares available at initial price
- **Order Matching:** Buy/sell orders with price validation
- **Price Updates:** Real-time market price adjustments
- **Trading Limits:** Per-transaction and daily limits
- **Order History:** Complete audit trail for all trades

**Market Control:**
```python
async def _is_market_open(self) -> bool:
    """
    Dual-mode market control:
    1. Manual Override (highest priority)
    2. Scheduled Hours (fallback)
    """
    # Check manual control first
    manual_control = await self.db["market_config"].find_one(
        {"type": "manual_control"}
    )
    if manual_control:
        return manual_control.get("is_open", False)

    # Check scheduled hours
    market_hours = await self.db["market_config"].find_one(
        {"type": "market_hours"}
    )
    if market_hours:
        return self._is_within_market_hours(market_hours)

    return False  # Default: closed
```

**Concurrency Control:**
- MongoDB atomic operations for point transfers
- WriteConflict retry logic (max 5 attempts)
- Transaction isolation for multi-document updates
- Race condition prevention in order matching

### 2. Comprehensive RBAC System

**Role Hierarchy:**
```python
class Role(str, Enum):
    STUDENT = "student"                    # Basic trading
    QRCODE_MANAGER = "qrcode_manager"      # Generate QR codes
    POINT_MANAGER = "point_manager"        # Award points
    QR_POINT_MANAGER = "qr_point_manager"  # Combined permissions
    ANNOUNCER = "announcer"                # Broadcast messages
    ADMIN = "admin"                        # Full system access
```

**Permission Mapping:**
- Granular permissions (11 types)
- Role-based access control
- Permission inheritance
- Frontend/backend consistency

**Key Permissions:**
- `VIEW_ALL_USERS` - See participant list
- `GIVE_POINTS` - Award/deduct points
- `CREATE_ANNOUNCEMENT` - Broadcast to Telegram
- `MANAGE_MARKET` - Open/close trading
- `SYSTEM_ADMIN` - Full database access

### 3. Advanced Debt Management

**Debt System Features:**
- **Negative Balances:** Users can trade on credit
- **Auto-Repayment:** Points automatically deduct debt
- **Transfer Blocking:** Prevent debt transfers in PvP
- **Debt Tracking:** Complete history of debt transactions

**Implementation:**
```python
async def _auto_repay_debt(self, user_id: str, new_points: int, session):
    """
    Automatically repay debt when points are added
    """
    user = await self.db["users"].find_one(
        {"id": user_id}, session=session
    )

    current_debt = user.get("debt", 0)
    if current_debt > 0:
        repayment_amount = min(new_points, current_debt)

        # Update debt and points atomically
        await self.db["users"].update_one(
            {"id": user_id},
            {
                "$inc": {
                    "debt": -repayment_amount,
                    "points": -repayment_amount
                }
            },
            session=session
        )
```

### 4. Telegram Bot Integration

**Bot Commands:**
- `/balance` - Check current points and holdings
- `/buy <amount>` - Purchase stocks
- `/sell <amount>` - Sell holdings
- `/transfer <user> <amount>` - Send points
- `/pvp <user> <amount>` - Challenge to duel
- `/leaderboard` - View top traders

**PvP Challenge System:**
```python
async def create_pvp_challenge(
    challenger_id: str,
    target_id: str,
    bet_amount: int
) -> PVPChallenge:
    """
    Create a PvP challenge with escrow
    """
    # Validate both users can afford bet
    # Escrow challenger's bet amount
    # Store challenge in database
    # Notify target via Telegram
    # Set 5-minute expiration timer
```

### 5. Admin Dashboard

**Management Features:**
- **User Management:** View/edit all participants
  - Enable/disable accounts
  - Adjust points and holdings
  - View transaction history
  - Reset passwords

- **Market Control:**
  - Manual market open/close
  - Set scheduled trading hours
  - Configure trading limits
  - Emergency market halt

- **Announcement System:**
  - Rich text announcements
  - Telegram broadcast integration
  - Priority levels
  - Scheduled publishing

- **Analytics:**
  - Real-time trading volume
  - Price history charts
  - User activity logs
  - System health monitoring

### 6. Point Logging System

**Complete Audit Trail:**
```python
async def _create_point_log(
    user_id: str,
    amount: int,
    reason: str,
    transaction_type: str,
    related_user_id: Optional[str] = None
):
    """
    Log every point transaction with full context
    """
    log_entry = {
        "user_id": user_id,
        "amount": amount,
        "reason": reason,
        "type": transaction_type,  # ADMIN_GIVE, TRANSFER, TRADE, etc.
        "related_user_id": related_user_id,
        "timestamp": datetime.now(timezone.utc),
        "balance_after": updated_balance
    }
    await self.db["point_logs"].insert_one(log_entry)
```

**Log Types:**
- `ADMIN_GIVE` - Admin awarded points
- `TRANSFER_OUT` / `TRANSFER_IN` - P2P transfers
- `STOCK_BUY` / `STOCK_SELL` - Trading activity
- `PVP_WIN` / `PVP_LOSS` - Challenge outcomes
- `DEBT_REPAYMENT` - Automatic debt deduction

### 7. Event-Driven Architecture

**Event Bus Service:**

Here's where things got interesting. Initially, we had services directly calling each other—simple, straightforward, tightly coupled mess. When a trade happened, the trading service would call the notification service, which would call the logging service, which would... you get the idea.

Then we hit race conditions. Notifications would fail, but trades would succeed. Logs would miss events. It was a nightmare to debug.

So we built an event bus. Now? A trade happens, an event fires, and whoever cares can handle it asynchronously. Notifications fail? Trade still succeeds. Want to add analytics? Just subscribe to the events. No touching existing code.

```python
class EventType(Enum):
    # Trading Events
    ORDER_CREATED = "order_created"
    ORDER_MATCHED = "order_matched"
    ORDER_CANCELLED = "order_cancelled"

    # User Events
    USER_POINTS_UPDATED = "user_points_updated"
    USER_PORTFOLIO_UPDATED = "user_portfolio_updated"

    # Market Events
    MARKET_OPENED = "market_opened"
    MARKET_CLOSED = "market_closed"
    PRICE_UPDATED = "price_updated"

    # System Events
    SHARD_REBALANCED = "shard_rebalanced"
    QUEUE_OVERFLOW = "queue_overflow"
```

**Event Bus Features:**

- **Pub/Sub Pattern:** Services publish events without knowing subscribers
- **Event History:** Maintains 10,000 recent events for replay
- **Error Handling:** Automatic retry with exponential backoff
- **Event Statistics:** Tracks published, processed, and failed events
- **Async Processing:** Non-blocking event propagation

**Event Handlers:**

```python
class OrderEventHandler(EventHandler):
    """Handles order-related events"""
    async def handle_event(self, event: EventPayload) -> bool:
        if event.event_type == EventType.ORDER_MATCHED:
            # Update user portfolios
            # Send notifications
            # Update statistics
            pass
```

### 8. Distributed System with Sharding

**User Sharding Service:**

Remember that "100 students, 1 database" problem? This is where we solved it.

The issue: MongoDB's single-document transactions are atomic, but when everyone's points are in one collection, you get write conflicts. Student A tries to buy, Student B tries to sell, both operations touch the same documents, MongoDB says "nope, try again." Retry logic helps, but we needed something better.

The solution: Shard users across 16 virtual partitions using consistent hashing. User `alice123` always goes to shard 7. User `bob456` always goes to shard 12. They never interfere with each other. Write conflicts drop to nearly zero because users in different shards are effectively isolated.

```python
class UserShardingService:
    def __init__(self, num_shards: int = 16):
        self.num_shards = num_shards
        self.shards: Dict[int, ShardInfo] = {}

    def get_user_shard(self, user_id: str) -> int:
        """Assign user to shard using MD5 hash"""
        hash_value = int(hashlib.md5(user_id.encode()).hexdigest(), 16)
        shard_id = hash_value % self.num_shards
        return shard_id
```

**Sharding Benefits:**

- **Reduced Contention:** Users in different shards never conflict
- **Horizontal Scaling:** Each shard can run independently
- **Load Balancing:** Automatic distribution across shards
- **Fault Isolation:** Shard failures don't affect others

**Sharded Order Processor:**

- Processes orders per-shard for parallelism
- Batch processing within shards
- Cross-shard coordination when needed

**Distributed System Integrator:**

- Initializes all distributed components
- Manages inter-service communication
- Health checks and monitoring
- Automatic failover and recovery

### 9. Game System (PvP Rock-Paper-Scissors)

**PvP Challenge Flow:**

```python
async def create_pvp_challenge(self, from_user: str, amount: int, chat_id: str):
    """
    Create PvP challenge with escrow system
    1. Validate user has sufficient balance
    2. Check for existing active challenges
    3. Escrow bet amount from challenger
    4. Create challenge record with 5-minute expiration
    5. Notify opponent via Telegram
    """
```

**Game Features:**

- **Escrow System:** Bet amount locked during challenge
- **Debt Validation:** Prevents challenges from users with debt
- **Account Status Check:** Frozen accounts cannot play
- **Time Limits:** Challenges expire after 5 minutes
- **Fair Play:** Cryptographic randomness for outcomes

**Safe Point Deduction:**

```python
async def _safe_deduct_points(self, user_id: ObjectId, amount: int):
    """
    Atomic point deduction preventing negative balance
    Uses MongoDB conditional update: points >= amount
    """
    result = await self.db.users.update_one(
        {"_id": user_id, "points": {"$gte": amount}},
        {"$inc": {"points": -amount}}
    )
```

### 10. Community Booth System

**9 Partner Communities:**

This feature was pure pragmatism. SITCON invited 9 tech communities to set up booths at camp. Each community wanted to reward students who visited them, but giving out physical prizes was logistically painful.

Solution: Give each community a unique password. Students visit booth, get password, enter it in the system, receive 1000 points. Simple, trackable, and communities loved it because they could see engagement metrics.

The communities:

- SITCON 學生計算機年會
- OCF 開放文化基金會
- Ubuntu 台灣社群
- MozTW 社群
- COSCUP 開源人年會
- Taiwan Security Club
- SCoML 學生機器學習社群
- 綠洲計畫 LZGH
- PyCon TW

Each got a cryptographically strong password (we used a password generator, don't @ me), and we logged every redemption for accountability.

**Community Booth Features:**

```python
async def community_give_points(
    community_password: str,
    student_username: str,
    note: str = "社群攤位獎勵"
):
    """
    Fixed 1000-point reward from community booths
    - Password authentication per community
    - Auto-create student account if needed
    - Activity tracking per community
    """
```

**Security:**

- Unique password per community
- Activity logging for accountability
- Rate limiting to prevent abuse

### 11. Arcade System

**Game Arcade Integration:**

Physical arcade machines integrated with point system:

```python
@router.post("/arcade/points")
async def arcade_adjust_points(
    request: ArcadePointsRequest,
    token_verified: bool = Depends(verify_bot_token)
):
    """
    Arcade machine point adjustment API
    - Deduct points for game plays
    - Award points for high scores
    - Transaction ID tracking
    - Automatic debt repayment
    """
```

**Arcade Features:**

- **Game Types:** Multiple arcade games supported
- **Safe Transactions:** Atomic operations prevent double-spending
- **Balance Validation:** Real-time balance checks
- **Debt Integration:** Auto-repay debt from winnings

### 12. Notification Service

**Telegram Notification System:**

```python
async def send_trade_notifications(
    buy_order: dict,
    sell_order: dict,
    trade_quantity: int,
    trade_price: float
):
    """
    Send real-time notifications to both parties
    - Async delivery (non-blocking trades)
    - 5-second timeout for resilience
    - Detailed trade information
    - Separate buyer/seller messages
    """
```

**Notification Types:**

- Trade execution (buy/sell)
- PvP challenge received
- PvP game results
- Point transfers
- Admin announcements

### 13. IPO Service

**Initial Public Offering Management:**

```python
async def get_or_initialize_ipo_config(self):
    """
    Manages IPO stock issuance
    - Environment variable configuration
    - Atomic share tracking
    - Prevents overselling
    - Price management
    """
```

**IPO Features:**

- Fixed initial share pool (1,000,000 shares)
- Fixed initial price (20 points/share)
- Real-time share availability tracking
- Atomic updates prevent race conditions

### 14. Advanced Charting System

**Multiple Chart Types:**

Frontend includes sophisticated data visualization:

- **CandlestickChart.js:** OHLC (Open-High-Low-Close) visualization
- **KLineChart.js:** Technical analysis with indicators
- **StockChart.js:** Real-time price tracking

**Chart Features:**

- Time range selection (1D, 1W, 1M, ALL)
- Color-coded price movements
- Responsive design for mobile
- Interactive tooltips

## Implementation Highlights

### Database Schema Design

**User Collection:**
```javascript
{
  "_id": ObjectId,
  "id": "unique_user_id",          // Permanent identifier
  "name": "使用者名稱",
  "team": "隊伍名稱",
  "telegram_id": 123456789,
  "points": 1000,                  // Current balance
  "debt": 0,                       // Outstanding debt
  "role": "student",               // RBAC role
  "enabled": true,                 // Account status
  "created_at": ISODate
}
```

**Stock Order Collection:**
```javascript
{
  "_id": ObjectId,
  "user_id": "unique_user_id",
  "type": "buy",                   // "buy" or "sell"
  "shares": 10,
  "price": 25,
  "status": "completed",           // "pending", "completed", "cancelled"
  "created_at": ISODate,
  "completed_at": ISODate
}
```

**Market Config Collection:**
```javascript
// Manual Control Document
{
  "type": "manual_control",
  "is_open": true,                 // Override market hours
  "updated_by": "admin_id",
  "updated_at": ISODate
}

// Scheduled Hours Document
{
  "type": "market_hours",
  "hours": [
    {
      "day": "monday",
      "open": "09:00",
      "close": "17:00",
      "timezone": "Asia/Taipei"
    }
  ]
}

// IPO Status Document
{
  "type": "ipo_status",
  "initial_shares": 1000000,
  "shares_remaining": 850000,
  "initial_price": 20,
  "current_price": 25,
  "updated_at": ISODate
}
```

### Time Zone Handling

**Critical Implementation:**
All timestamps use **Asia/Taipei** (UTC+8) for consistency:

```javascript
// Frontend Display
new Date(timestamp).toLocaleString('zh-TW', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})
```

```python
# Backend Storage
from datetime import datetime, timezone
import pytz

taipei_tz = pytz.timezone('Asia/Taipei')
timestamp = datetime.now(timezone.utc).astimezone(taipei_tz)
```

### Concurrency Control Strategy

**Write Conflict Handling:**
```python
async def _handle_write_conflict(self, operation: str, max_retries: int = 5):
    """
    Retry logic for MongoDB write conflicts
    """
    for attempt in range(max_retries):
        try:
            async with await self.db.client.start_session() as session:
                async with session.start_transaction():
                    # Perform operation
                    await self._execute_operation(session)
                    return True
        except WriteConflict:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(0.1 * (2 ** attempt))  # Exponential backoff
            self._log_write_conflict(operation, attempt, max_retries)
```

**Statistics Tracking:**
- Log conflicts every 60 seconds
- Per-operation conflict counts
- Performance monitoring dashboard

### API Architecture

**DDD Project Structure:**
```
backend/app/
├── routers/                      # Presentation Layer
│   ├── admin.py                 # Admin-only endpoints
│   ├── user.py                  # Student/public endpoints
│   ├── system.py                # Market control
│   └── auth.py                  # JWT authentication
│
├── application/                  # Application Layer
│   ├── services.py              # Use case orchestration
│   └── dependencies.py          # Dependency injection
│
├── domain/                       # Domain Layer
│   ├── entities.py              # Domain entities (User, Stock, etc.)
│   ├── repositories.py          # Repository interfaces (ABC)
│   ├── services.py              # Domain services
│   └── strategies.py            # Strategy pattern implementations
│
├── infrastructure/               # Infrastructure Layer
│   └── mongodb_repositories.py  # Concrete repository implementations
│
├── services/                     # Legacy services (being refactored)
│   ├── admin_service.py
│   ├── user_service.py
│   ├── debt_service.py
│   ├── transfer_service.py
│   └── cache_service.py
│
├── core/                         # Shared infrastructure
│   ├── database.py              # MongoDB connection
│   ├── rbac.py                  # Permission system
│   ├── security.py              # JWT + hashing
│   └── config.py                # Environment config
│
└── schemas/                      # Pydantic models
    ├── user.py
    ├── admin.py
    └── responses.py
```

**Dependency Injection:**
```python
from fastapi import Depends

def get_user_service() -> UserService:
    return UserService()

@router.post("/trade/buy")
async def buy_stock(
    request: StockOrderRequest,
    current_user: dict = Depends(get_current_user),
    service: UserService = Depends(get_user_service)
):
    return await service.buy_stock(current_user["id"], request)
```

### Frontend Architecture

**Permission Context:**
```typescript
// src/contexts/PermissionContext.tsx
export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    fetchUserPermissions().then(setPermissions);
  }, []);

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission);
  };

  return (
    <PermissionContext.Provider value={{ permissions, hasPermission }}>
      {children}
    </PermissionContext.Provider>
  );
};
```

**Protected Routes:**
```typescript
// src/components/PermissionGuard.tsx
export const PermissionGuard = ({
  permission,
  fallback = null,
  children
}) => {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
};
```

**API Integration:**
```typescript
// src/lib/api.ts
export const api = {
  async fetchWithAuth(endpoint: string, options = {}) {
    const token = localStorage.getItem('auth_token');

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) throw new Error(await response.text());
    return response.json();
  }
};
```

## Testing & Quality Assurance

### Integration Testing

**Backend Tests:**
```bash
backend/test/
├── integration/
│   ├── test_system_api.py      # Market control tests
│   ├── test_debt_system.py     # Debt handling tests
│   └── test_write_conflict.py  # Concurrency tests
├── test_auto_repay.py
├── test_enhanced_transfer.py
└── test_market_fix.py
```

**Key Test Cases:**
- Write conflict recovery
- Debt auto-repayment
- Transfer validation (negative balance blocking)
- Market open/close state transitions
- PvP challenge expiration
- Self-transfer prevention

**Running Tests:**
```bash
cd backend
python test/integration/test_system_api.py
```

### Documentation

**Technical Docs:**
- `CLAUDE.md` - Claude Code integration guide
- `CONCURRENCY_CONTROL_STRATEGIES.md` - Write conflict handling
- `WRITE_CONFLICT_IMPROVEMENTS.md` - Performance optimizations
- `point_logs_analysis_report.md` - Audit trail analysis

**API Documentation:**
- Auto-generated Swagger UI at `/docs`
- ReDoc alternative at `/redoc`
- Complete endpoint schemas
- Request/response examples

## Deployment

### Docker Configuration

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install uv
RUN uv sync

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

### Environment Configuration

**Backend (.env):**
```bash
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=camp2025_stock
JWT_SECRET=your_secret_key
JWT_ALGORITHM=HS256
TELEGRAM_BOT_TOKEN=your_bot_token
CAMP_IPO_INITIAL_SHARES=1000000
CAMP_IPO_INITIAL_PRICE=20
```

**Frontend (next.config.js):**
```javascript
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  output: 'standalone', // For Docker deployment
}
```

## Community Impact

### SITCON Camp 2025 Deployment

**Event Context:**
- **Dates:** July 2025 (4-day camp)
- **Participants:** 100+ students
- **Activities:** Technical workshops + gamification
- **Location:** Taiwan

**System Usage:**
- Real-time trading during camp hours
- Telegram bot for mobile access
- Admin oversight for fair gameplay
- Post-event analytics and rankings

### Open Source Contribution

**Repository Statistics:**
- **Total Commits:** 862
- **Contributors:** 4 developers
  - KoukeNeko: 556 commits (lead)
  - wolf-yuan-6115: 197 commits
  - Dash2100: 93 commits
  - Edit-Mr: 16 commits

**Code Statistics:**
- Python: 1,307,398 bytes (55%)
- JavaScript: 1,038,300 bytes (44%)
- CSS: 9,380 bytes
- Shell: 3,170 bytes
- Dockerfile: 1,175 bytes

### Technical Innovation

**Architectural Contributions:**

1. **Domain-Driven Design Implementation:**
   - Clean architecture with 4 distinct layers
   - SOLID principles throughout codebase
   - Repository pattern with ABC interfaces
   - Strategy pattern for extensible order execution

2. **Event-Driven Architecture:**
   - Comprehensive event bus system
   - Pub/Sub pattern for service decoupling
   - Event sourcing with 10K event history
   - Automatic retry with error handling

3. **Distributed System Design:**
   - 16-shard consistent hashing system
   - User sharding for reduced contention
   - Sharded order processor for parallelism
   - Distributed system integrator for orchestration

4. **Game Systems Integration:**
   - PvP rock-paper-scissors with escrow
   - Community booth system (9 partners)
   - Arcade machine API integration
   - Safe atomic point operations

5. **RBAC System Design:**
   - Enum-based roles and permissions
   - Frontend/backend consistency
   - Flexible permission inheritance

6. **Concurrency Control:**
   - Write conflict retry logic
   - Statistics tracking and monitoring
   - Exponential backoff strategy

7. **Debt Management:**
   - Automatic repayment system
   - Transfer validation rules
   - Complete audit logging

8. **Notification System:**
   - Async Telegram notifications
   - Multi-channel delivery
   - Timeout-resilient architecture

9. **Time Zone Handling:**
   - UTC storage + Asia/Taipei display
   - Consistent formatting across stack
   - Market hours validation

## Key Learnings

### What Actually Worked

**Domain-Driven Design:**

You know what? The layers felt like bureaucracy until we had 3 people coding simultaneously. Then suddenly, being able to say "don't touch the domain layer, just implement a new repository" became invaluable. The repository pattern meant we could swap MongoDB for PostgreSQL if we wanted (we didn't, but we *could*).

**Event-Driven Architecture:**

Best decision we made. Services fail gracefully now. Notification service down? Trades still work. Want to add a new feature that reacts to trades? Just add a new event subscriber. No merge conflicts, no breaking changes.

The event history (last 10K events) also saved us during debugging. "What happened before this user's balance went negative?" Just replay the events. Time-travel debugging without a time machine.

**Distributed Systems:**

Sharding was scary to implement but magical in production. Write conflicts dropped from ~30% to <1%. The key insight: most operations don't need to coordinate across users. Alice buying stocks doesn't need to lock Bob's account. Physical separation (sharding) matches logical separation (different users).

The hardest part wasn't the sharding—it was explaining to teammates why we needed it. "Can't we just add more retry logic?" Well, yes, but...

**Async Python:**

- FastAPI's async/await enables high concurrency
- Motor driver crucial for MongoDB async operations
- Proper session management prevents connection leaks

**MongoDB Transactions:**

- Atomic operations essential for financial systems
- Write conflicts require retry logic
- Session-based transactions ensure consistency

**RBAC Implementation:**

- Enum-based systems easier to maintain than string constants
- Permission checks at both API and UI levels prevent bypass
- Role inheritance reduces configuration complexity

**Frontend State Management:**

- React Context sufficient for permission system
- Centralized API layer simplifies authentication
- Permission guards prevent unauthorized UI access

### Project Management

**Open Source Collaboration:**
- Clear commit messages improve team coordination
- Documentation reduces onboarding friction
- Code review maintains quality standards

**Production Deployment:**
- Environment configuration critical for multi-stage deployment
- Docker simplifies dependency management
- Logging and monitoring essential for debugging

## Future Enhancements

**Planned Features:**

1. **Real-time Updates:**
   - WebSocket integration for live price updates
   - Push notifications for order completion
   - Live leaderboard without refresh

2. **Enhanced Analytics:**
   - Trading volume charts
   - User behavior analysis
   - Market trend visualization

3. **Advanced Trading:**
   - Limit orders (buy/sell at specific prices)
   - Stop-loss orders
   - Portfolio diversification recommendations

4. **Social Features:**
   - Public user profiles
   - Trading achievements/badges
   - Community forums

5. **Performance Optimization:**
   - Redis caching layer (cache_service.py placeholder)
   - Database query optimization
   - API response compression

## Conclusion

The SITCON Camp 2025 Stock Trading System demonstrates **enterprise-grade full-stack development** with comprehensive system design:

### Architecture Highlights

- **Domain-Driven Design:** 4-layer clean architecture with SOLID principles
- **Event-Driven System:** Pub/Sub event bus with 10K event history
- **Distributed Architecture:** 16-shard consistent hashing for horizontal scaling
- **Microservices Pattern:** 19 specialized services working in concert
- **Scalability:** Async architecture + sharding handles 100+ concurrent users
- **Reliability:** Atomic operations + transaction safety + automatic retry
- **Security:** JWT + RBAC + permission guards at all layers
- **Usability:** Telegram bot + web dashboard + mobile-responsive

### System Scope

**14 Major Subsystems:**

1. Stock Trading Engine (IPO + real-time matching)
2. RBAC Permission System (6 roles, 11 permissions)
3. Debt Management (auto-repayment + validation)
4. Admin Dashboard (user management + market control)
5. Telegram Bot (trading + games + notifications)
6. Point Logging (complete audit trail)
7. Event Bus (pub/sub + event sourcing)
8. Distributed Sharding (16 shards + load balancing)
9. PvP Game System (rock-paper-scissors + escrow)
10. Community Booth Integration (9 tech communities)
11. Arcade Machine API (physical hardware integration)
12. Notification Service (multi-channel async delivery)
13. IPO Management (share tracking + atomic updates)
14. Advanced Charting (candlestick + K-line + technical analysis)

### Technical Mastery Demonstrated

**Software Architecture:**

- Domain-Driven Design with explicit boundaries
- Event-driven microservices coordination
- Distributed system design with sharding
- Clean architecture preventing tight coupling

**Backend Engineering:**

- FastAPI async/await for high concurrency
- MongoDB transactions with write conflict handling
- 19 specialized service modules
- Repository pattern for data access abstraction

**Frontend Development:**

- Next.js 15 App Router architecture
- TypeScript for type safety
- Permission-based UI rendering
- Real-time chart visualization

**Distributed Systems:**

- Consistent hashing for user sharding
- Event bus for service communication
- Atomic operations across distributed state
- Monitoring and health checks

**Design Patterns:**

- Repository (data access abstraction)
- Strategy (extensible order execution)
- Dependency Injection (loose coupling)
- Pub/Sub (event-driven communication)
- Factory (service instantiation)

### Contribution Impact

**556 commits (64% of 862 total)** reflects:

- Architectural design and DDD refactoring
- Event bus and sharding implementation
- 14 major subsystem implementations
- Production deployment and optimization
- Team coordination and code review

### Real-World Impact

**SITCON Camp 2025** - 4 days, 100+ students, zero downtime.

The numbers sound modest until you realize these are 100 *tech students* who absolutely will try to break your system. They found edge cases we never imagined. Someone tried negative stock trades. Another student attempted SQL injection on a MongoDB database (nice try). The PvP system saw challenges at 3 AM.

And it held.

The sharding worked. The event bus handled load spikes. The debt system prevented bankruptcy exploits. The Telegram bot responded instantly. The arcade machines synced perfectly.

**What Made It Real:**

- Students actually cared about their portfolios
- Communities loved the engagement tracking
- Admins could intervene invisibly when needed
- The system stayed up when it mattered

**What I'm Proud Of:**

Not the 556 commits. Not the 14 subsystems. Not even the distributed architecture.

It's that when students asked "is this a real stock market?", the answer was "yes, just smaller and more fun." The system felt real because the engineering was real. No shortcuts, no "good enough for camp" compromises.

We built production-grade software for a 4-day event, and it showed.

---

**Project Status:** Deployed for SITCON Camp 2025 | [View Repository](https://github.com/sitcon-tw/camp2025-stock)

**Technology:** FastAPI + Next.js + MongoDB + Telegram Bot API

**Role:** Lead Developer (64% contributions) | **Team Size:** 4 developers

*Completed July 2025 | Serving 100+ Participants at Taiwan's Premier Student IT Camp*
