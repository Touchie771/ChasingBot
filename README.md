# ChasingBot

A Minecraft bot that chases and attacks players using mineflayer.

## Features

- **Player Chasing**: Automatically chases the nearest player when hit
- **Combat**: Attacks players while chasing them (within 3.5 blocks range)
- **Pathfinding**: Uses intelligent pathfinding to navigate to targets
- **Toggle System**: Hit the bot again to stop chasing

## Requirements

- Node.js
- Minecraft server (tested on PaperMC with `online-mode=false`)

## Installation

1. Clone or download this project
2. Install dependencies:
```bash
npm install mineflayer mineflayer-pathfinder
```

## Configuration

Edit `src/bot.ts` to modify the bot settings:
- `host`: Server address (default: localhost)
- `port`: Server port (default: 25565)
- `username`: Bot username (default: ChasingBot)
- `auth`: Authentication mode (default: offline)

## Usage

1. Start your Minecraft server
2. Run the bot using one of these methods:

### Option 1: Using the convenience script (recommended)
```bash
./run.sh
```
This script will automatically install dependencies if needed and start the bot.

### Option 2: Manual execution
```bash
node src/bot.ts
```

## Commands

- `come!` - Bot moves to your current location
- **Hit the bot** - Toggle chase mode on/off

## Behavior

- When hit, the bot will start chasing and attacking the nearest player within 5 blocks
- The bot attacks every 500ms when within 3.5 blocks of the target
- Hitting the bot again while it's chasing you will stop the chase
- The bot automatically stops chasing if the target leaves the game

## Testing

This bot has been tested on:
- **Server**: PaperMC
- **Mode**: `online-mode=false`
- **Environment**: Local server

## Dependencies

- `mineflayer` - Minecraft bot framework
- `mineflayer-pathfinder` - Pathfinding plugin for mineflayer