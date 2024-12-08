/* 
    Program name: patient-registration-form.js
    Author: Immanuel Prince
    Date created: 8-12-2024
    Date last edited: 8-12-2024
    Version: 1.0
    Description: Javascript for MIS 7375 Homework - Patient Registration Form. Validate data on the fly from a form
*/

// Define the date of inception as a Date object
const timeOfInception = new Date("1996-03-13");
// Get the current date
const today = new Date();
// Format the current date as MM-DD-YY
const formattedLocalDate = `${String(today.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(today.getDate()).padStart(2, "0")}-${String(
  today.getFullYear()
).slice(-2)}`;

// Update the HTML element with ID 'dateToday' to display the formatted date
document.getElementById("dateToday").innerHTML = formattedLocalDate;
// Calculate the number of days since the date of inception and update the HTML element with ID 'timeActive'
document.getElementById("timeActive").innerHTML = Math.ceil(
  (today.getTime() - timeOfInception.getTime()) / (1000 * 60 * 60 * 24)
);

const formElements = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 30,
    pattern: /^[A-Za-z'\- ]{2,30}$/,
    title:
      "First Name: Minimum 2 characters; only letters, spaces, &quot;-&quot; and ' allowed.",
  },
  middleName: {
    required: false,
    maxLength: 1,
    pattern: /^[A-Za-z]{1}$/,
    title: "Middle Initial: 1 character; only letters.",
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 30,
    pattern: /^[A-Za-z2-5'\- ]{2,30}$/,
    title:
      "Last Name: Minimum 2 characters; only letters, numbers 2 to 5, spaces, &quot;-&quot; and ' allowed.",
  },
  dob: {
    required: true,
    title: "Date of birth is required.",
    validate: (value) => {
      const currentDate = new Date();
      const maxDate = new Date(
        currentDate.getFullYear() - 120,
        currentDate.getMonth(),
        currentDate.getDate()
      );

      // Parse the input date
      const parsedDate = new Date(value);

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        return { isValid: false, message: "A valid Date of birth is required" };
      }

      // Check for future dates
      if (parsedDate > currentDate) {
        return { isValid: false, message: "Date cannot be in the future." };
      }

      // Check for dates older than 120 years
      if (parsedDate < maxDate) {
        return {
          isValid: false,
          message: "Date cannot be more than 120 years ago.",
        };
      }
      return {
        isValid: true,
      };
    },
  },
  gender: {
    required: true,
    title: "Gender selection is required.",
  },
  address: {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: /^[A-Za-z0-9,'\- ]{2,30}$/,
    title:
      "Address: Minimum 10 characters; only letters, numbers, spaces, &quot;-&quot;, and ' allowed.",
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 30,
    pattern: /^[A-Za-z'\- ]{2,30}$/,
    title:
      "City: Minimum 2 characters; only letters, spaces, &quot;-&quot; and ' allowed.",
  },
  state: {
    required: true,
    title: "State selection is required.",
  },
  zip: {
    required: true,
    pattern: /^\d{5}(-\d{4})?$/, // US ZIP Code format
    title: "ZIP code must be a valid 5-digit number.",
    fix: (value) => {
      let cleanedValue = value.replace(/[^0-9-]/g, ""); // Remove non-numeric and non-dash characters
      if (cleanedValue.length > 5) {
        cleanedValue = cleanedValue.slice(0, 5);
      }
      return cleanedValue || value;
    },
  },
  phone: {
    required: true,
    maxLength: 14,
    minLength: 10,
    pattern: /^\d{3}-\d{3}-\d{4}$/,
    title: "Phone number must be in the format xxx-xxx-xxxx.",
  },
  email: {
    required: true,
    maxLength: 30,
    pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/,
    title:
      "Email must be in the format 'name@domain.tld'; lowercase letters, &quot;.&quot;, &quot;+&quot;, &quot;-&quot; allowed. No spaces.",
  },
  ssn: {
    required: true,
    maxLength: 30,
    title: "Social Security Number is required.",
  },
  emergencyContact: {
    required: false,
    minLength: 2,
    maxLength: 30,
    title: "Emergency contact is optional.",
  },
  emergencyName: {
    required: false,
    title: "Emergency name is optional.",
  },
  emergencyPhone: {
    required: false,
    maxLength: 14,
    minLength: 10,
    pattern: /^\d{3}-\d{3}-\d{4}$/,
    title: "Emergency phone number must be in the format xxx-xxx-xxxx.",
  },
  insurance: {
    required: true,
    title: "Insurance information is required.",
  },
  insuranceProvider: {
    required: false,
    title: "Insurance provider is optional.",
  },
  policyNumber: {
    required: false,
    title: "Policy number is optional.",
  },
  medicalHistory: {
    required: false,
    title: "Medical history is optional.",
  },
  allergies: {
    required: false,
    title: "Allergies information is optional.",
  },
  chickenPox: {
    required: false,
    title: "Chicken Pox checkbox is optional.",
  },
  measles: {
    required: false,
    title: "Measles checkbox is optional.",
  },
  covid: {
    required: false,
    title: "Covid-19 checkbox is optional.",
  },
  smallPox: {
    required: false,
    title: "Small Pox checkbox is optional.",
  },
  tetanus: {
    required: false,
    title: "Tetanus checkbox is optional.",
  },
  visitReason: {
    required: false,
    title: "Visit reason is optional.",
  },
  feeling: {
    required: false,
    title: "Feeling information is optional.",
  },
  userId: {
    required: true,
    maxLength: 30,
    pattern: /^[A-Za-z][A-Za-z0-9_-]{4,29}$/,
    title: "Pick a unique username (5-30 characters, starting with a letter).",
  },
  password: {
    required: true,
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    title:
      "Password must be 8-30 characters, include at least 1 uppercase letter, 1 number, and 1 special character.",
  },
  matchPassword: {
    required: true,
    title: "Passwords must match",
    validate: () => {
      const password = document.getElementById("password").value;
      const userId = document.getElementById("userId").value;
      if (password && userId == password) {
        return { isValid: false, message: "Passwords must not match userId" };
      }
      const matchPassword = document.getElementById("matchPassword").value;
      const isValid = password == matchPassword;
      return { isValid, message: "Passwords must match" };
    },
  },
  consent: {
    required: true,
    title: "Consent is required to proceed",
    validate: () => {
      const consent = document.getElementById("consent").value;
      // const reviewConsent = document.getElementById("reviewConsent").value;
      return {
        isValid: consent,
        message: "Consent is required to proceed",
      };
    },
  },
};

let slideIndex = 1;
let autoRotate; // Variable to store the interval ID
let isPaused = false; // Tracks whether auto-rotation is paused
let mouseOutTimeout; // Tracks the timeout for slide change on mouse out

showSlides(slideIndex);
startAutoRotate(); // Start automatic rotation

function plusSlides(n) {
  showSlides((slideIndex += n));
  resetAutoRotate(); // Restart auto-rotation on manual slide change
}

function currentSlide(n) {
  showSlides((slideIndex = n));
  resetAutoRotate(); // Restart auto-rotation on manual slide change
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if (slides?.[slideIndex - 1]?.style?.display) {
    slides[slideIndex - 1].style.display = "block";
  }
}

// Function to automatically rotate slides
function startAutoRotate() {
  autoRotate = setInterval(() => {
    if (!isPaused) {
      plusSlides(1); // Move to the next slide
    }
  }, 5000); // Rotate every 5 seconds
}

// Function to pause auto-rotation
function pauseAutoRotate() {
  isPaused = true;
  clearTimeout(mouseOutTimeout); // Clear any pending slide change timeout
}

// Function to resume auto-rotation
function resumeAutoRotate() {
  isPaused = false;
}

// Function to reset auto-rotation (restart timer)
function resetAutoRotate() {
  clearInterval(autoRotate);
  startAutoRotate();
}

// Add hover and mouseout events for slideshow container
const slideshowContainer = document.querySelector(".slideshow-container");

slideshowContainer.addEventListener("mouseenter", () => {
  pauseAutoRotate(); // Pause auto-rotation when hovering
  console.log("Hover detected. Auto-rotation paused.");
});

slideshowContainer.addEventListener("mouseleave", () => {
  // Delay changing slides by 5 seconds after mouse leaves
  mouseOutTimeout = setTimeout(() => {
    resumeAutoRotate();
    console.log("Mouse left. Auto-rotation resumed after 5 seconds.");
  }, 5000);
});

// Function to toggle Emergency Contact fields
function toggleEmergencyContact(show) {
  var emergencyContactFields = document.getElementById(
    "emergencyContactFields"
  );
  if (show) {
    emergencyContactFields.style.display = "table";
  } else {
    emergencyContactFields.style.display = "none";
  }
}

// Function to toggle Insurance fields
function toggleInsurance(show) {
  var insuranceFields = document.getElementById("insuranceFields");
  if (show) {
    insuranceFields.style.display = "table";
  } else {
    insuranceFields.style.display = "none";
  }
}

// Select all inputs with the class "phone"
const phoneInputs = document.querySelectorAll(".phone");

// Attach event listener to each phone input
phoneInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
    const formattedValue = formatPhoneNumber(value);
    e.target.value = formattedValue;
  });
});

function formatPhoneNumber(value) {
  if (!value) return value;
  const phoneNumberLength = value.length;
  if (phoneNumberLength < 4) return value;
  if (phoneNumberLength < 7) {
    return `(${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
}

const ssnInput = document.getElementById("ssn");
function formatSSN(value) {
  if (!value) return value;
  const SSNLength = value.length;
  if (SSNLength < 4) return value;
  if (SSNLength < 7) {
    return `(${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  return `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
}

ssnInput.addEventListener("input", (e) => {
  const value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
  const formattedValue = formatSSN(value);
  e.target.value = formattedValue;
});

// validate the date range
// for birthdays, don't allow dates in the future or more than 120 years ago. For move in, or travel dates, do not allow dates in the past.

const form = document.getElementById("register");

const resetButton = document.getElementById("resetButton");
const reviewButton = document.getElementById("reviewButton");
const submitButton = document.getElementById("submitButton");
const consentCheck = document.getElementById("consent");
const reviewConsent = document.getElementById("reviewConsent");
const consentDiv = document.getElementById("consentDiv");

const reviewModal = document.getElementById("reviewModal");

resetButton.addEventListener("click", function (event) {
  // Prompt the user with a confirmation dialog
  const userConfirmed = confirm(
    "Are you sure you want to clear data and start over?"
  );

  // If the user confirms, reset the form
  if (userConfirmed) {
    document.register.reset();
  } else {
    // Prevent the form from resetting if the user cancels
    event.preventDefault();
  }
});

// When the user clicks on the button, open the modal
reviewButton.addEventListener("click", function () {
  showReviewValidation();
});

// Utility functions for cookie management
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return value;
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  localStorage.removeItem("formElements");
}
const firstNameField = document.getElementById("firstName");
const newUserButton = document.getElementById("reset-cookie");
newUserButton.addEventListener("click", (event) => {
  firstNameField.value = "";
  document.register.reset();
  // If no cookie, display no welcome message
  welcomeSectionDiv.classList.add("d-none");
});

const saveUser = (firstNameInput) => {
  // Save the first name in a cookie
  console.log("firstNameInput", firstNameInput);
  setCookie("firstName", firstNameInput, 2); // Expiry set to 48 hours
  const formElements = getFormElements();
  if (formElements.length) {
    localStorage.setItem("formElements", JSON.stringify(formElements));
  }
};

const rememberMeCheck = document.getElementById("rememberMe");

rememberMeCheck.addEventListener("click", function () {
  const rememberMeChecked = document.getElementById("rememberMe").checked;

  if (rememberMeChecked) {
    saveUser(firstNameInput);
  } else {
    // If Remember Me is unchecked, delete the cookie
    deleteCookie("firstName");
  }
});

const rememberMeChecked = rememberMeCheck.checked;

const reviewSubmitButton = document.getElementById("reviewSubmitButton");

reviewSubmitButton.addEventListener("click", function (e) {
  const isValid = getFormElements().every(({ isValid } = {}) => isValid);
  if (isValid) {
    const firstNameInput = document.getElementById("firstName").value;
    const rememberMeChecked = document.getElementById("rememberMe").checked;

    if (rememberMeChecked) {
      // Save the first name in a cookie
      setCookie("firstName", firstNameInput, 2); // Expiry set to 48 hours
      // TODO: Remove these once you understand what is happening
      // alert(`Hello ${firstNameInput}! Your name has been saved for 48 hours.`);
    } else {
      // If Remember Me is unchecked, delete the cookie
      deleteCookie("firstName");
      // TODO: Remove these once you understand what is happening
      // alert(`Hello ${firstNameInput}! Your name will not be remembered.`);
    }
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        "6LfjrJUqAAAAAJd0UECLz_HgcFV7Q9l2j1pcNBf2",
        { action: "REVIEW_SUBMIT" }
      );
      document.getElementById("token").value = token;
      document.register.token = token;
      document.register.submit();
    });
  } else {
    showReview();
  }
});

submitButton.addEventListener("click", function (e) {
  const isValid = getFormElements().every(({ isValid } = {}) => isValid);
  if (isValid && consentCheck.checked) {
    const firstNameInput = document.getElementById("firstName").value;
    const rememberMeChecked = rememberMeCheck.checked;

    if (rememberMeChecked) {
      saveUser(firstNameInput);
    } else {
      // If Remember Me is unchecked, delete the cookie
      deleteCookie("firstName");
    }
    e.preventDefault();
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        "6LfjrJUqAAAAAJd0UECLz_HgcFV7Q9l2j1pcNBf2",
        { action: "SUBMIT" }
      );
      document.getElementById("token").value = token;
      document.register.token = token;
      document.register.submit();
    });
  } else {
    showReviewValidation();
  }
});

// Get the <span> element that closes the modal
const close = document.getElementById("close");

const validations = {
  default: () => {},
};

const fix = (elementName, value) => {
  const fieldConfig = formElements[elementName];
  if (fieldConfig.fix) {
    return fieldConfig.fix(value);
  }
  return value;
};

const validate = (elementName, value, label) => {
  const fieldConfig = formElements[elementName];

  // Check if the field is defined in the config
  if (!fieldConfig) {
    console.error(`No validation rules found for ${elementName}`);
    return { isValid: true }; // No validation required for unknown fields
  }

  const { required, pattern, title, minLength, maxLength } = fieldConfig;

  // Validate
  if (fieldConfig.validate) {
    const customValidation = fieldConfig.validate(value);
    if (customValidation) return customValidation;
  }

  if (required && (!value || value.trim() === "")) {
    return {
      isValid: false,
      message: title || `${label ? `The ${label}` : "This"} field is required.`,
    };
  }

  if (value && value.length) {
    if (minLength && value.length < minLength) {
      return {
        isValid: false,
        message: `${
          label ? `The ${label}` : "This"
        } field should be at least ${minLength} characters in length`,
      };
    }

    if (maxLength && value.length > maxLength) {
      return {
        isValid: false,
        message: `${
          label ? `The ${label}` : "This"
        } field should be at most ${maxLength} characters in length`,
      };
    }
  }
  // Check for pattern validation
  if (value && pattern && !pattern.test(value)) {
    return { isValid: false, message: title || "Invalid input." };
  }

  // If all validations pass
  return { isValid: true };
};

function getFormElements() {
  const fieldRows = [];

  Object.keys(formElements).forEach((elementName) => {
    const element = document.querySelector(`[name="${elementName}"]`);
    if (element) {
      let value;
      let label = elementName; // Default to element name if label isn't found

      // Check if the element is a radio button or checkbox
      if (element.type === "radio") {
        // Get the selected radio button's value
        const selectedRadio = document.querySelector(
          `input[name="${elementName}"]:checked`
        );
        console.log(selectedRadio);
        if (selectedRadio) {
          value = selectedRadio.value;
          const parentDiv = selectedRadio.closest(".question"); // or the specific parent class name

          // Find the label within the parent div
          label = parentDiv.querySelector("label");
          if (label) {
            label = label.innerText;
          }
        }
      } else if (element.type === "checkbox") {
        // If it's a checkbox, handle this differently
        value = element.checked ? "yes" : "no";
        label = element.labels[0] ? element.labels[0].innerText : label;
      } else {
        // Get the value of other types of inputs
        value = element.value;
        const associatedLabel = document.querySelector(
          `label[for="${element.id}"]`
        );
        if (associatedLabel) {
          label = associatedLabel.innerText; // Get associated label
        }
      }
      value = fix(elementName, value);
      const { isValid, message } = validate(elementName, value, label);

      // Push the label and value into fieldRows
      fieldRows.push({ name: elementName, label, value, isValid, message });
    }
  });

  return fieldRows;
}

function loadFormElements(formElementValues) {
  if (formElementValues.length) {
    formElementValues.forEach(
      ({ name, label, value, isValid, message } = {}) => {
        const element = document.querySelector(`[name="${name}"]`);
        if (element && value) {
          element.value = value;
        }
      }
    );
    updateProgressBar();
  }
}

function checkCapsLock(event) {
  const capsWarning = document.getElementById("capsWarning");
  const isCapsLock = event.getModifierState("CapsLock");
  if (isCapsLock) {
    capsWarning.style.display = "block";
  } else {
    capsWarning.style.display = "none";
  }
}

const progressBar = document.getElementById("progressBar");

// Function to update the progress bar
function updateProgressBar() {
  const startCount = 10;
  const formElements = getFormElements();
  const filledElements = formElements.filter(({ value }) => !!value);
  const filledElementsCount = Math.max(filledElements.length - startCount, 0);
  const isValid = formElements.every(({ isValid } = {}) => isValid);
  const totalElements = Object.keys(formElements).length - startCount;
  const progressPercentage = (filledElementsCount / totalElements) * 100;
  console.log(
    "filledElements.length - startCount",
    filledElements.length,
    filledElementsCount,
    progressPercentage,
    totalElements,
    Math.max(Math.round(progressPercentage), 0)
  );
  progressBar.style.width =
    filledElementsCount && isValid
      ? "100%"
      : `${Math.max(Math.round(progressPercentage), 0)}%`;
}

updateProgressBar();
// Validate and Warn the user if they do anything wrong in any of the fields AS THEY ENTER or LEAVE the field
document.querySelectorAll(".formElement").forEach((element) => {
  if (element.name && element.id) {
    const elementName = element.name;
    const validateElement = (isInFocus = false) => {
      let value;
      let label = elementName; // Default to element name if label isn't found

      // Check if the element is a radio button or checkbox
      if (element.type === "radio") {
        // Get the selected radio button's value
        const selectedRadio = document.querySelector(
          `input[name="${elementName}"]:checked`
        );
        console.log(selectedRadio);
        if (selectedRadio) {
          value = selectedRadio.value;
          const parentDiv = selectedRadio.closest(".question"); // or the specific parent class name

          // Find the label within the parent div
          label = parentDiv.querySelector("label");
          if (label) {
            label = label.innerText;
          }
        }
      } else if (element.type === "checkbox") {
        // If it's a checkbox, handle this differently
        value = element.checked ? "yes" : "no";
        label = element.labels[0] ? element.labels[0].innerText : label;
      } else {
        // Get the value of other types of inputs
        value = element.value;
        const associatedLabel = document.querySelector(
          `label[for="${element.id}"]`
        );
        if (associatedLabel) {
          label = associatedLabel.innerText; // Get associated label
        }
      }
      value = fix(elementName, value);
      const { isValid, message } = validate(elementName, value, label);
      const errorMessage = document.getElementById(`${element.id}Error`);
      if (isInFocus && formElements[elementName].title) {
        // Help display context info
        errorMessage.innerHTML = formElements[elementName].title;
        errorMessage.classList.remove("warn");
        element.classList.remove("warn-border");
      } else {
        // Remove context info/existing error
        errorMessage.innerHTML = "";
        element.classList.remove("warn-border");
        errorMessage.classList.remove("warn");
        if (!isValid && message) {
          errorMessage.classList.add("warn");
          element.classList.add("warn-border");
          errorMessage.innerHTML = message;
        }
        const firstNameInput = document.getElementById("firstName").value;
        const rememberMeChecked = document.getElementById("rememberMe").checked;
        if (rememberMeChecked) {
          console.log("rememberMe");
          saveUser(firstNameInput);
          // TODO: Remove these once you understand what is happening
          // alert(`Hello ${firstNameInput}! Your name has been saved for 48 hours.`);
        }
      }
    };
    element.addEventListener("focus", (e) => {
      element.addEventListener("keydown", checkCapsLock);
      element.addEventListener("keyup", checkCapsLock);
      validateElement(true);
    });
    element.addEventListener("blur", (e) => {
      updateProgressBar();
      const capsWarning = document.getElementById("capsWarning");
      capsWarning.style.display = "none";
      validateElement(false);
    });
  }
});

function showReviewValidation() {
  consentDiv.classList.add("d-none");
  reviewSubmitButton.classList.remove("d-none");
  reviewModal.style.display = "block";
  const formDataArray = [];

  const elementsToBeIgnored = [];
  const names = [];
  const formElements = getFormElements();
  const excludeFields = [
    "password",
    "matchPassword",
    "ssn",
    "consent",
    "visitReason",
    "medicalHistory",
  ];
  // Loop through all form elements
  const reviewRows = formElements
    .filter(
      ({ name, label, value, isValid, message } = {}) =>
        !excludeFields.includes(name) && value
    )
    .map(
      ({ label, value, isValid, message } = {}) => `<tr>
                                  <td>${label}<td>
                                  <td>${value}<td>
                                </tr>`
    );
  const reviewFields = document.getElementById("reviewFields");
  reviewFields.innerHTML = reviewRows.join("\n");

  const isValid = formElements.every(({ isValid } = {}) => isValid);
  console.log("isValid", isValid);
  if (isValid) {
    reviewSubmitButton.classList.remove("disabled");
  } else {
    reviewSubmitButton.classList.add("disabled");
  }
  console.log(formDataArray); // Output the result for testing
}

function showReview() {
  consentDiv.classList.remove("d-none");
  reviewSubmitButton.classList.add("d-none");
  reviewModal.style.display = "block";
  const formDataArray = [];

  const elementsToBeIgnored = [];
  const names = [];
  const formElements = getFormElements();
  // Loop through all form elements
  const reviewRows = formElements.map(
    ({ label, value, isValid, message } = {}) => `<tr>
                                  <td>${label}<td>
                                  <td>${value}<td>
                                  <td class="${isValid ? "pass" : "error"}">
                                    ${isValid ? "Pass" : `Error: ${message}`}
                                  </td>
                                </tr>`
  );
  const reviewFields = document.getElementById("reviewFields");
  reviewFields.innerHTML = reviewRows.join("\n");
  console.log(formDataArray); // Output the result for testing
}

consentCheck.addEventListener("click", function () {
  const isValid = getFormElements().every(({ isValid } = {}) => isValid);
  if (isValid) {
    if (this.checked) {
      submitButton.classList.remove("disabled");
    } else {
      submitButton.classList.add("disabled");
    }
    reviewSubmitButton.classList.remove("disabled");
  } else {
    this.checked = false;
    submitButton.classList.add("disabled");
    reviewSubmitButton.classList.add("disabled");
    showReview();
  }
});

reviewConsent.addEventListener("click", function () {
  const isValid = getFormElements().every(({ isValid } = {}) => isValid);
  if (isValid) {
    consentCheck.checked = true;
    reviewSubmitButton.classList.remove("disabled");
    submitButton.classList.remove("disabled");
  } else {
    reviewSubmitButton.classList.add("disabled");
    submitButton.classList.add("disabled");
  }
});

// When the user clicks on <span> (x), close the modal
close.onclick = function () {
  reviewModal.style.display = "none";
  const isValid = getFormElements().every(({ isValid } = {}) => isValid);
  if (consentCheck.checked && isValid) {
    submitButton.classList.remove("disabled");
  } else {
    submitButton.classList.add("disabled");
  }
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == reviewModal) {
    const isValid = getFormElements().every(({ isValid } = {}) => isValid);
    reviewModal.style.display = "none";
    if (consentCheck.checked && isValid) {
      submitButton.classList.remove("disabled");
    } else {
      submitButton.classList.add("disabled");
    }
  }
};

// Check for the first name cookie
const firstName = getCookie("firstName");
const welcomeSectionDiv = document.getElementById("welcome-section");
const welcomeMessageDiv = document.getElementById("welcome-message");
console.log("firstName", firstName);
if (firstName) {
  welcomeSectionDiv.classList.remove("d-none");
  firstNameField.value = firstName;
  // If the cookie exists, display a personalized welcome message
  welcomeMessageDiv.innerHTML = `<h1>Welcome back, ${firstName}!</h1>`;
  const formElementsJSONString = localStorage.getItem("formElements");
  let formElements;
  if (formElementsJSONString) {
    try {
      const formElementsJSON = JSON.parse(formElementsJSONString);
      if (Object.keys(formElementsJSON).length) {
        formElements = formElementsJSON;
      }
    } catch (e) {
      //ignore
    }
  }
  if (formElements?.length) {
    loadFormElements(formElements);
  }
} else {
  // If no cookie, display no welcome message
  welcomeSectionDiv.classList.add("d-none");
}

function updateSliderValue(sliderId) {
  const slider = document.getElementById(sliderId);
  const currentValue = slider.value;
  const spanElement = document.getElementById(`${sliderId}Value`);
  spanElement.textContent = currentValue;
}

function initializeSliders() {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    const sliderId = slider.id;
    slider.addEventListener("input", () => updateSliderValue(sliderId));
  });
}

const coll = document.getElementsByClassName("collapsible");
let ind;

for (ind = 0; ind < coll.length; ind++) {
  coll[ind].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

initializeSliders();
