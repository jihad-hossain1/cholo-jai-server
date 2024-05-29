"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Occupation = exports.Role = exports.Gender = void 0;
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
var Role;
(function (Role) {
    Role["traveler"] = "traveler";
    Role["sharer"] = "sharer";
})(Role || (exports.Role = Role = {}));
var Occupation;
(function (Occupation) {
    Occupation["student"] = "student";
    Occupation["faculty"] = "faculty";
})(Occupation || (exports.Occupation = Occupation = {}));
