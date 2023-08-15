"use strict";

const quizForm = document.forms.quizForm;

fetch("./quiz.json")
  .then((quiz) => quiz.json())
  .then((data) => {
    const quiz = data.quiz;
    
    //make the form using the json file
    Object.keys(quiz).forEach((questionKey) => {
      const question = quiz[questionKey];
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");

      legend.textContent = question.question;
      fieldset.appendChild(legend);

      question.options.forEach((option) => {
        const radio = document.createElement("input");
        const divWrapper = document.createElement("div");
        const label = document.createElement("label");

        radio.type = "radio";
        radio.name = questionKey;
        radio.value = option;
        label.textContent = option;

        radio.append(label);
        divWrapper.appendChild(radio);
        divWrapper.appendChild(label);
        divWrapper.setAttribute("id", radio.value.replace(/\s/g, ""));

        fieldset.appendChild(divWrapper);
        fieldset.setAttribute("id", questionKey);
        fieldset.appendChild(document.createElement("br"));

        //if user submited the form before, show the their anwsers
        retainedAnwsers(questionKey, option, divWrapper, radio);
      });
      quizForm.append(fieldset);
    });
    //update the LS if event on quiz
    quizListener(quiz);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

function retainedAnwsers(questionKey, option, divWrapper, radio) {
  const storedValue = localStorage.getItem(questionKey);
  if (storedValue === option) {
    radio.checked = true;
  }

  const colorKey = `${questionKey}-${option}`;
  const storedColor = localStorage.getItem(colorKey);

  if (storedColor === "correct") {
    divWrapper.classList.add("correct");
  } else if (storedColor === "incorrect") {
    divWrapper.classList.add("incorrect");
  }
}
function quizListener(quiz) {
  quizForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formEntries = [...formData.entries()];
    formEntries.forEach((entry) => {
      const [key, value] = entry;
      localStorage.setItem(key, value);

      evalAndDisplayAnswers(key, value, quiz);
    });
  });
}
function evalAndDisplayAnswers(key, value, quiz) {
  const question = quiz[key];
  const fieldset = document.querySelector(`#${key}`);

  question.options.forEach((option) => {
    const divWrapper = fieldset.querySelector(`#${option.replace(/\s/g, "")}`);

    divWrapper.classList.remove("correct", "incorrect");
    localStorage.removeItem(`${key}-${option}`);

    if (question.answer.includes(value)) {
      if (option === value) {
        divWrapper.classList.add("correct");
        localStorage.setItem(`${key}-${option}`, "correct");
      }
    } else {
      if (option === value) {
        divWrapper.classList.add("incorrect");
        localStorage.setItem(`${key}-${option}`, "incorrect");
      }
    }
  });
}
578