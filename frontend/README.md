# Frontend (Next.js)

## Development

```bash
cd /workspace/frontend
npm install
npm run dev
```

## Environment

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_CIVIC_GATEKEEPER_NETWORK` – Civic Pass Gatekeeper Network public key (Devnet example provided). If omitted, Civic gating is disabled.

## Civic Verification

This app integrates Civic Pass for verification:

- `GatewayProvider` wraps the wallet context when `NEXT_PUBLIC_CIVIC_GATEKEEPER_NETWORK` is set
- Use the Verify button in the navbar or on gated pages
- Admin and Voting require an ACTIVE Civic status

## Build

```bash
npm run build
npm start
```
