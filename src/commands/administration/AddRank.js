const db = require('../../database');
const patron = require('patron.js');
const USD = require('../../utility/USD.js');

class AddRank extends patron.Command {
  constructor() {
    super({
      names: ['addrank', 'setrank', 'enablerank', 'modifyrank', 'updaterank', 'changerank'],
      groupName: 'administration',
      description: 'Add a rank.',
      botPermissions: ['MANAGE_ROLES'],
      args: [
        new patron.Argument({
          name: 'role',
          key: 'role',
          type: 'role',
          example: 'Sicario',
          preconditions: ['hierarchy']
        }),
        new patron.Argument({
          name: 'cashRequired',
          key: 'cashRequired',
          type: 'currency',
          example: '500'
        })
      ]
    });
  }

  async run(msg, args, sender) {
    await db.ranks.upsertRank(args.role.id, msg.guild.id, 'cashRequired', args.cashRequired);

    return sender.reply('You have successfully added the rank role ' + args.role + ' with a cash required amount of ' + USD(args.cashRequired) + '.');
  }
}

module.exports = new AddRank();
