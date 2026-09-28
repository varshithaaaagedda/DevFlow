# DevFlow — RevenueCat & Store Subscription Setup Guide

This document provides complete, step-by-step instructions for configuring **RevenueCat** for DevFlow Mobile.

---

## 📌 RevenueCat Test Store Configuration Overview

| Field | Configuration Value |
| :--- | :--- |
| **Product ID** | `devflow_pro_monthly` |
| **Product Type** | Auto-renewing monthly subscription |
| **Store Price** | `$4.99/month` |
| **RevenueCat Entitlement ID** | `devflow_pro` |
| **RevenueCat Offering ID** | `default` |
| **RevenueCat Package ID** | `$rc_monthly` |
| **Android Package Name** | `com.devflow.app` |
| **Environment Key** | `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` (or `EXPO_PUBLIC_REVENUECAT_API_KEY`) |

---

## Part A: RevenueCat Dashboard Setup

1. **Create a RevenueCat Account & Project**:
   - Log into [RevenueCat Dashboard](https://app.revenuecat.com/).
   - Create a Project named `DevFlow`.

2. **Add Android Application**:
   - Under Project Settings, navigate to **Apps**.
   - Click **Add App** and select **Android (Google Play Store)** (or Test Store for sandbox).
   - Set App Name: `DevFlow Mobile`.
   - Set Package Name: `com.devflow.app`.
   - Copy the generated **Public API Key** (`goog_...` or `test_...`).

3. **Configure Environment Variable**:
   - In your `.env` file, set:
     ```env
     EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_your_public_api_key_here
     ```

4. **Create Entitlement**:
   - Go to **Entitlements** in the sidebar.
   - Click **New Entitlement**.
   - Identifier: `devflow_pro`
   - Description: `DevFlow Pro Access (Unlimited repos, AI Daily Brief, AI PR summaries, AI commit messages, Smart Alerts)`.

5. **Create Offering**:
   - Go to **Offerings** in the sidebar.
   - Click **New Offering**.
   - Identifier: `default`
   - Description: `Default DevFlow Offering`.

6. **Add Monthly Package & Attach Product**:
   - Inside the `default` offering, click **Add Package**.
   - Select Package Type: **Monthly** (`$rc_monthly`).
   - Attach Product: `devflow_pro_monthly`.
   - Attach to Entitlement: `devflow_pro`.

---

## Part B: Real Purchase & Restore Verification Workflow

1. **Launch DevFlow App**:
   - Launch app on device / emulator with environment variable configured.

2. **Verify Settings Debug Info**:
   - Open **Settings** -> **RevenueCat Debug Info (DEV ONLY)**:
     - RevenueCat SDK: `CONFIGURED`
     - Customer ID: `devflow_anon_...`
     - Pro Entitlement ("devflow_pro"): `INACTIVE`
     - Current Offering ("default"): `AVAILABLE`

3. **Open DevFlow Pro Subscription Paywall**:
   - Navigate to **DevFlow Pro** (`/subscription`).
   - Price shown: `$4.99/month` (or offering price).
   - Features listed with checkmarks:
     ✓ Unlimited repositories
     ✓ AI Daily Brief
     ✓ AI PR summaries
     ✓ AI commit messages
     ✓ Advanced Smart Alerts

4. **Subscribe**:
   - Tap **"Subscribe to Pro"**.
   - Calls `revenueCatService.purchasePackage(monthlyPackage)` with `$rc_monthly`.
   - Upon completion, `customerInfo.entitlements.active["devflow_pro"]` is re-evaluated.
   - Status updates to `RevenueCat Entitlement "devflow_pro" Active!`.

5. **Restore Purchases**:
   - Tap **"Restore Purchases"**.
   - Calls `revenueCatService.restorePurchases()`, refreshes `CustomerInfo`, and grants Pro access if `devflow_pro` is active.
