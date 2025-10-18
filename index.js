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

// Slash command
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
    client.user.setActivity('/gif', { type: ActivityType.Playing });
  } catch (error) {
    console.error('Error during bot startup:', error.message);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'gif') return;

  const search = interaction.options.getString('search');
  const custom = interaction.options.getString('custom');
  const query = search || custom || '';

  client.user.setActivity(`Fetching GIF${query ? `: ${query}` : ''}`, { type: ActivityType.Playing });

  const endpoint = query
    ? `https://g.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=LIVDSRZULELA&limit=10&contentfilter=medium`
    : `https://g.tenor.com/v1/trending?key=LIVDSRZULELA&limit=10&contentfilter=medium`;

  try {
    await interaction.deferReply();

    const response = await axios.get(endpoint);
    const results = response.data.results;

    if (!results || results.length === 0) {
      client.user.setActivity('/gif', { type: ActivityType.Playing });
      return interaction.editReply({ content: 'No GIFs found for that term.' });
    }

    const random = results[Math.floor(Math.random() * results.length)];
    const gifUrl = random.media[0].gif.url;

    client.user.setActivity('/gif', { type: ActivityType.Playing });
    await interaction.editReply({ content: gifUrl });
  } catch (error) {
    console.error('[GIF Bot Error]', error.message);

    client.user.setActivity('/gif', { type: ActivityType.Playing });

    if (interaction.deferred) {
      await interaction.editReply({ content: 'Error fetching GIF. Please try again later.' });
    } else {
      await interaction.reply({ content: 'Error fetching GIF. Please try again later.', ephemeral: true });
    }
  }
});

// Error handling
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

client.login(process.env.TOKEN);
