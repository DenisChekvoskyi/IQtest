window.addEventListener("DOMContentLoaded", () => {
  function burger() {
    const body = document.querySelector(".container");
    const burger = document.querySelector(".burger");
    const burgerMenu = document.querySelector(".burgerMenu");

    const close = document.querySelector(".burgerMenu-close");
    const menu = document.querySelectorAll(".burgerMenu-list li");

    const closeFunc = () => {
      body.style.display = "";
      burgerMenu.style.display = "none";
      document.body.style.overflow = "";
    };

    burger.addEventListener("click", () => {
      body.style.display = "none";
      burgerMenu.style.display = "block";
      document.body.style.overflow = "hidden";
    });

    close.addEventListener("click", () => closeFunc());

    menu.forEach((item) => {
      item.addEventListener("click", () => {
        closeFunc();
      });
    });
  }

  function btnForForm() {
    const btns = document.querySelectorAll(".form-btn");
    const input = document.querySelectorAll(".form input");
    const label = document.querySelectorAll(".form label");

    btns.forEach((btn) => {
      btn.setAttribute("disabled", true);
      btn.classList.remove("active");
    });

    input.forEach((item) => {
      item.addEventListener("change", (e) => {
        const selectedInput = e.target;
        const selectedLabel = selectedInput.parentNode;
        label.forEach((item) => item.classList.remove("activeLabel"));

        if (selectedInput.checked) {
          btns.forEach((btn) => btn.classList.add("active"));
          selectedLabel.classList.add("activeLabel");
        } else {
          btns.forEach((btn) => btn.classList.remove("active"));
        }
        btns.forEach((btn) =>
          btn.classList.contains("active")
            ? btn.removeAttribute("disabled")
            : btn.setAttribute("disabled", true)
        );
      });
    });
  }

  function pages() {
    const mainPage = document.querySelector(".main");
    const btnForStartTest = document.querySelectorAll(".btnNode");
    const linkForStartPage = document.querySelectorAll(".linkNode");
    const questionsPage = document.querySelector(".questions");
    const headerLogo = document.querySelector(".headerLogo");
    const headerFinish = document.querySelector(".headerFinish");

    questionsPage.style.display = "none";

    btnForStartTest.forEach((item) => {
      item.addEventListener("click", () => {
        count = 1;
        mainPage.style.display = "none";
        questionsPage.style.display = "block";
        headerLogo.style.display = "flex";
        headerFinish.style.display = "none";
      });
    });

    linkForStartPage.forEach((item) => {
      item.addEventListener("click", () => {
        mainPage.style.display = "block";
        questionsPage.style.display = "none";
        headerLogo.style.display = "none";
        headerFinish.style.display = "none";
      });
    });
  }

  let count = 1;

  function switchingPagesForTest() {
    const questionsPages = document.querySelectorAll(".questions");
    const btns = document.querySelectorAll(".form-btn");
    const loadingPage = document.querySelector("#loading");
    const resultPage = document.querySelector("#result");
    const headerLogo = document.querySelector(".headerLogo");
    const headerFinish = document.querySelector(".headerFinish");

    const isVisible = () => {
      questionsPages.forEach((page) => {
        pages();
        if (page.getAttribute("page") === String(count)) {
          page.style.display = "block";
        } else if (count === 12) {
          page.style.display = "none";
          loadingPage.style.display = "block";
          setTimeout(() => {
            count += 1;
            page.style.display = "none";
            loadingPage.style.display = "none";
            resultPage.style.display = "block";
            headerLogo.style.display = "none";
            headerFinish.style.display = "flex";
            startTimer(600, "#timer");
            visibilityResult();
          }, 1500);
        } else {
          page.style.display = "none";
        }
      });
    };
    isVisible();

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        count += 1;
        isVisible();
        setTimeout(() => {
          btnForForm();
        });
      });
    });
  }

  function startTimer(duration, triggerId) {
    let timer = setInterval(function () {
      let minutes = parseInt(duration / 60, 10);
      let seconds = parseInt(duration % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      let timeString = minutes + ":" + seconds;
      document.querySelector(triggerId).textContent = timeString;

      if (--duration < 0) {
        clearInterval(timer);
        document.querySelector(triggerId).textContent = "00:00";
      }
    }, 1000);
  }

  let res = {};

  function form() {
    const forms = document.querySelectorAll(".form");

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        let data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        res = Object.assign(res, data);
        console.log(res);
      });
    });
    return res;
  }

  function sendRes(url) {
    const res = form();
    console.log(res);
    fetch(url, {
      method: "POST",
      body: JSON.stringify(res),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  function onTriggerForSubmit() {
    const trigger = document.querySelector(".call");
    trigger.addEventListener("click", () => {
      sendRes("https://swapi.dev/api/people/1/");
    });
  }

  function progress() {
    const progressStatus = document.querySelectorAll(".progress span");

    const allSlides = progressStatus.length;
    progressStatus.forEach((item, i) => {
      item.style.width = (i / (allSlides - 1)) * 100 + "%";
    });
  }

  let isVisibilityResultCalled = false;

  function visibilityResult() {
    if (isVisibilityResultCalled) {
      return;
    }

    const trigger = document.querySelector("#result");

    const div = document.createElement("div");
    const header = document.createElement("h3");
    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";

    header.textContent = `Ваши ответы:`;
    header.style.color = "#fff";
    header.style.marginTop = "10px";

    div.style.cssText = "display: flex; flex-direction: column; align-items: center";

    Object.entries(res).forEach((item, i) => {
      const li = document.createElement("li");
      li.style.fontSize = "14px";
      li.style.color = "#fff";
      li.textContent = `№${i + 1}: ${item[1]}`;
      ul.appendChild(li);
    });

    div.appendChild(header);
    div.appendChild(ul);

    trigger.appendChild(div);
    isVisibilityResultCalled = true;
  }

  burger();
  btnForForm();
  pages();
  switchingPagesForTest();
  form();
  onTriggerForSubmit();
  progress();
});
