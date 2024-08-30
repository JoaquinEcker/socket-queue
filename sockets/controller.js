const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  // Cuando un cliente se conecta
  socket.emit("ultimo-ticket", ticketControl.ultimo);
  socket.emit("estado-actual", ticketControl.ultimos4);
  socket.emit("tickets-pendientes", ticketControl.tickets.length);

  socket.on("siguiente-ticket", (payload, callback) => {
    const siguiente = ticketControl.siguiente();

    callback(siguiente);

    // Notificar que hay un nuevo ticket pendiente de asignar
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);
  });

  socket.on("atender-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "El escritorio es obligatorio",
      });
    }

    const ticket = ticketControl.atenderTicket(escritorio);

    //TODO: Notificar cambio en los utlimos 4, a todas las pantallas, por eso el broadcast
    socket.broadcast.emit("estado-actual", ticketControl.ultimos4);
    // Notificar de los tickets pendientes a todos los escritorios
    socket.emit("tickets-pendientes", ticketControl.tickets.length);
    socket.broadcast.emit("tickets-pendientes", ticketControl.tickets.length);

    if (!ticket) {
      callback({
        ok: false,
        msg: "Ya no hay tickets pendientes",
      });
    } else {
      callback({
        ok: true,
        ticket,
      });
    }
  });
};

module.exports = {
  socketController,
};
