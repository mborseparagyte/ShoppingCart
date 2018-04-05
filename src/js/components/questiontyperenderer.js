import React from "react";
import Text from "./text.js";
import Country from "./country.js";
import DateComponent from "./date.js";
import Checkbox from "./checkbox.js";
import Dropdown from "./dropdown.js";
import Radio from "./radio.js";
const elementRequireMap = {
  text: Text,
  country: Country,
  date: DateComponent,
  checkbox: Checkbox,
  dropdown: Dropdown,
  radio: Radio
};

function NonExistentRenderer(props) {
  return <div>No renderer found for {props.type}.</div>;
}

let PageItemRenderer = function(type) {
  let componentClass = elementRequireMap[type];
  if (componentClass == null) {
    return NonExistentRenderer;
  }

  return componentClass;
};

export default PageItemRenderer;
