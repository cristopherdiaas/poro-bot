const createTicket = require('../../utils/createTicket');

module.exports = {
  customId: 'ticket_suporte',
  async execute(interaction) {
    await createTicket(interaction, 'suporte');
  }
};

module.exports = {
  customId: 'ticket_denuncia',
  async execute(interaction) {
    await createTicket(interaction, 'denuncia');
  }
};

module.exports = {
  customId: 'ticket_parceria',
  async execute(interaction) {
    await createTicket(interaction, 'parceria');
  }
};

module.exports = {
  customId: 'ticket_sugestao',
  async execute(interaction) {
    await createTicket(interaction, 'sugestao');
  }
};