// Referencias HTML

const lblEscritorio = document.querySelector("h1");
const btnAtender = document.querySelector("button");
const lblTicket = document.querySelector("small");
const divAlerta = document.querySelector(".alert");
const lblPendientes = document.querySelector("#lblPendientes");

// Leer la url
const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
  throw new Error("El escritorio es obligatorio");
}

const escritorio = searchParams.get("escritorio");
lblEscritorio.innerText = escritorio;

const socket = io();

divAlerta.style.display = "none";

socket.on("connect", () => {
  //   console.log("Conectado");

  // Si el servidor de socket esta conectado, lo habilito al boton
  btnAtender.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  // Si el servidor de socket esta desconectado, deshabilito el boton
  btnAtender.disabled = true;
});

socket.on("tickets-pendientes", (ticketsPendientes) => {
  if (ticketsPendientes === 0) {
    lblPendientes.style.display = "none";
  } else {
    lblPendientes.style.display = "";
    lblPendientes.innerText = ticketsPendientes;
  }
});

btnAtender.addEventListener("click", () => {
  socket.emit("atender-ticket", { escritorio }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = "Nadie";
      return (divAlerta.style.display = "");
    }

    lblTicket.innerText = `Ticket ${ticket.numero}`;
  });

  //   socket.emit("siguiente-ticket", null, (ticket) => {
  //     lblNuevoTicket.innerText = ticket;
  //   });
});
