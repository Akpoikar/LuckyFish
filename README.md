# Lucky Fish

Online casino crash game built with React + TypeScript. Optimized for mobile and low-end devices.

## Tech Stack

- **Vite** – Fast builds, small bundles, tree-shaking
- **React 18** – Concurrent features, Suspense
- **TypeScript** – Type safety
- **SWC** – Fast HMR via `@vitejs/plugin-react-swc`

## Project Structure

```
src/
├── assets/          # Images, sounds, static files
├── components/      # Reusable UI components
│   └── layout/     # Layout components (GameLayout)
├── game/           # Game-specific components (crash display, bet panel, etc.)
├── hooks/          # Custom React hooks
├── styles/         # Global CSS
├── types/          # TypeScript types
├── utils/          # Utility functions
├── App.tsx
└── main.tsx
```

## Mobile Optimizations

- Minimal dependencies (React + React-DOM only)
- Code splitting (vendor chunk)
- ES2020 target for smaller output
- Viewport meta for mobile
- Safe area insets for notched devices
- Overscroll disabled to avoid pull-to-refresh during play

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Best Practices

- Import directly from source files (avoid barrel `index.ts` for hot paths)
- Use `React.memo` and `useCallback` for frequently re-rendered components
- Prefer CSS animations over JS-driven animations for performance
