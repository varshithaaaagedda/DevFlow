# DevFlow Mobile 🚀
> **Shipaton 2026 Next Gen Submission** — AI-Powered GitHub Repository Monitor & Hackathon Companion

DevFlow Mobile is a next-generation React Native app designed for developers and hackathon builders. It aggregates live GitHub repositories, pull requests, CI/CD build statuses, and hackathon project deadlines into a single, high-performance mobile dashboard enhanced by AI summaries and RevenueCat subscription billing.

---

## ✨ Features

- 📱 **Real-Time GitHub Dashboard**: Monitor repositories, open pull requests, and CI/CD build health.
- 🤖 **AI Daily Brief**: Automated daily briefings summarizing commits, PR reviews, and pipeline failures.
- 🔍 **AI PR Diff Summaries**: Deep-dive LLM explanations of pull request code changes.
- ⚡ **Smart Push Alert Feed**: Immediate notification stream for critical build breaks and deadline alerts.
- 🏆 **Hackathon Milestone Tracker**: Live progress indicators, task checklists, and deadline countdowns.
- 💎 **DevFlow Pro Tier**: Powered by real RevenueCat SDK store purchasing and entitlement management.

---

## 🛠️ Technology Stack

- **Framework**: Expo SDK 57 (Expo Router file-based navigation)
- **Language**: TypeScript (100% strict type check)
- **In-App Billing**: RevenueCat SDK (`react-native-purchases` v10.10.2)
- **Push Alerts**: OneSignal & `expo-notifications` integration
- **Version Control Integrations**: GitHub REST API
- **Styling & UI**: Custom Vanilla Glassmorphic Design Token System

---

## 💳 RevenueCat Test Store Configuration

DevFlow uses the official RevenueCat SDK for managing mobile subscriptions and feature gating:

| Property | Value |
| :--- | :--- |
| **Product ID** | `devflow_pro_monthly` |
| **Product Type** | Auto-renewing monthly subscription |
| **Store Price** | `$4.99/month` |
| **RevenueCat Entitlement ID** | `devflow_pro` |
| **RevenueCat Offering ID** | `default` |
| **RevenueCat Package ID** | `$rc_monthly` |
| **Environment Variable** | `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` |

> 🔒 **Entitlement Validation**: Pro features are unlocked strictly when RevenueCat returns an active `devflow_pro` entitlement inside `customerInfo.entitlements.active['devflow_pro']`. No mock purchase overrides or unverified local storage flags are used.

---

## 🔔 OneSignal & GitHub Integration

- **GitHub Integration**: Supports connecting user GitHub personal access tokens to fetch real repositories, commits, and pull requests.
- **OneSignal Alerts**: Interoperable push alert dispatching for repo failures, security alerts, and hackathon submission reminders.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go or an Android Emulator / Physical Device

### Local Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/varshithaaaagedda/DevFlow.git
   cd DevFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your RevenueCat Test Store Public Key:
   ```env
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=test_lxeZWsYyuULmTpOTgRJqGAqOGGt
   ```

4. **Start Expo Development Server**:
   ```bash
   npx expo start
   ```

---

## ⚠️ Known Limitations

- **Google Play Production Publishing**: Production Google Play Store submission and live merchant account linking are out of scope for the hackathon sandbox build.
- **Expo Go Purchasing**: Real store purchases require an EAS development build (`npx eas-cli build --profile development --platform android`) because Expo Go standard sandbox does not bundle native Google Play Billing binaries.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
