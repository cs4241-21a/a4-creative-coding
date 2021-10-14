"use strict";

const submit = function(e) {
  // prevent default form action from being carried out
  e.preventDefault();
  return false;
};

window.onload = function() {
  //enable submit button
  const button = document.querySelector("button");
  button.onclick = submit;
};
