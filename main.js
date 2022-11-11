document.addEventListener("DOMContentLoaded", function () {
  const newColors = document.querySelector(".new-colors");
  //   global variables
  let colorsContainer;
  let colorToGuess, blockToGuess;
  //   comments list
  wonComments = ["You won!", "Nice one!", "Good job", "Well done!", "WOW!"];
  missComments = ["Try again", "Next time", "One more time?", `Don't give up!`, "You got this!"];
  //   statistics objects
  const statsEasy = {
    played: 0,
    hit: 0,
    missed: 0,
    accuracy: 0,
  };
  const statsHard = {
    played: 0,
    hit: 0,
    missed: 0,
    accuracy: 0,
  };

  let difficulty = "easy";

  function drawBlocks(difficulty) {
    let qty;
    if (difficulty === "easy") {
      qty = 6;
    } else if (difficulty === "hard") {
      qty = 9;
    }

    for (let a = 0; a < qty; a++) {
      const block = document.createElement("div");
      block.classList.add("color-block");
      document.querySelector(".colors-container").appendChild(block);
    }

    colorsContainer = document.querySelectorAll(".color-block");

    let i = 0;
    colorsContainer.forEach((block) => {
      block.setAttribute("data-key", i);
      i++;
      block.addEventListener("click", selectBlock);
    });
  }

  function setColors() {
    // sets random color for each block
    colorsContainer.forEach((block) => {
      const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);
      block.style.backgroundColor = `rgb(${r},${g},${b})`;
    });

    //  picks a block that user have to choose
    blockToGuess = document.querySelector(`.color-block[data-key="${Math.floor(Math.random() * 6)}"]`);
    colorToGuess = blockToGuess.style.backgroundColor;
    document.querySelector(".color-name").textContent = colorToGuess.toUpperCase();
  }

  function animateComment() {
    document
      .querySelector(".comment-block")
      .animate([{ transform: "rotate(3deg)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(0deg)" }], 300);
  }

  //   win conditions
  function selectBlock() {
    let randomComment = Math.floor(Math.random() * 5);
    if (this.style.backgroundColor === colorToGuess) {
      // animate comment
      animateComment();
      document.querySelector(".comment-block__content").textContent = wonComments[randomComment];
      // draw blocks
      setTimeout(() => {
        document.querySelector(".colors-container").textContent = "";
        drawBlocks(difficulty);
        setColors();
      }, 500);
      // statistics
      if (difficulty === "easy") {
        statsEasy.played++;
        statsEasy.hit++;
      } else if (difficulty === "hard") {
        statsHard.played++;
        statsHard.hit++;
      }
    } else {
      // hide block
      this.style.opacity = "0";
      this.removeEventListener("click", selectBlock);
      // comment
      animateComment();
      document.querySelector(".comment-block__content").textContent = missComments[randomComment];
      // statistics
      if (difficulty === "easy") {
        statsEasy.missed++;
      } else if (difficulty === "hard") {
        statsHard.missed++;
      }
    }
    updateStatistics();
  }

  function updateStatistics() {
    if (difficulty === "easy") {
      document.querySelector(".easy__played span").textContent = statsEasy.played;
      document.querySelector(".easy__hit-miss span").textContent = statsEasy.hit + " / " + statsEasy.missed;
      document.querySelector(".easy__accuracy span").textContent =
        Math.round((statsEasy.hit / (statsEasy.hit + statsEasy.missed)) * 100) + "%";
    } else if (difficulty === "hard") {
      document.querySelector(".hard__played span").textContent = statsHard.played;
      document.querySelector(".hard__hit-miss span").textContent = statsHard.hit + " / " + statsHard.missed;
      document.querySelector(".hard__accuracy span").textContent =
        Math.round((statsHard.hit / (statsHard.hit + statsHard.missed)) * 100) + "%";
    }
  }

  function changeDifficulty(e) {
    document.querySelectorAll(".difficulty__item").forEach((item) => {
      item.classList.remove("active");
      console.log("cos");
    });
    e.classList.add("active");
    document.querySelector(".colors-container").textContent = "";
    drawBlocks(difficulty);
    setColors();
  }
  document.querySelector(".easyBtn").addEventListener("click", function () {
    difficulty = "easy";
    document.querySelector(".colors-container").classList.remove("hard");
    changeDifficulty(this);
  });
  document.querySelector(".hardBtn").addEventListener("click", function () {
    difficulty = "hard";
    document.querySelector(".colors-container").classList.add("hard");
    changeDifficulty(this);
  });

  newColors.addEventListener("click", () => {
    setColors();
  });

  drawBlocks(difficulty);
  setColors();
});
