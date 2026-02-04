import os
import importlib
import discord
import traceback
from utils.constants import BOT_SETTINGS

def setup(bot):
    @bot.event
    async def on_message(message: discord.Message):
        # Ignore bot messages
        if message.author.bot:
            return

        prefix = BOT_SETTINGS.get("PREFIX", "!")

        if not message.content.startswith(prefix):
            return

        # Extract command + args
        parts = message.content[len(prefix):].strip().split()
        if not parts:
            return

        cmd_name = parts[0].lower()
        args = parts[1:]

        commands_root = "commands"

        # Walk through command folders
        for folder in os.listdir(commands_root):
            folder_path = os.path.join(commands_root, folder)
            if not os.path.isdir(folder_path):
                continue

            for file in os.listdir(folder_path):
                if not file.endswith(".py"):
                    continue

                module_path = f"{commands_root}.{folder}.{file[:-3]}"

                try:
                    module = importlib.import_module(module_path)
                except Exception as e:
                    print(f"❌ Failed to import {module_path}: {e}")
                    traceback.print_exc()
                    continue

                # Only run commands that explicitly support prefix mode
                if hasattr(module, "prefix") and module.prefix.lower() == cmd_name:
                    try:
                        await module.execute(message, args, bot)
                    except Exception as e:
                        print(f"❌ Prefix command execution error: {e}")
                        traceback.print_exc()
                        await message.reply("There was an error executing that command.")
                    return

        # No prefix command matched
        await message.reply(f"Unknown command. Use {prefix}help to see available commands.")
