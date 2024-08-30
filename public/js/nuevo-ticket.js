// Referencias HTML
const lblNuevoTicket = document.querySelector("#lblNuevoTicket");
const btnCrear = document.querySelector("button");

const socket = io();

socket.on("connect", () => {
  //   console.log("Conectado");

  // Si el servidor de socket esta conectado, lo habilito al boton
  btnCrear.disabled = false;
});

socket.on("disconnect", () => {
  // console.log('Desconectado del servidor');

  // Si el servidor de socket esta desconectado, deshabilito el boton
  btnCrear.disabled = true;
});

socket.on("ultimo-ticket", (ultimoTicket) => {
  lblNuevoTicket.innerText = "Ticket " + ultimoTicket;
});

btnCrear.addEventListener("click", () => {
  socket.emit("siguiente-ticket", null, (ticket) => {
    lblNuevoTicket.innerText = ticket;
  });
});
