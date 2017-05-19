﻿using DEA.Common.Data;
using DEA.Common.Extensions;
using DEA.Common.Extensions.DiscordExtensions;
using Discord;
using Discord.Commands;
using System.Threading.Tasks;

namespace DEA.Modules.Crime
{
    public partial class Crime
    {
        [Command("Enslave")]
        [Summary("Enslave any users at low health.")]
        public async Task Enslave(IGuildUser userToEnslave)
        {
            var user = await _userRepo.GetUserAsync(userToEnslave);
            if (userToEnslave.Id == Context.User.Id)
            {
                ReplyError("Look at that retard, trying to enslave himself.");
            }
            else if (user.SlaveOf != 0)
            {
                ReplyError("This user is already a slave.");
            }
            else if (user.Health > Config.ENSLAVE_HEALTH)
            {
                ReplyError($"The user must be under {Config.ENSLAVE_HEALTH} health to enslave.");
            }

            await _userRepo.ModifyAsync(user, x => x.SlaveOf = Context.User.Id);
            await ReplyAsync($"You have successfully enslaved {userToEnslave.Boldify()}. {Config.SLAVE_COLLECT_VALUE.ToString("P")} of all cash earned by all your slaves will go straight to you when you use `{Context.DbGuild.Prefix}Collect`.");

            try
            {
                var channel = await userToEnslave.CreateDMChannelAsync();

                await channel.SendAsync($"AH SHIT NIGGA! Looks like {Context.User.Boldify()} got you enslaved. The only way out is `{Context.DbGuild.Prefix}suicide`.");
            }
            catch { }
        }
    }
}