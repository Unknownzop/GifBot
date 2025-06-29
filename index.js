import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ActivityType } from 'discord.js';
import axios from 'axios';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const app = express();
const PORT = 3000;

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    bot: client.user ? client.user.tag : 'Starting up...',
    uptime: client.uptime ? Math.floor(client.uptime / 1000) : 0,
    guilds: client.guilds ? client.guilds.cache.size : 0
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

const commands = [
  new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Send a random GIF, search one, or choose a category')
    .addStringOption(option =>
      option.setName('search')
        .setDescription('Search for a keyword')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('custom')
        .setDescription('Choose a category')
        .setRequired(false)
        .addChoices(
          { name: 'slap', value: 'slap' },
          { name: 'kiss', value: 'kiss' },
          { name: 'anime', value: 'anime' },
          { name: 'dance', value: 'dance' },
          { name: 'angry', value: 'angry' },
          { name: 'happy', value: 'happy' },
          { name: 'sad', value: 'sad' },
          { name: 'facepalm', value: 'facepalm' },
          { name: 'excited', value: 'excited' },
          { name: 'highfive', value: 'highfive' },
          { name: 'hug', value: 'hug' },
          { name: 'cry', value: 'cry' },
          { name: 'laugh', value: 'laugh' },
          { name: 'wave', value: 'wave' },
          { name: 'clap', value: 'clap' },
          { name: 'thumbs up', value: 'thumbs up' },
          { name: 'shrug', value: 'shrug' },
          { name: 'run', value: 'run' },
          { name: 'sleep', value: 'sleep' },
          { name: 'yawn', value: 'yawn' },
          { name: 'poke', value: 'poke' },
          { name: 'boop', value: 'boop' },
          { name: 'stare', value: 'stare' },
          { name: 'pat', value: 'pat' },
          { name: 'zoom', value: 'zoom' }
        )
    )
].map(cmd => cmd.toJSON());

client.once('ready', async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log(`Logged in as ${client.user.tag}`);
    
    // Set bot status
    client.user.setActivity('/gif', { type: ActivityType.Playing });
    console.log('Bot status set to "Playing /gif"');
  } catch (error) {
    console.error('Error during bot startup:', error.message);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'gif') return;

  const search = interaction.options.getString('search');
  const custom = interaction.options.getString('custom');
  const query = search || custom || '';

  // Set status to show fetching
  client.user.setActivity(`Fetching GIF${query ? `: ${query}` : ''}`, { type: ActivityType.Playing });

  let endpoint = query
    ? `https://api.giphy.com/v1/gifs/search?api_key=${process.env.API}&q=${encodeURIComponent(query)}&limit=25&rating=g`
    : `https://api.giphy.com/v1/gifs/random?api_key=${process.env.API}&rating=g`;

  try {
    await interaction.deferReply();
    
    const { data } = await axios.get(endpoint);
    let gif;

    if (query) {
      const results = data.data;
      if (!results || results.length === 0) {
        // Reset status back to default
        client.user.setActivity('/gif', { type: ActivityType.Playing });
        return interaction.editReply({ content: 'No GIFs found for that term.' });
      }
      gif = results[Math.floor(Math.random() * results.length)].images.original.url;
    } else {
      gif = data.data.images.original.url;
    }

    // Reset status back to default
    client.user.setActivity('/gif', { type: ActivityType.Playing });
    await interaction.editReply({ content: gif });
  } catch (error) {
    console.error('[GIF Bot Error]', error.message);
    
    // Reset status back to default
    client.user.setActivity('/gif', { type: ActivityType.Playing });
    
    if (interaction.deferred) {
      await interaction.editReply({ content: 'Error fetching GIF. Please check your API key or try again later.' });
    } else {
      await interaction.reply({ content: 'Error fetching GIF. Please check your API key or try again later.', ephemeral: true });
    }
  }
});

// Error handling for the client
client.on('error', error => {
  console.error('Discord client error:', error);
});

client.on('warn', warning => {
  console.warn('Discord client warning:', warning);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down bot...');
  client.destroy();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down bot...');
  client.destroy();
  process.exit(0);
});

// Check for required environment variables
if (!process.env.TOKEN) {
  console.error('Missing TOKEN in environment variables');
  process.exit(1);
}

if (!process.env.API) {
  console.error('Missing API in environment variables');
  process.exit(1);
}

client.login(process.env.TOKEN);