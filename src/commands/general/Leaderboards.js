const db = require('../../database');
const Constants = require('../../utility/Constants.js');
const patron = require('patron.js');
const StringUtil = require('../../utility/StringUtil.js');
const USD = require('../../utility/USD.js');

class Leaderboards extends patron.Command {
  constructor() {
    super({
      names: ['leaderboards', 'lb', 'highscores', 'highscore', 'leaderboard'],
      groupName: 'general',
      description: 'View the richest Drug Traffickers.'
    });
  }

  async run(msg, args, sender) {
    const users = (await db.query('SELECT "userId", cash FROM users WHERE "guildId" = $1 ORDER BY cash DESC LIMIT 15;', [msg.guild.id])).rows;

    let message = '';

    let position = 1;

    for (let i = 0; i < users.length; i++) {
      if (position > Constants.leaderboardCap) {
        break;
      }

      const user = msg.client.users.get(users[i].userId);

      if (user === undefined) {
        continue;
      }

      message += (position++) + '. ' + StringUtil.boldify(user.tag) + ': ' + USD(users[i].cash) + '\n';
    }

    if (StringUtil.isNullOrWhiteSpace(message) === true) {
      return sender.reply('There is nobody on the leaderboards.', { color: Constants.errorColor });
    }

    return sender.send(message, { title: 'The Richest Criminals' });
  }
}

module.exports = new Leaderboards();
