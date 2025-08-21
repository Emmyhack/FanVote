# Frontend (Next.js)

## Development

```bash
cd /workspace/frontend
npm install
npm run dev
```

## Environment

Copy `.env.local.example` to `.env.local` and set:

- `NEXT_PUBLIC_CIVIC_CLIENT_ID` – Enables Civic Auth (email/social) sign-in UI and session
- `NEXT_PUBLIC_CIVIC_GATEKEEPER_NETWORK` – Civic Pass Gatekeeper Network public key (Devnet example provided). If omitted, a devnet default is used for testing

## Auth

- Civic Auth (email/social): Wraps the app with `CivicAuthProvider` when `NEXT_PUBLIC_CIVIC_CLIENT_ID` is set. Navbar shows Sign in/Sign out via `CivicAuthButtons`
- Civic Pass (wallet verification): `GatewayProvider` wraps wallet context. Admin and Voting pages require `GatewayStatus.ACTIVE`

## Build

```bash
npm run build
npm start
```

## CI/CD (Vercel)

- Vercel uses `npm install` by default. We set `legacy-peer-deps=true` in `.npmrc` to resolve React 18 peer constraints from Civic packages when using React 19.
