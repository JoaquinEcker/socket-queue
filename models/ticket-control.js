const path = require("path");
const fs = require("fs");

class Ticket {
  constructor(numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor() {
    this.ultimo = 0;
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];

    this.init();
  }

  get toJson() {
    return {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4,
    };
  }

  init() {
    const { hoy, tickets, ultimos4, ultimo } = require("../db/data.json");

    // chequeo que el dia que esta en la db es el de hoy, y puedo inicializar las variables-propiedades con lo que está ahi
    if (hoy === this.hoy) {
      this.tickets = tickets;
      this.ultimos4 = ultimos4;
      this.ultimo = ultimo;
    } else {
      // Es otro dia y hay que guardarlos, y reinicializar la db, vacio todo, menos la fecha, se setea con las propsdel constructor
      this.guardarDB();
    }
  }

  guardarDB() {
    const dbPath = path.join(__dirname, "../db/data.json");
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  siguiente() {
    this.ultimo += 1;
    const ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.guardarDB();

    return "Ticket " + ticket.numero;
  }

  atenderTicket(escritorio) {
    // Si no tenemos tickets
    if (this.tickets.length === 0) {
      return null;
    }

    const ticket = this.tickets.shift(); // Para tomar el primer ticket de la lista

    ticket.escritorio = escritorio; // Este es el ticket que tengo que atender y le voy a añadir un escritorio

    // Tengo que agregarlo a la lista de los que se ven en pantalla proximos (se agrega al principio)
    this.ultimos4.unshift(ticket);

    // Tengo que verificar que ultimos4 siempre sean 4, slice para sacar de la ultima posicion del array (-1) y solo sacar una posicion(1)

    if (this.ultimos4.length > 4) {
      this.ultimos4.splice(-1, 1);
    }

    this.guardarDB();

    return ticket;
  }
}

module.exports = TicketControl;
