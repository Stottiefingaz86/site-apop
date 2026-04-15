# Quickstart: Change deposit to say Wallet

## Preconditions

- Install dependencies: `npm install`
- Run app locally: `npm run dev`
- Ensure at least one page with main nav is reachable (e.g. `/`, `/sports`, `/casino`)

## Validation Steps

1. Open a page with the main navigation.
2. Confirm the desktop nav button text reads `WALLET` (not `DEPOSIT`).
3. Inspect the wallet button root in DevTools and verify:
   - `data-apop-feature-id="cmo0gy5qw0015dd0etheq96fg"`
   - `data-apop-element-id="main-nav-wallet"`
4. Click the wallet nav button and verify the same drawer/flow opens as before.
5. In browser network panel, confirm `POST /api/tracking/events` requests occur:
   - On mount (impression)
   - On click
6. Verify request body matches:
   ```json
   {
     "events": [
       {
         "featureId": "cmo0gy5qw0015dd0etheq96fg",
         "eventType": "impression|click",
         "route": "/current-route",
         "elementId": "main-nav-wallet"
       }
     ]
   }
   ```
7. Simulate API failure (e.g., block `/api/tracking/events`) and confirm nav remains usable.

## Build Check

- Run: `npm run build`
- Expected: successful production build without TypeScript errors introduced by this feature.
