/* 
    Program name: extracredit.js
    Author: Immanuel Prince
    Date created: 8-12-2024
    Date last edited: 8-12-2024
    Version: 1.0
    Description: Javascript for MIS 7375 Homework - Patient Registration Form. Validate data on the fly from a form
*/

document.addEventListener("DOMContentLoaded", () => {
  const timeOfInception = new Date("1996-03-13");
  const today = new Date();

  // Format current date as MM-DD-YY
  const formattedLocalDate = `${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}-${String(
    today.getFullYear()
  ).slice(-2)}`;
  document.getElementById("dateToday").textContent = formattedLocalDate;
  document.getElementById("timeActive").textContent = Math.ceil(
    (today - timeOfInception) / (1000 * 60 * 60 * 24)
  );

  // Validation rules
  const formElementsConfig = {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 30,
      pattern: /^[A-Za-z'\- ]{2,30}$/,
      title: "First Name: 2+ letters, spaces, '-' and ' allowed.",
    },
    middleName: {
      required: false,
      maxLength: 1,
      pattern: /^[A-Za-z]?$/,
      title: "Middle Initial: 1 letter optional",
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 30,
      pattern: /^[A-Za-z0-9'\- ]{2,30}$/,
      title: "Last Name: 2+ chars; letters, digits, '-' and ' allowed.",
    },
    dob: {
      required: true,
      title: "Date of birth is required",
      validate: (value) => validateDOB(value),
    },
    gender: { required: true, title: "Gender selection required" },
    address: {
      required: true,
      minLength: 2,
      maxLength: 30,
      pattern: /^[A-Za-z0-9,'\- ]{2,30}$/,
      title: "Address: 2+ chars; letters,numbers,space allowed.",
    },
    city: {
      required: true,
      minLength: 2,
      maxLength: 30,
      pattern: /^[A-Za-z'\- ]{2,30}$/,
    },
    state: { required: true },
    zip: {
      required: true,
      pattern: /^\d{5}(-\d{4})?$/,
      title: "ZIP must be 5 digits",
    },
    phone: {
      required: true,
      pattern: /^\(\d{3}\)-\d{3}-\d{4}$/,
      title: "Phone: (XXX)-XXX-XXXX",
    },
    email: {
      required: true,
      pattern: /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,5}$/,
    },
    ssn: { required: true, maxLength: 30 },
    emergencyContact: { required: false },
    emergencyName: { required: false },
    emergencyPhone: { required: false, pattern: /^\(\d{3}\)-\d{3}-\d{4}$/ },
    insurance: { required: true },
    insuranceProvider: { required: false },
    policyNumber: { required: false },
    medicalHistory: { required: false },
    allergies: { required: false },
    chickenPox: { required: false },
    measles: { required: false },
    covid: { required: false },
    smallPox: { required: false },
    tetanus: { required: false },
    visitReason: { required: false },
    feeling: { required: false },
    userId: {
      required: true,
      minLength: 5,
      maxLength: 30,
      pattern: /^[A-Za-z][A-Za-z0-9_-]{4,29}$/,
    },
    password: {
      required: true,
      pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,30}$/,
    },
    matchPassword: { required: true, validate: matchPasswords },
    consent: { required: true, validate: checkConsent },
  };

  const form = document.getElementById("register");
  const resetButton = document.getElementById("resetButton");
  const reviewButton = document.getElementById("reviewButton");
  const submitButton = document.getElementById("submitButton");
  const consentCheck = document.getElementById("consent");
  const reviewConsent = document.getElementById("reviewConsent");
  const consentDiv = document.getElementById("consentDiv");
  const reviewModal = document.getElementById("reviewModal");
  const reviewSubmitButton = document.getElementById("reviewSubmitButton");
  const rememberMeCheck = document.getElementById("rememberMe");
  const firstNameField = document.getElementById("firstName");
  const newUserButton = document.getElementById("reset-cookie");
  const progressBar = document.getElementById("progressBar");
  const capsWarning = document.getElementById("capsWarning");

  // Cookie utilities
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }
  function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
      const [k, v] = cookie.split("=");
      if (k === name) return v;
    }
    return null;
  }
  function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu,01 Jan 1970 00:00:00 UTC;path=/`;
    localStorage.removeItem("formElements");
  }

  // Restore user if remembered
  const firstName = getCookie("firstName");
  const welcomeSection = document.getElementById("welcome-section");
  const welcomeMessage = document.getElementById("welcome-message");

  if (firstName) {
    welcomeSection.classList.remove("d-none");
    firstNameField.value = firstName;
    welcomeMessage.innerHTML = `<h2>Welcome back, ${firstName}!</h2>`;
    const savedData = localStorage.getItem("formElements");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed)) loadFormElements(parsed);
      } catch (e) {}
    }
  }

  newUserButton.addEventListener("click", () => {
    firstNameField.value = "";
    form.reset();
    welcomeSection.classList.add("d-none");
    deleteCookie("firstName");
  });

  // Remember Me
  rememberMeCheck.addEventListener("click", () => {
    if (rememberMeCheck.checked) {
      saveUser(firstNameField.value);
    } else {
      deleteCookie("firstName");
    }
  });

  function saveUser(fname) {
    setCookie("firstName", fname, 2);
    const elems = getFormElements();
    if (elems.length)
      localStorage.setItem("formElements", JSON.stringify(elems));
  }

  // Validation functions
  function validateDOB(value) {
    const currentDate = new Date();
    const maxDate = new Date(
      currentDate.getFullYear() - 120,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const parsedDate = new Date(value);
    if (isNaN(parsedDate.getTime()))
      return { isValid: false, message: "A valid Date of birth is required" };
    if (parsedDate > currentDate)
      return { isValid: false, message: "DOB cannot be in the future" };
    if (parsedDate < maxDate)
      return {
        isValid: false,
        message: "DOB cannot be more than 120 years ago",
      };
    return { isValid: true };
  }

  function matchPasswords() {
    const password = document.getElementById("password").value;
    const match = document.getElementById("matchPassword").value;
    const userIdVal = document.getElementById("userId").value;
    if (password && userIdVal === password)
      return { isValid: false, message: "Passwords must not match userId" };
    return { isValid: password === match, message: "Passwords must match" };
  }

  function checkConsent() {
    return { isValid: consentCheck.checked, message: "Consent is required" };
  }

  function fixValue(name, value) {
    const conf = formElementsConfig[name];
    if (conf && conf.fix) {
      return conf.fix(value);
    }
    return value;
  }

  function validateField(name, value, label) {
    const config = formElementsConfig[name];
    if (!config) return { isValid: true };

    if (config.validate) {
      const custom = config.validate(value);
      if (custom) return custom;
    }

    if (config.required && (!value || value.trim() === "")) {
      return {
        isValid: false,
        message: config.title || `${label || "Field"} is required`,
      };
    }

    if (value && config.minLength && value.length < config.minLength) {
      return {
        isValid: false,
        message: `${label || "Field"} must be at least ${
          config.minLength
        } characters`,
      };
    }

    if (value && config.maxLength && value.length > config.maxLength) {
      return {
        isValid: false,
        message: `${label || "Field"} must be less than ${
          config.maxLength + 1
        } characters`,
      };
    }

    if (value && config.pattern && !config.pattern.test(value)) {
      return { isValid: false, message: config.title || "Invalid input" };
    }

    return { isValid: true };
  }

  function getFormElements() {
    const elementsData = [];
    for (const name in formElementsConfig) {
      const elem = document.querySelector(`[name="${name}"]`);
      if (!elem) continue;
      let value;
      let label = name;
      if (elem.type === "radio") {
        const selected = document.querySelector(
          `input[name="${name}"]:checked`
        );
        if (selected) {
          value = selected.value;
          const parentQ = selected.closest(".question-label");
          if (parentQ) label = parentQ.innerText;
        }
      } else if (elem.type === "checkbox") {
        value = elem.checked ? "yes" : "no";
        if (elem.labels && elem.labels[0]) label = elem.labels[0].innerText;
      } else {
        value = elem.value;
        const associatedLabel = document.querySelector(
          `label[for="${elem.id}"]`
        );
        if (associatedLabel) label = associatedLabel.innerText;
      }
      value = fixValue(name, value);
      const { isValid, message } = validateField(name, value, label);
      elementsData.push({ name, label, value, isValid, message });
    }
    return elementsData;
  }

  function loadFormElements(data) {
    data.forEach(({ name, value }) => {
      const element = document.querySelector(`[name="${name}"]`);
      if (element && value) element.value = value;
    });
    updateProgressBar();
  }

  // Update Progress Bar
  function updateProgressBar() {
    const elems = getFormElements();
    const total = Object.keys(formElementsConfig).length;
    // Count required fields filled and valid
    const requiredKeys = Object.keys(formElementsConfig).filter(
      (k) => formElementsConfig[k].required
    );
    const requiredFilled = elems.filter((e) => {
      const conf = formElementsConfig[e.name];
      return (
        conf && conf.required && e.isValid && e.value && e.value.trim() !== ""
      );
    }).length;
    const percentage = (requiredFilled / requiredKeys.length) * 100;
    progressBar.style.width = `${Math.round(percentage)}%`;
  }

  // On input focus/blur
  document.querySelectorAll(".formElement").forEach((el) => {
    const name = el.name;
    el.addEventListener("focus", () => {
      el.addEventListener("keydown", checkCapsLock);
      el.addEventListener("keyup", checkCapsLock);
      showFieldInfo(name, true);
    });
    el.addEventListener("blur", () => {
      checkCapsLockOff();
      showFieldInfo(name, false);
      updateProgressBar();
      if (rememberMeCheck.checked) saveUser(firstNameField.value);
    });
  });

  function showFieldInfo(name, isFocus) {
    const element = document.querySelector(`[name="${name}"]`);
    if (!element) return;
    const errorElem = document.getElementById(`${element.id}Error`);
    const conf = formElementsConfig[name];
    const value =
      element.type === "checkbox"
        ? element.checked
          ? "yes"
          : "no"
        : element.value;
    const { isValid, message } = validateField(
      name,
      value,
      element.labels?.[0]?.innerText || name
    );

    if (isFocus && conf.title) {
      errorElem.innerHTML = conf.title;
      errorElem.classList.remove("warn");
      element.classList.remove("warn-border");
    } else {
      errorElem.innerHTML = "";
      element.classList.remove("warn-border");
      errorElem.classList.remove("warn");
      if (!isValid && message) {
        errorElem.innerHTML = message;
        errorElem.classList.add("warn");
        element.classList.add("warn-border");
      }
    }
  }

  // Caps lock detection
  function checkCapsLock(e) {
    capsWarning.style.display = e.getModifierState("CapsLock")
      ? "block"
      : "none";
  }
  function checkCapsLockOff() {
    capsWarning.style.display = "none";
  }

  // Toggle emergency and insurance fields visibility
  document
    .querySelectorAll('input[name="emergencyContact"]')
    .forEach((radio) => {
      radio.addEventListener("click", () => {
        document.getElementById("emergencyContactFields").style.display =
          document.querySelector('input[name="emergencyContact"]:checked')
            .value === "yes"
            ? "grid"
            : "none";
      });
    });
  document.querySelectorAll('input[name="insurance"]').forEach((radio) => {
    radio.addEventListener("click", () => {
      document.getElementById("insuranceFields").style.display =
        document.querySelector('input[name="insurance"]:checked').value ===
        "yes"
          ? "grid"
          : "none";
    });
  });

  // Format phone and SSN inputs
  document.querySelectorAll(".phone").forEach((input) => {
    input.addEventListener("input", (e) => {
      const val = e.target.value.replace(/\D/g, "");
      e.target.value = formatPhoneNumber(val);
    });
  });

  const ssnInput = document.getElementById("ssn");
  ssnInput.addEventListener("input", (e) => {
    const val = e.target.value.replace(/\D/g, "");
    e.target.value = formatSSN(val);
  });

  function formatPhoneNumber(value) {
    if (!value) return value;
    if (value.length < 4) return value;
    if (value.length < 7) return `(${value.slice(0, 3)})-${value.slice(3)}`;
    return `(${value.slice(0, 3)})-${value.slice(3, 6)}-${value.slice(6, 10)}`;
  }

  function formatSSN(value) {
    if (!value) return value;
    if (value.length < 4) return value;
    if (value.length < 7) return `(${value.slice(0, 3)}) ${value.slice(3)}`;
    return `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 9)}`;
  }

  // Reset confirmation
  resetButton.addEventListener("click", (e) => {
    const confirmReset = confirm("Are you sure you want to start over?");
    if (!confirmReset) e.preventDefault();
  });

  // Review before submit
  reviewButton.addEventListener("click", showReviewValidation);
  reviewSubmitButton.addEventListener("click", submitOnReview);

  function showReviewValidation() {
    consentDiv.classList.add("d-none");
    reviewSubmitButton.classList.remove("d-none");
    reviewModal.style.display = "block";
    populateReviewFields(false);
  }

  function showReview() {
    consentDiv.classList.remove("d-none");
    reviewSubmitButton.classList.add("d-none");
    reviewModal.style.display = "block";
    populateReviewFields(true);
  }

  function populateReviewFields(showErrors) {
    const exclude = [
      "password",
      "matchPassword",
      "ssn",
      "consent",
      "visitReason",
      "medicalHistory",
    ];
    const elems = getFormElements();
    const reviewFields = document.getElementById("reviewFields");
    reviewFields.innerHTML = "";

    elems.forEach(({ label, value, isValid, message, name }) => {
      if (!showErrors && exclude.includes(name)) return;
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.textContent = label;

      const valueCell = document.createElement("td");
      valueCell.textContent = value;

      row.appendChild(labelCell);
      row.appendChild(valueCell);

      if (showErrors) {
        const statusCell = document.createElement("td");
        statusCell.innerHTML = isValid
          ? "<span class='pass'>Pass</span>"
          : `<span class='error'>Error: ${message}</span>`;
        row.appendChild(statusCell);
      }
      reviewFields.appendChild(row);
    });

    const isValid = elems.every((e) => e.isValid);
    if (isValid && !showErrors) {
      reviewSubmitButton.classList.remove("disabled");
    } else if (isValid && showErrors && consentCheck.checked) {
      submitButton.classList.remove("disabled");
    } else {
      reviewSubmitButton.classList.add("disabled");
      submitButton.classList.add("disabled");
    }
  }

  // Consent checking
  consentCheck.addEventListener("click", () => {
    const elems = getFormElements();
    const allValid = elems.every((e) => e.isValid);
    if (allValid && consentCheck.checked) {
      submitButton.classList.remove("disabled");
      reviewSubmitButton.classList.remove("disabled");
    } else {
      consentCheck.checked = false;
      submitButton.classList.add("disabled");
      reviewSubmitButton.classList.add("disabled");
      showReview();
    }
  });

  reviewConsent.addEventListener("click", () => {
    const elems = getFormElements();
    const allValid = elems.every((e) => e.isValid);
    if (allValid && reviewConsent.checked) {
      consentCheck.checked = true;
      submitButton.classList.remove("disabled");
      reviewSubmitButton.classList.remove("disabled");
    } else {
      submitButton.classList.add("disabled");
      reviewSubmitButton.classList.add("disabled");
    }
  });

  document.getElementById("close").onclick = function () {
    reviewModal.style.display = "none";
    const elems = getFormElements();
    const allValid = elems.every((e) => e.isValid);
    if (consentCheck.checked && allValid)
      submitButton.classList.remove("disabled");
    else submitButton.classList.add("disabled");
  };
  window.onclick = function (event) {
    if (event.target === reviewModal) {
      reviewModal.style.display = "none";
      const elems = getFormElements();
      const allValid = elems.every((e) => e.isValid);
      if (consentCheck.checked && allValid)
        submitButton.classList.remove("disabled");
      else submitButton.classList.add("disabled");
    }
  };

  function submitOnReview(e) {
    e.preventDefault();
    const elems = getFormElements();
    const allValid = elems.every((x) => x.isValid);
    if (allValid) {
      finalizeSubmit("REVIEW_SUBMIT");
    } else {
      showReview();
    }
  }

  submitButton.addEventListener("click", (e) => {
    const elems = getFormElements();
    const allValid = elems.every((x) => x.isValid);
    if (allValid && consentCheck.checked) {
      e.preventDefault();
      finalizeSubmit("SUBMIT");
    } else {
      showReviewValidation();
    }
  });

  function finalizeSubmit(action) {
    const firstNameVal = firstNameField.value;
    if (rememberMeCheck.checked) {
      saveUser(firstNameVal);
    } else {
      deleteCookie("firstName");
    }
    grecaptcha.enterprise.ready(async () => {
      const token = await grecaptcha.enterprise.execute(
        "6LfjrJUqAAAAAJd0UECLz_HgcFV7Q9l2j1pcNBf2",
        { action }
      );
      document.getElementById("token").value = token;
      document.register.token = token;
      document.register.submit();
    });
  }

  // Collapsible
  const collapsible = document.querySelector(".collapsible");
  const content = document.querySelector(".collapsible-content");

  collapsible.addEventListener("click", () => {
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });

  // Slider display updates
  function updateSliderValue(id) {
    const slider = document.getElementById(id);
    const val = slider.value;
    document.getElementById(`${id}Value`).textContent = val;
  }

  ["allergies", "feeling"].forEach((id) => {
    const s = document.getElementById(id);
    s.addEventListener("input", () => updateSliderValue(id));
  });

  // Slideshow
  let slideIndex = 1;
  let autoRotate;
  let isPaused = false;
  let mouseOutTimeout;
  showSlides(slideIndex);
  startAutoRotate();

  function plusSlides(n) {
    showSlides((slideIndex += n));
    resetAutoRotate();
  }

  window.plusSlides = plusSlides;

  function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
    slides[slideIndex - 1].style.display = "block";
  }

  function startAutoRotate() {
    autoRotate = setInterval(() => {
      if (!isPaused) plusSlides(1);
    }, 5000);
  }

  function pauseAutoRotate() {
    isPaused = true;
    clearTimeout(mouseOutTimeout);
  }
  function resumeAutoRotate() {
    isPaused = false;
  }
  function resetAutoRotate() {
    clearInterval(autoRotate);
    startAutoRotate();
  }

  const slideshowContainer = document.querySelector(".slideshow-container");
  slideshowContainer.addEventListener("mouseenter", pauseAutoRotate);
  slideshowContainer.addEventListener("mouseleave", () => {
    mouseOutTimeout = setTimeout(() => {
      resumeAutoRotate();
    }, 5000);
  });
});
