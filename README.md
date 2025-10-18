# Discord GIF Bot 🎬

An open source Discord bot that allows users to search and send GIFs using slash commands. The bot integrates with the Tenor API (no API key required) to provide a wide variety of GIFs for any occasion.

## Features ✨

- **Slash Command**: `/gif` - Send random GIFs or search for specific ones
- **Search Functionality**: Search for GIFs using keywords
- **Predefined Categories**: Choose from 25+ predefined categories like slap, kiss, anime, dance, etc.
- **Status Updates**: Bot shows "Playing 🎬 /gif" status and updates when fetching GIFs
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Safe Content**: All GIFs are filtered to be family-friendly (G-rated)

## Commands 📝

### `/gif`
Main command to send GIFs with two optional parameters:

- **search** (optional): Search for a specific keyword
- **custom** (optional): Choose from predefined categories:
  - slap, kiss, anime, dance, angry, happy, sad
  - facepalm, excited, highfive, hug, cry, laugh
  - wave, clap, thumbs up, shrug, run, sleep
  - yawn, poke, boop, stare, pat, zoom

### Examples:
- `/gif` - Sends a random GIF
- `/gif search:cat` - Searches for cat GIFs
- `/gif custom:anime` - Sends a random anime GIF

## Installation 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Discord Bot Token

### Setup Steps

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/Unknownzop/GifBot.git
   cd GifBot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Fill in your token**
   Open `.env` and add your Discord bot token:
   ```env
   TOKEN=your_discord_bot_token_here
   ```

5. **Get your Discord Bot Token**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select existing one
   - Go to "Bot" section
   - Copy the token and add it to your `.env` file

6. **Invite the bot to your server**
   - In Discord Developer Portal, go to "OAuth2" → "URL Generator"
   - Select "bot" scope
   - Select "Use Slash Commands" permission
   - Use the generated URL to invite the bot

7. **Run the bot**
   ```bash
   npm start
   ```

## Configuration ⚙️

### Environment Variables
- `TOKEN`: Your Discord bot token (required)

### Bot Permissions
The bot requires the following permissions:
- Send Messages
- Use Slash Commands
- Read Message History

## Usage 💡

Once the bot is running, users can use the `/gif` command in any channel where the bot has permissions:

1. **Random GIF**: Just type `/gif` and press Enter
2. **Search GIF**: Type `/gif search:keyword` (e.g., `/gif search:cat`)
3. **Category GIF**: Type `/gif custom:category` (e.g., `/gif custom:anime`)

## Features in Detail 🔍

### Status Updates
- The bot shows "Playing 🎬 /gif" as its default status
- When fetching GIFs, it shows "🔍 Fetching GIF: [search term]"
- Status returns to default after sending the GIF

### Error Handling
- Graceful handling of API errors
- User-friendly error messages
- Proper logging for debugging
- Graceful shutdown on SIGINT/SIGTERM

### Content Safety
- All GIFs are filtered to be G-rated (family-friendly)
- Safe for use in any Discord server

## Troubleshooting 🔧

### Common Issues

1. **Bot not responding to commands**
   - Check if the bot is online
   - Verify the bot has proper permissions
   - Ensure slash commands are registered

2. **"Error fetching GIF" message**
   - Check your internet connection
   - Try a different keyword or category

3. **Bot not starting**
   - Verify all environment variables are set
   - Check Node.js version (requires v16+)
   - Ensure all dependencies are installed

### Logs
The bot provides detailed console logs for debugging:
- ✅ Success messages
- ❌ Error messages
- ⚠️ Warning messages

## Dependencies 📦

- **discord.js**: Discord API wrapper
- **axios**: HTTP client for API requests
- **dotenv**: Environment variable management
- **express**: Lightweight web server for health check and status

## License 📄

This project is licensed under the MIT License.

## Contributing 🤝

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests

## Support 💬

If you need help with the bot:
1. Check the troubleshooting section
2. Review the console logs for error messages
3. Ensure all setup steps are completed correctly

---

**Enjoy using your Discord GIF Bot! 🎉**
```
