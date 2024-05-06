

const validateField = (field: string, fieldName: string, minLength: number, maxLength: number): void => {
  if (!field || field.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
  if (field.trim().length < minLength || field.trim().length > maxLength) {
    throw new Error(`${fieldName} must be between ${minLength} and ${maxLength} characters`);
  }
};

const validateMobile = (mobile: string): void => {
  if (!mobile.startsWith("01")) {
    throw new Error("mobile must start with '01'");
  }
  if (mobile.length !== 11 ) {
    throw new Error("mobile number must be 11 digits");
    } 
    if (isNaN(Number(mobile))) {
        throw new Error("mobile must be a number");
    }
};

const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
    }
};

const validateDateOfBirth = (dateOfBirth: string): void => {
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


enum Gender {
  Male = "male",
  Female = "female"
}

const validateGender = (gender: any): void => {
  if (!Object.values(Gender).includes(gender.toLowerCase())) {
    throw new Error("Invalid gender");
  }
};

enum Occupation {
  Student = "student",
  Corporate = "corporate",
}

const validateOccupation = (occupation: any): void => {
  if (!Object.values(Occupation).includes(occupation.toLowerCase())) {
    throw new Error("Invalid occupation");
  }
};


enum UserType {
    User = "user",
    Share = "share"
}
const validateUserType = (userType: any): void => {
   if (!Object.values(UserType).includes(userType.toLowerCase())) {
    throw new Error("Invalid user type");
  }
}

export { validateDateOfBirth, validateEmail, validateField, validateMobile,validateGender,validateOccupation,validateUserType };