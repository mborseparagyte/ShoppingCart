import Reflux from "reflux-core";

const Actions = Reflux.createActions([
  "loadEvents",
  "loadEvent",
  "setResponse",
  "setTicketInfo",
  "validateStep",
  "setCardtInfo",
  "processPayment",
  "finish",
  "next",
  "prev",
  "jumpTo",
  "search",
  "reset"
]);

export default Actions;
