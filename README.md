# BaghChal / बाघचाल

A modern cross-platform version of Nepal's traditional Bagh-Chal strategy game.

## Current playable MVP
- Human vs Computer (human = goats, computer = tigers)
- Local two-player mode
- 5×5 traditional board
- Goat placement and movement phases
- Tiger movement and captures
- Win detection (5 goats captured / tigers immobilized)
- Responsive web + iOS + Android codebase

## Stack
Expo · React Native · Expo Router · TypeScript · Vercel web export

## Run locally
```bash
npm install
npx expo start
```
Press `w` for web, or use Expo Go/native simulators for mobile.

## Web production build
```bash
npm run build:web
```
The static site is exported to `dist/` and can be hosted on Vercel.

## Roadmap
Next: rule test suite, stronger minimax AI + difficulty levels, side selection, PWA manifest/service worker, Nepali/English localization, sounds/haptics, tutorial, persistence and store-ready assets.
