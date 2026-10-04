# Aisha's Nursing Hub — iPhone Web Push

This version uses standards-based Web Push for an iPhone Home Screen web app. It stores push subscriptions and scheduled notification jobs in Netlify Blobs and checks for due jobs every minute with a Netlify Scheduled Function.

## Deploy
1. Put this project into a GitHub repository.
2. In Netlify, connect the site to that GitHub repository.
3. Deploy the `main` branch with the included `netlify.toml`.
4. Open the production URL in Safari on Aisha's iPhone.
5. Safari Share → Add to Home Screen.
6. Open Nursing Hub from the new Home Screen icon.
7. Go to Reminders → Enable Phone Notifications → Allow.
8. Tap Send Test to verify push delivery.

No Apple Developer account is required for Web Push. iPhone Web Push is supported for Home Screen web apps on iOS/iPadOS 16.4 and later.
