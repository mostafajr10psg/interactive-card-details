const inputs = document.querySelectorAll("form input[data-card]");
const form = document.forms[0];
const cardNameEl = document.querySelector(".card-container .name[data-card]");
const cardNumberEl = document.querySelector(".card-container .number[data-card]");
const cardExpMonthEl = document.querySelector(".card-container .month[data-card]");
const cardExpYearEl = document.querySelector(".card-container .year[data-card]");
const cvcEl = document.querySelector(".card-container .cvc[data-card]");
const successMsg = document.querySelector(".success-msg");
const successMsgBtn = document.querySelector(".success-msg button");

function getDataCardEle(dataCard) {
  return document.querySelector(`.card-container [data-card='${dataCard}']`);
}

function getErrorEle(input) {
  return input.parentElement.querySelector(".error-msg");
}

function isValidInput(input, patternType, condition, conditionMsg) {
  let { pattern, errMsg } = patternType;
  let isValid = false;

  if (input.value === "") handleInvalidInput(input, "Can't be blank");
  else if (!pattern.test(input.value)) handleInvalidInput(input, errMsg);
  else if (condition) handleInvalidInput(input, conditionMsg);
  else {
    handleValidInput(input);
    isValid = true;
  }
  validationInputs[input.dataset.card].isValid = isValid;
}

function handleInvalidInput(input, errMsg) {
  input.setAttribute("aria-invalid", "true");
  const errEle = getErrorEle(input);
  errEle.textContent = errMsg;
  errEle.classList.remove("hidden");
}

function handleValidInput(input) {
  input.removeAttribute("aria-invalid");
  getErrorEle(input).classList.add("hidden");
}

const patternTypes = {
  numbers: {
    pattern: /^\d+$/,
    errMsg: "Wrong format, numbers only",
  },
  letters: {
    pattern: /^[a-zA-Z\s]+$/,
    errMsg: "Wrong format, letters only",
  },
};

const validationInputs = {
  name: {
    validate: (input) => {
      const condition = input.value.length < 2 || input.value.length > 30;
      const errMsg = "Card name must be at least 2 characters";
      isValidInput(input, patternTypes.letters, condition, errMsg);
    },
    isTouched: false,
    isValid: false,
  },

  number: {
    validate: (input) => {
      const condition = input.value.length !== 16;
      const errMsg = "Card number must be 16 number";
      isValidInput(input, patternTypes.numbers, condition, errMsg);
    },
    isTouched: false,
    isValid: false,
  },

  "exp-month": {
    validate: (input) => {
      const condition = input.value < 1 || input.value > 12;
      isValidInput(input, patternTypes.numbers, condition, "invalid month");
    },
    isTouched: false,
    isValid: false,
  },

  "exp-year": {
    validate: (input) => {
      const currentYear = new Date().getFullYear() % 100;
      const condition = input.value <= currentYear || input.value > currentYear + 15;
      isValidInput(input, patternTypes.numbers, condition, "invalid year");
    },
    isTouched: false,
    isValid: false,
  },

  cvc: {
    validate: (input) => {
      const condition = input.value.length !== 3;
      isValidInput(input, patternTypes.numbers, condition, "cvc must be 3 numbers");
    },
    isTouched: false,
    isValid: false,
  },
};

function handleInputEvent(input, dataCard) {
  input.addEventListener("input", (e) => {
    getDataCardEle(dataCard).textContent = e.target.value;

    if (validationInputs[dataCard].isTouched) {
      validationInputs[dataCard].validate(e.target);
    }

    if (dataCard === "exp-month") {
      input.value.length === 1 ? (cardExpMonthEl.textContent = `0${input.value}`) : "";
    }
  });
}

function handleBlurEvent(input, dataCard) {
  input.addEventListener("blur", () => {
    validationInputs[dataCard].isTouched = true;
    validationInputs[dataCard].validate(input);
  });
}

inputs.forEach((input) => {
  const dataCard = input.dataset.card;
  handleInputEvent(input, dataCard);
  handleBlurEvent(input, dataCard);
});

function changeExpDateContent(val) {
  cardExpMonthEl.textContent = val;
  cardExpYearEl.textContent = val;
}

function cardDataEncryption() {
  const lastFourCardNums = cardNumberEl.textContent.slice(-4);
  cardNumberEl.textContent = lastFourCardNums.padStart(16, "*");
  changeExpDateContent("**");
  cvcEl.textContent = "***";
}

function formSubmitted() {
  showEleSmooth(successMsg);
  hideEleSmooth(form);
}

function checkFormValidation() {
  const isFormValid = Object.values(validationInputs).every((obj) => obj.isValid);
  if (isFormValid) {
    cardDataEncryption();
    formSubmitted();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  inputs.forEach((input) => {
    const dataCard = input.dataset.card;
    validationInputs[dataCard].isTouched = true;
    validationInputs[dataCard].validate(input);
  });
  checkFormValidation();
});

function showEleSmooth(ele) {
  ele.classList.remove("hidden");
  setTimeout(() => {
    ele.classList.remove("opacity-0");
    ele.classList.remove("trans-y-15");
  }, 150);
}

function hideEleSmooth(ele) {
  ele.classList.add("hidden");
  ele.classList.add("opacity-0");
  ele.classList.add("trans-y-15");
}

function resetState() {
  showEleSmooth(form);
  hideEleSmooth(successMsg);
}

function resetCardData() {
  cardNameEl.textContent = "Jane Appleseed";
  cardNumberEl.textContent = "0000 0000 0000 0000";
  changeExpDateContent("00");
  cvcEl.textContent = "000";
}

successMsgBtn.addEventListener("click", () => {
  inputs.forEach((input) => (input.value = ""));
  Object.values(validationInputs).forEach((obj) => (obj.isValid = false));
  resetCardData();
  resetState();
});
