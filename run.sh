if ! npm list mineflayer &>/dev/null || ! npm list mineflayer-pathfinder &>/dev/null; then
  npm install
fi

YELLOW='\033[0;33m'

printf "${YELLOW}Starting bot...\n"
node src/bot.ts