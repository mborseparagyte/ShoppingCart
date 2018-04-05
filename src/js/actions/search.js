import Reflux from "reflux-core";

const Actions = Reflux.createActions([
  "loadEvents",
  "loadEvent",
  "next",
  "prev",
  "jumpTo",
  "reset"
]);

export default Actions;
