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
        radio.type = "radio";
        radio.name = questionKey;
        radio.value = option;

        const label = document.createElement("label");
        label.textContent = option;

        //append the elemets to html
        radio.append(label);
        divWrapper.appendChild(radio);
        divWrapper.appendChild(label);
        divWrapper.setAttribute("id", radio.value.replace(/\s/g, ""));

        fieldset.appendChild(divWrapper);
        fieldset.setAttribute("id", questionKey);
        fieldset.appendChild(document.createElement("br"));

        //check radio with the LS value
        const storedValue = localStorage.getItem(questionKey);
        if (storedValue === option) {
          radio.checked = true;
        }
        //check color with LS
        const colorKey = `${questionKey}-${option}`;
        const storedColor = localStorage.getItem(colorKey);

        if (storedColor === "correct") {
          divWrapper.classList.add("correct");
        } else if (storedColor === "incorrect") {
          divWrapper.classList.add("incorrect");
        }
      });
      quizForm.append(fieldset);
    });

    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // get the form data and add it to LS
      const formData = new FormData(e.target);
      const formEntries = [...formData.entries()];
      formEntries.forEach((entry) => {
        const [key, value] = entry;
        localStorage.setItem(key, value);

        //check if anwser is correct
        const question = quiz[key];
        const fieldset = document.querySelector(`#${key}`);

        question.options.forEach((option) => {
          const divWrapper = fieldset.querySelector(
            `#${option.replace(/\s/g, "")}`
          );
          //removes colors and update the colors in storage after retrying
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
      });
    });
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
