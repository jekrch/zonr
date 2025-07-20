# Zonr :european_castle:


![Version](https://img.shields.io/badge/version-1.1-blue) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a href="jekrch.github.io/zonr">jekrch.github.io/zonr/</a>

A clean, modern score tracking app for the board game Carcassonne. Keep track of multiple players' scores across all scoring categories with an intuitive interface designed for both desktop and mobile play.

## Features

- **Multi-player support** - Track scores for 2-6 players with customizable names and meeple colors
- **Complete scoring system** - Roads, cities, monasteries, and fields with increment/decrement controls and manual input
- **Game sharing** - Share games via URL with full state persistence - no accounts needed
- **Score history** - View complete turn history and edit individual scoring rounds
- **Visual score track** - Animated score dots move around a border track (classic Carcassonne style)
- **Multiple themes** - Choose from classic, forest, royal, and sunset color schemes
- **Mobile-optimized** - Touch-friendly controls, hold-to-repeat buttons, and responsive design
- **End game celebration** - Fireworks animation with detailed statistics and player breakdowns

## Screenshots

<img width="200" alt="image" src="https://github.com/user-attachments/assets/cf1fc946-4198-4f2e-9674-c0cdd5db42af" />

<img width="200" alt="image" src="https://github.com/user-attachments/assets/8247e71a-b472-4184-a73f-228dd7043844" />

<img width="200" alt="image" src="https://github.com/user-attachments/assets/98526bbf-6ecf-47ba-ab5b-d79df37f7b45" />

<img width="200" alt="image" src="https://github.com/user-attachments/assets/e63c9eab-feda-417f-8e7c-5cf3556c52dd" />

## Development

Built with modern web technologies for a smooth, responsive experience.

### Setup

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom theme system
- **Animations**: TSParticles for fireworks, custom CSS animations
- **Build Tool**: Vite with SWC
- **Package Manager**: Bun
- **Deployment**: GitHub Pages via GitHub Actions

### Key Dependencies

- `lucide-react` - Icons
- `@tsparticles/react` - Particle effects for celebrations
- `class-variance-authority` - Component variant styling

## Usage

### Getting Started

1. **Setup Players**: Add 2-6 players with custom names and choose from 6 meeple colors
2. **Score Turns**: Use the category controls to add points for roads, cities, monasteries, and fields
3. **Track Progress**: Watch player positions move around the visual score track
4. **Edit History**: Tap any previous turn to modify scores if needed
5. **Share Games**: Copy the URL to share the current game state with other players
6. **End Game**: View celebration with detailed statistics and player breakdowns

### Scoring Categories

- **🛤️ Roads** - Completed roads and road segments
- **🏰 Cities** - Completed cities and city segments  
- **⛪ Monasteries** - Completed monasteries
- **🌾 Fields** - End-game field scoring

### Game State Persistence

The app encodes the entire game state in the URL, including:
- All player names and colors
- Complete scoring history for each player
- Current turn and active player
- Selected theme

This means you can bookmark games, share them via any messaging platform, or pick up where you left off on any device.
