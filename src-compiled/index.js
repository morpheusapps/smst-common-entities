"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var meow_1 = require("./meow");
var greeter = function (person) { return "Hello " + meow_1.meow() + " " + person + "!"; };
var name = 'Node Hero';
console.log(greeter(name));
