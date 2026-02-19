# Lucky Fishy - Backend API Specification

This document describes the API endpoints the frontend expects. Implement these on your backend.

**Base URL:** `/api` (or configure via `VITE_API_URL` env var)

---

## User

### GET `/api/user/balance`

Get the current user's balance in dollars/cents.

**Response:**
```json
{
  "balance": 10000.00
}
```

---

## Game

### POST `/api/game/play`

Start a new round. Deducts the bet from the user's balance.

**Request body:**
```json
{
  "betAmount": 1.00,
  "level": 1
}
```

| Field      | Type   | Description                    |
|------------|--------|--------------------------------|
| betAmount  | number | Bet amount in dollars          |
| level      | number | Selected level (1–9)            |

**Response:**
```json
{
  "roundId": "uuid-string",
  "currentLevel": 1,
  "bubbleCount": 5,
  "balance": 9999.00
}
```

| Field       | Type   | Description                          |
|-------------|--------|--------------------------------------|
| roundId     | string | Unique round ID for subsequent calls  |
| currentLevel| number | Level for this round (1–10)          |
| bubbleCount | number | Number of bubbles (e.g. 5 for level 1)|
| balance     | number | User balance after bet deduction     |

**Errors:** `400` if insufficient balance or invalid bet/level.

---

### POST `/api/game/round/:roundId/bubble-click`

User clicked a bubble. Server reveals all bubbles and determines win/loss.

**URL params:** `roundId` – ID from play response

**Request body:**
```json
{
  "bubbleIndex": 0
}
```

| Field       | Type  | Description                    |
|-------------|-------|--------------------------------|
| bubbleIndex | number| Index of the clicked bubble (0-based) |

**Response:**
```json
{
  "bubbles": [
    { "index": 0, "hasBomb": false },
    { "index": 1, "hasBomb": true },
    { "index": 2, "hasBomb": false }
  ],
  "win": true,
  "clickedBubbleHadBomb": false,
  "newLevel": 2,
  "payout": 0,
  "balance": 9999.00
}
```

| Field               | Type    | Description                                      |
|---------------------|---------|--------------------------------------------------|
| bubbles             | array   | All bubbles with bomb status                     |
| win                 | boolean | `true` if clicked bubble was safe                 |
| clickedBubbleHadBomb| boolean | `true` if user hit a bomb (loss)                 |
| newLevel            | number? | Next level if win (omit if loss or max level)    |
| payout              | number? | Payout this click if any (usually 0 until cashout)|
| balance             | number  | Current user balance                              |

**Game logic notes:**
- On **win**: User advances to next level. Frontend will show bubbles for `newLevel` and allow another click or cashout.
- On **loss**: Round ends. Frontend shows all bubbles with bomb indicators and loss state.
- `bubbles` should include every bubble for the current level so the frontend can show bomb/safe states.

**Errors:** `400` if round not found, invalid bubble index, or round already ended.

---

### POST `/api/game/round/:roundId/cashout`

User cashes out. Payout is calculated from the current level multiplier.

**URL params:** `roundId` – ID from play response

**Request body:** None (or `{}`)

**Response:**
```json
{
  "payout": 1.18,
  "balance": 10000.18
}
```

| Field   | Type   | Description                    |
|---------|--------|--------------------------------|
| payout  | number | Amount won (bet × multiplier)  |
| balance | number | User balance after payout      |

**Multipliers and bubble/bomb counts by level:**
| Level | Bubbles | Bombs | Multiplier |
|-------|---------|-------|------------|
| 1     | 5       | 1     | 1.18x      |
| 2     | 6       | 2     | 1.48x      |
| 3     | 7       | 3     | 2.05x      |
| 4     | 8       | 4     | 3.20x      |
| 5     | 9       | 5     | 6.30x      |
| 6     | 10      | 6     | 13.20x     |
| 7     | 10      | 7     | 32.00x     |
| 8     | 10      | 8     | 95.00x     |
| 9     | 10      | 9     | 580.00x    |

**Errors:** `400` if round not found or round already ended.

---

## Error format

Return JSON for 4xx/5xx errors:

```json
{
  "error": "string",
  "code": "optional_error_code"
}
```

---

## CORS

Allow requests from the frontend origin. Required headers:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Headers: Content-Type`
