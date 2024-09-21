import { Client, GatewayIntentBits, TextChannel, ChannelType } from 'discord.js';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

const TOKEN_ADDRESS = '0x...'; // Replace with your ERC20 token address
const MINIMUM_BALANCE = ethers.utils.parseEther('100'); // Minimum token balance required

const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);

const tokenABI = [
  'function balanceOf(address account) view returns (uint256)',
];

const tokenContract = new ethers.Contract(TOKEN_ADDRESS, tokenABI, provider);

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    const balance = await tokenContract.balanceOf(member.user.id);
    if (balance.gte(MINIMUM_BALANCE)) {
      const channel = await member.guild.channels.create({
        name: `holder-${member.user.username}`,
        type: ChannelType.GuildText,
      });
      
      if (channel instanceof TextChannel) {
        await channel.permissionOverwrites.create(member, {
          ViewChannel: true,
          SendMessages: true,
        });
        await channel.send(`Welcome, ${member.user.username}! This is your exclusive holder channel.`);
      }
    }
  } catch (error) {
    console.error('Error creating channel:', error);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);