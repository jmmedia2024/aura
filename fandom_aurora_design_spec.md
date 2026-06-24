# Fandom Aurora - Backend & Database Architecture Specification

This document details the complete design specification for the Fandom Aurora platform, including a robust **MongoDB Schema Design**, a high-performance **PostgreSQL Schema Translate**, and a robust **RESTful API Endpoint structure** designed for connecting the frontend (`MyPage` and Tier progressions) with the persistent storage layers.

---

## 1. Robust MongoDB Schema Design

The following collections are designed using BSON types and embedded document styling where appropriate, establishing native JSON schema structures for **Users**, **MembershipTiers**, **Achievements**, and **Bookings**.

### Collection 1: `users`
Represents the user account, current tier progression, social elements, and unlocked achievements.

```json
{
  "_id": "string (UUID or Firebase UID)",
  "email": "string (unique, formatted email)",
  "displayName": "string",
  "phoneNumber": "string (optional)",
  "role": "string (enum: ['User', 'Admin', 'Partner'])",
  "createdAt": "date",
  "updatedAt": "date",
  "fandomProfile": {
    "selectedFanId": "string (optional)",
    "selectedFanName": "string (optional)",
    "selectedFanPhotoUrl": "string (optional)",
    "interests": ["string"]
  },
  "tierProgression": {
    "currentTierId": "string (references membership_tiers._id)",
    "activityPoints": "int (total loyalty points earned)",
    "certifiedTicketsCount": "int (number of unique bookings verified)",
    "referredByEmail": "string (optional)",
    "ancestorEmails": ["string (hierarchical network array)"]
  },
  "unlockedAchievements": [
    {
      "achievementId": "string (references achievements._id)",
      "unlockedAt": "date",
      "notified": "boolean"
    }
  ]
}
```

### Collection 2: `membership_tiers`
Stores the tiers (Basic, Silver, Gold, Platinum, Legend) and their unlock requirements.

```json
{
  "_id": "string (e.g. 'silver', 'gold')",
  "name": "string (e.g. 'Silver Class', 'Gold Creator')",
  "level": "int (escalating index)",
  "requirements": {
    "minTickets": "int",
    "minPoints": "int"
  },
  "perks": {
    "badgeIcon": "string",
    "multiplier": "double (points multiplier)",
    "hasPriorityBooking": "boolean",
    "hasVipLoungeAccess": "boolean"
  },
  "styling": {
    "barColor": "string (Tailwind gradient tail)",
    "glowColor": "string"
  }
}
```

### Collection 3: `achievements`
Defines target badges and metadata for user milestones.

```json
{
  "_id": "string (unique handle, e.g. 'first_booking')",
  "title": "string",
  "description": "string",
  "badgeIcon": "string (Lucide React icon name)",
  "category": "string (enum: ['booking', 'social', 'loyalty'])",
  "conditions": {
    "metric": "string (enum: ['certifiedTickets', 'activityPoints', 'referralCount'])",
    "threshold": "int"
  },
  "rewards": {
    "bonusPoints": "int",
    "exclusivePerk": "string (optional)"
  },
  "styling": {
    "gradient": "string"
  }
}
```

### Collection 4: `bookings`
Tracks concert and event ticket bookings/verifications.

```json
{
  "_id": "string (UUID or secure serial)",
  "userId": "string (references users._id)",
  "eventTitle": "string",
  "eventDate": "date",
  "bookingRef": "string (unique code)",
  "ticketImage": "string (verification proof URL)",
  "status": "string (enum: ['pending', 'approved', 'rejected'])",
  "pointsAwarded": "int",
  "createdAt": "date",
  "verifiedAt": "date (optional)"
}
```

---

## 2. PostgreSQL Schema Translation (SQL)

Below is the highly optimized, relational SQL translation matching the MongoDB architecture with indexes, foreign keys, cascades, and robust check constraints.

```sql
-- Create custom ENUM types for rigid security constraints
CREATE TYPE role_type AS ENUM ('User', 'Admin', 'Partner');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE achievement_metric AS ENUM ('certifiedTickets', 'activityPoints', 'referralCount');

-- 1. Membership Tiers Table
CREATE TABLE IF NOT EXISTS membership_tiers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    level INT NOT NULL UNIQUE,
    min_tickets INT NOT NULL DEFAULT 0,
    min_points INT NOT NULL DEFAULT 0,
    points_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    has_priority_booking BOOLEAN NOT NULL DEFAULT FALSE,
    has_vip_lounge_access BOOLEAN NOT NULL DEFAULT FALSE,
    bar_color VARCHAR(100),
    glow_color VARCHAR(100)
);

-- Seed initial membership tier values to guarantee application referential integrity
INSERT INTO membership_tiers (id, name, level, min_tickets, min_points, points_multiplier, has_priority_booking, has_vip_lounge_access, bar_color, glow_color)
VALUES 
('basic', 'Basic Aurora', 1, 0, 0, 1.00, FALSE, FALSE, 'from-slate-500 to-slate-400', 'rgba(148, 163, 184, 0.3)'),
('silver', 'Silver Aurora', 2, 0, 100, 1.10, FALSE, FALSE, 'from-cyan-500 to-blue-500', 'rgba(34, 211, 238, 0.4)'),
('gold', 'Gold Creator', 3, 5, 200, 1.25, TRUE, FALSE, 'from-blue-600 to-indigo-500', 'rgba(37, 99, 235, 0.4)'),
('platinum', 'Platinum Legend', 4, 10, 400, 1.50, TRUE, TRUE, 'from-amber-400 to-orange-500', 'rgba(245, 158, 11, 0.5)')
ON CONFLICT (id) DO NOTHING;


-- 2. Users Table (Integrated with Tiers)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(150),
    phone_number VARCHAR(50),
    role role_type NOT NULL DEFAULT 'User',
    current_tier_id VARCHAR(50) NOT NULL DEFAULT 'basic' REFERENCES membership_tiers(id) ON DELETE SET DEFAULT,
    activity_points INT NOT NULL DEFAULT 0 CHECK (activity_points >= 0),
    certified_tickets INT NOT NULL DEFAULT 0 CHECK (certified_tickets >= 0),
    referred_by_email VARCHAR(255),
    ancestors TEXT[] NOT NULL DEFAULT '{}',
    selected_fan_id VARCHAR(100),
    selected_fan_name VARCHAR(150),
    selected_fan_photo_url TEXT,
    fandom_interests TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- 3. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(150) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    badge_icon VARCHAR(50) NOT NULL,
    metric_type achievement_metric NOT NULL,
    threshold INT NOT NULL CHECK (threshold > 0),
    bonus_points INT NOT NULL DEFAULT 0,
    exclusive_perk TEXT,
    gradient_color VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed basic Achievements as defined in MyPage
INSERT INTO achievements (id, title, description, badge_icon, metric_type, threshold, bonus_points, gradient_color)
VALUES 
('first_booking', '첫 티켓 인증 (First Booking)', '첫 번째 공연 티켓 인증을 완료하여 Fandom Aurora에 정식 탑승했습니다.', 'Ticket', 'certifiedTickets', 1, 50, 'from-cyan-400 to-blue-500'),
('frequent_cruiser', '단골 크루저 (Frequent Cruiser)', '5장 이상의 공연 티켓을 인증한 아티스트의 열성적인 여정 동반자입니다.', 'Flame', 'certifiedTickets', 5, 150, 'from-amber-400 to-orange-500'),
('active_supporter', '활발한 서포터 (Active Supporter)', '커뮤니티 활동 점수 200점 이상을 달성하여 팬덤 소통에 크게 기여했습니다.', 'MessageSquare', 'activityPoints', 200, 100, 'from-purple-400 to-pink-500')
ON CONFLICT (id) DO NOTHING;


-- 4. User Achievements Junction Table (Badge unlocking tracking)
CREATE TABLE IF NOT EXISTS user_achievements (
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(100) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_notified BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id, achievement_id)
);


-- 5. Bookings / Verifications Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_title VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    booking_ref VARCHAR(100) NOT NULL UNIQUE,
    ticket_image_url TEXT NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    points_awarded INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Performance & Integrity Indexes
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(current_tier_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
```

---

## 3. RESTful API Endpoints Structure

Below is the design for the server endpoints (Express-like routing structures) handling user tier transitions, achievement validations, and synchronizing with the database schemas above.

### A. Tier Transition & Progress Endpoints

#### 1. GET `/api/users/:userId/tier`
Retrieves the user's current tier status, progress metrics, and outstanding requirements to reach the next tier.

*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "currentTier": {
        "id": "silver",
        "name": "Silver Aurora",
        "level": 2,
        "multiplier": 1.10
      },
      "nextTier": {
        "id": "gold",
        "name": "Gold Creator",
        "level": 3,
        "requirements": {
          "tickets": 5,
          "points": 200
        }
      },
      "progress": {
        "certifiedTickets": 3,
        "activityPoints": 240,
        "ticketProgressPercent": 60,
        "pointsProgressPercent": 100,
        "overallProgressPercent": 80
      }
    }
    ```

#### 2. POST `/api/users/:userId/tier/evaluate`
Triggers a backend validation check to determine if the user has fulfilled criteria to automatically ascend to a higher tier.

*   **Security:** Requires Bearer JWT Token verifying the user or admin access.
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "previousTier": "silver",
      "newTier": "gold",
      "tierUpgraded": true,
      "message": "Congratulations! You have upgraded to Gold Creator.",
      "unlockedPerks": ["priority_booking"]
    }
    ```

---

### B. Achievement Validation & Badge Endpoints

#### 1. GET `/api/users/:userId/achievements`
Fetches all accomplishments, clearly separating unlocked/locked items, progress metrics, and metadata to paint the frontend layout seamlessly.

*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "badgesUnlockedCount": 2,
      "totalBadgesCount": 6,
      "achievements": [
        {
          "id": "first_booking",
          "title": "첫 티켓 인증",
          "description": "첫 번째 공연 티켓 인증을 완료하여 Fandom Aurora에 정식 탑승했습니다.",
          "unlocked": true,
          "unlockedAt": "2026-06-20T10:15:30Z",
          "progress": { "current": 1, "target": 1 },
          "badgeIcon": "Ticket",
          "gradientColor": "from-cyan-400 to-blue-500"
        },
        {
          "id": "frequent_cruiser",
          "title": "단골 크루저",
          "description": "5장 이상의 공연 티켓을 인증한 아티스트의 열성적인 여정 동반자입니다.",
          "unlocked": false,
          "unlockedAt": null,
          "progress": { "current": 3, "target": 5 },
          "badgeIcon": "Flame",
          "gradientColor": "from-amber-400 to-orange-500"
        }
      ]
    }
    ```

#### 2. POST `/api/users/:userId/achievements/:achievementId/validate`
Checks validation logic against specific database metrics and unlocks the achievement if the conditions are met.

*   **Payload:** Empty (or specific user completion meta if validating manual-review actions).
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "achievementId": "frequent_cruiser",
      "unlocked": true,
      "awardedPoints": 150,
      "unlockedAt": "2026-06-24T17:10:00Z"
    }
    ```

---

### C. Booking & Verification Proxy Endpoints

#### 1. POST `/api/bookings`
Submits a booking reference or ticket proof to the database to kickstart verification.

*   **Request Body:**
    ```json
    {
      "eventTitle": "2026 Aurora Live Concert",
      "eventDate": "2026-08-15T19:00:00Z",
      "bookingRef": "BK-20260815-X9F",
      "ticketImageUrl": "https://storage.googleapis.com/aurora-tickets/proof_28392.jpg"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "bookingId": "bk_9832473",
      "status": "pending",
      "message": "Ticket verification request submitted. Approval typically takes under 24 hours."
    }
    ```

#### 2. PUT `/api/bookings/:bookingId/verify` (Admin-Only)
Updates booking status. Approving a booking increments `certified_tickets`, increments `activity_points` by `pointsAwarded`, and triggers automatic tier/achievement re-evaluation.

*   **Request Body:**
    ```json
    {
      "status": "approved",
      "pointsAwarded": 100
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "bookingId": "bk_9832473",
      "status": "approved",
      "pointsAwarded": 100,
      "triggeredTriggers": {
        "tierEvaluated": true,
        "achievementsValidated": ["first_booking"]
      }
    }
    ```
