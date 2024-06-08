"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserType = exports.validateOccupation = exports.validateGender = exports.validateMobile = exports.validateField = exports.validateEmail = exports.validateDateOfBirth = void 0;
const validateField = (field, fieldName, minLength, maxLength) => {
    if (!field || field.trim() === "") {
        throw new Error(`${fieldName} is required`);
    }
    if (field.trim().length < minLength || field.trim().length > maxLength) {
        throw new Error(`${fieldName} must be between ${minLength} and ${maxLength} characters`);
    }
};
exports.validateField = validateField;
const validateMobile = (mobile) => {
    if (!mobile.startsWith("01")) {
        throw new Error("mobile must start with '01'");
    }
    if (mobile.length !== 11) {
        throw new Error("mobile number must be 11 digits");
    }
    if (isNaN(Number(mobile))) {
        throw new Error("mobile must be a number");
    }
    if (/[^\d]/.test(mobile)) {
        throw new Error("Mobile must contain only digits");
    }
};
exports.validateMobile = validateMobile;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }
};
exports.validateEmail = validateEmail;
const validateDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    const currentDate = new Date();
    const maxAge = 60;
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date of birth");
    }
    if (date > currentDate) {
        throw new Error("Date of birth cannot be in the future");
    }
    const ageInYears = currentDate.getFullYear() - date.getFullYear();
    if (ageInYears > maxAge) {
        throw new Error(`Date of birth cannot be more than ${maxAge} years ago`);
    }
};
exports.validateDateOfBirth = validateDateOfBirth;
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender || (Gender = {}));
const validateGender = (gender) => {
    if (!Object.values(Gender).includes(gender.toLowerCase())) {
        throw new Error("Invalid gender");
    }
};
exports.validateGender = validateGender;
var Occupation;
(function (Occupation) {
    Occupation["Student"] = "student";
    Occupation["Corporate"] = "corporate";
})(Occupation || (Occupation = {}));
const validateOccupation = (occupation) => {
    if (!Object.values(Occupation).includes(occupation.toLowerCase())) {
        throw new Error("Invalid occupation");
    }
};
exports.validateOccupation = validateOccupation;
var UserType;
(function (UserType) {
    UserType["User"] = "user";
    UserType["Share"] = "share";
})(UserType || (UserType = {}));
const validateUserType = (userType) => {
    if (!Object.values(UserType).includes(userType.toLowerCase())) {
        throw new Error("Invalid user type");
    }
};
exports.validateUserType = validateUserType;
