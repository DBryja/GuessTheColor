document.addEventListener("DOMContentLoaded", function () {
  const blocksContainer = document.querySelector(".colors-container");
  //   global variables
  let difficulty = "easy";
  let colorContainer;
  let colorToGuess, blockToGuess;
  let qty;
  let level;
  let interval, x;
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
  const statsBeQuick = {
    played: 0,
    hit: 0,
    missed: 0,
    accuracy: 0,
    // czas gry (100s)
    timeStart: 20000,
    timeLeft: 0,
  };

  // creating blocks depending on difficulty setting
  function drawBlocks() {
    if (difficulty === "easy") {
      qty = 6;
      changeSizing();
    } else if (difficulty === "hard") {
      qty = 9;
      changeSizing();
    } else if (difficulty === "bequick") {
      if (level < 5) {
        qty = 3;
        changeSizing();
      } else if (level >= 5 && level < 10) {
        qty = 6;
        changeSizing();
      } else if (level >= 10 && level < 15) {
        qty = 9;
        changeSizing();
      } else if (level >= 15 && level < 20) {
        qty = 12;
        changeSizing();
      } else if (level >= 20 && level < 25) {
        qty = 16;
        changeSizing();
      } else if (level >= 25 && level < 30) {
        qty = 20;
        changeSizing();
      } else {
        qty = 25;
        changeSizing();
      }
    }

    for (let a = 0; a < qty; a++) {
      const block = document.createElement("div");
      block.classList.add("color-block");
      blocksContainer.appendChild(block);
    }

    colorContainer = document.querySelectorAll(".color-block");

    let i = 0;
    colorContainer.forEach((block) => {
      block.setAttribute("data-key", i);
      i++;
      block.addEventListener("click", selectBlock);
    });
  }
  // picks fully random color and sets it to block background
  function setColors() {
    // sets random color for each block
    colorContainer.forEach((block) => {
      const randomBetween = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
      const r = randomBetween(0, 255);
      const g = randomBetween(0, 255);
      const b = randomBetween(0, 255);
      block.style.backgroundColor = `rgb(${r},${g},${b})`;
    });

    //  picks a block that user have to choose
    blockToGuess = document.querySelector(`.color-block[data-key="${Math.floor(Math.random() * qty)}"]`);
    colorToGuess = blockToGuess.style.backgroundColor;
    document.querySelector(".color-name").textContent = colorToGuess.toUpperCase();
  }
  // animating comment
  function animateComment() {
    document
      .querySelector(".comment-block")
      .animate([{ transform: "rotate(3deg)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(0deg)" }], 300);
  }
  function animateTimer(color) {
    document.querySelector(".timer").innerHTML = statsBeQuick.timeLeft / 1000 + "s";
    document.querySelector(".timer").animate(
      [
        { transform: "rotate(-3deg)", color: color },
        { transform: "rotate(3deg)", color: color },
        { transform: "rotate(0deg)", color: "white" },
      ],
      500
    );
  }

  function startBequick() {
    difficulty = "bequick";
    level = 1;
    bequickTimer(statsBeQuick.timeStart);
    changeDifficulty(document.querySelector(".beQuick"));
  }

  // timing function for bequick
  function bequickTimer(time) {
    clearInterval(interval);
    clearInterval(x);
    statsBeQuick.timeLeft = time;
    interval = setInterval(function () {
      statsBeQuick.timeLeft -= 1000;
      document.querySelector(".timer").innerHTML = statsBeQuick.timeLeft / 1000 + "s";
    }, 1000);
    x = setInterval(function () {
      if (statsBeQuick.timeLeft <= 0) {
        alert("Time is out");
        startBequick();
      }
    }, 1);
  }

  //draws statistics
  function drawStatistics() {
    if (difficulty === "bequick") {
      document.querySelector(".score").classList.add(".bequick");
      document.querySelector(".score").innerHTML = `
      <div>
      <h2>Timer</h2>
      <h3 class='timer'>${statsBeQuick.timeLeft / 1000}s</h3>
      </div>
      <div>
      <h2>BeQuick</h2>    
      <p class="bequick__played">Played: <span>0</span></p>
      <p class="bequick__hit-miss">Hit/Missed: <span>0 / 0</span></p>
      <p class="bequick__accuracy">Accuracy: <span>0</span></p>
      </div>
      `;
    } else {
      document.querySelector(".score").classList.remove(".bequick");
      document.querySelector(".score").innerHTML = `
      <div class="easy">
      <h2>Easy</h2>
      <p class="easy__played">Played: <span>0</span></p>
      <p class="easy__hit-miss">Hit/Missed: <span>0 / 0</span></p>
      <p class="easy__accuracy">Accuracy: <span>0</span></p>
    </div>

    <div class="hard">
      <h2>Hard</h2>
      <p class="hard__played">Played: <span>0</span></p>
      <p class="hard__hit-miss">Hit/Missed: <span>0 / 0</span></p>
      <p class="hard__accuracy">Accuracy: <span>0</span></p>
    </div>`;
    }
  }

  function updateStatistics() {
    // bequick
    if (difficulty === "bequick") {
      document.querySelector(".bequick__played span").innerHTML = statsBeQuick.played;
      document.querySelector(".bequick__hit-miss span").innerHTML = statsBeQuick.hit + " / " + statsBeQuick.missed;
      if (statsBeQuick.missed === 0) {
        document.querySelector(".bequick__accuracy span").innerHTML = "100%";
      } else {
        document.querySelector(".bequick__accuracy span").innerHTML =
          Math.round((statsBeQuick.hit / (statsBeQuick.hit + statsBeQuick.missed)) * 100) + "%";
      }
    }
    // easy and hard
    if (difficulty === "easy" || difficulty === "hard") {
      document.querySelector(".easy__played span").innerHTML = statsEasy.played;
      document.querySelector(".easy__hit-miss span").innerHTML = statsEasy.hit + " / " + statsEasy.missed;
      if (statsEasy.missed === 0) {
        document.querySelector(".easy__accuracy span").innerHTML = 0;
      } else {
        document.querySelector(".easy__accuracy span").innerHTML =
          Math.round((statsEasy.hit / (statsEasy.hit + statsEasy.missed)) * 100) + "%";
      }

      document.querySelector(".hard__played span").innerHTML = statsHard.played;
      document.querySelector(".hard__hit-miss span").innerHTML = statsHard.hit + " / " + statsHard.missed;
      if (statsHard.missed === 0) {
        document.querySelector(".easy__accuracy span").innerHTML = 0;
      } else {
        document.querySelector(".hard__accuracy span").innerHTML =
          Math.round((statsHard.hit / (statsHard.hit + statsHard.missed)) * 100) + "%";
      }
    }
  }
  // change sizing of blocks container depending on blocks qty
  function changeSizing() {
    if (qty >= 25) {
      blocksContainer.style.gridTemplateRows = "1fr 1fr 1fr 1fr 1fr";
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
      blocksContainer.style.width = "65%";
      if (window.innerWidth < 850) {
        blocksContainer.style.width = "90%";
      }
    } else if (qty >= 20) {
      blocksContainer.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
    } else if (qty >= 16) {
      blocksContainer.style.gridTemplateRows = "1fr 1fr 1fr 1fr";
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
    } else if (qty >= 12) {
      blocksContainer.style.gridTemplateRows = "1fr 1fr 1fr";
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr 1fr";
    } else if (qty >= 9) {
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      blocksContainer.style.gridTemplateRows = "1fr 1fr 1fr";
      blocksContainer.style.width = "60%";
      if (window.innerWidth < 850) {
        blocksContainer.style.width = "90%";
      }
    } else if (qty <= 6) {
      blocksContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
      blocksContainer.style.gridTemplateRows = "1fr 1fr";
    }
  }
  //   win conditions
  function selectBlock() {
    let randomComment = Math.floor(Math.random() * 5);
    if (this.style.backgroundColor === colorToGuess) {
      // progress in bequick
      if (difficulty === "bequick") {
        level++;
        document.querySelector(".timer").textContent = statsBeQuick.timeLeft / 1000 + "s";
        statsBeQuick.timeLeft += 3000;
        animateTimer("#5cff00");
      }
      // animate comment
      animateComment();
      document.querySelector(".comment-block__content").textContent = wonComments[randomComment];
      // draw blocks
      // remove listeners for the time in which blocks are being drawn
      colorContainer.forEach((block) => {
        block.removeEventListener("click", selectBlock);
      });
      setTimeout(() => {
        blocksContainer.textContent = "";
        drawBlocks(difficulty);
        setColors();
        colorContainer.forEach((block) => {
          block.addEventListener("click", selectBlock);
        });
      }, 500);
      // statistics
      if (difficulty === "easy") {
        statsEasy.played++;
        statsEasy.hit++;
      } else if (difficulty === "hard") {
        statsHard.played++;
        statsHard.hit++;
      } else if (difficulty === "bequick") {
        statsBeQuick.played++;
        statsBeQuick.hit++;
      }
      //
    } else {
      // hide block
      this.style.scale = "0.8";
      this.style.opacity = "0";
      this.removeEventListener("click", selectBlock);
      // change comment
      animateComment();
      document.querySelector(".comment-block__content").textContent = missComments[randomComment];
      // statistics
      if (difficulty === "easy") {
        statsEasy.missed++;
      } else if (difficulty === "hard") {
        statsHard.missed++;
      } else if (difficulty === "bequick") {
        statsBeQuick.missed++;
        statsBeQuick.timeLeft -= 2000;
        animateTimer("red");
      }
    }
    updateStatistics();
  }

  // change underline and launch functions
  function changeDifficulty(e) {
    document.querySelectorAll(".difficulty__item").forEach((item) => {
      item.classList.remove("active");
    });
    e.classList.add("active");
    blocksContainer.textContent = "";
    drawStatistics();
    updateStatistics();
    drawBlocks(difficulty);
    setColors();
  }

  // difficulty buttons listeners
  document.querySelector(".easyBtn").addEventListener("click", function () {
    difficulty = "easy";
    changeDifficulty(this);
    clearInterval(interval);
    clearInterval(x);
  });
  document.querySelector(".hardBtn").addEventListener("click", function () {
    difficulty = "hard";
    changeDifficulty(this);
    clearInterval(interval);
    clearInterval(x);
  });
  document.querySelector(".beQuick").addEventListener("click", startBequick);

  drawBlocks(difficulty);
  drawStatistics();
  setColors();
});
