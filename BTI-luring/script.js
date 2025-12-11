document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const dialogueTextEl = document.getElementById("dialogue-text");
  const characterNameEl = document.getElementById("character-name");
  const optionsContainerEl = document.getElementById("options-container");
  const promptContainerEl = document.getElementById("prompt-container");
  const userInputEl = document.getElementById("user-input");
  const submitInputEl = document.getElementById("submit-input");
  const nextIndicatorEl = document.getElementById("next-indicator");
  const gameContainerEl = document.getElementById("game-container");

  // === Game State Variables ===
  let state = {
    userName: "",
    batik1: "",
    batik2: "",
    a1: 0,
    b1: 0,
    c1: 0,
    a2: 0,
    b2: 0,
    c2: 0,
    x: 0,
    y: 0,
  };
  let isTyping = false;
  const TYPING_DELAY = 50;

  // === Utility Functions ===

  function typingAnimation(text) {
    return new Promise((resolve) => {
      isTyping = true;
      dialogueTextEl.textContent = "";
      let charIndex = 0;
      const cleanedText = text.replace(/\n/g, "\n");

      const interval = setInterval(() => {
        if (charIndex < cleanedText.length) {
          dialogueTextEl.textContent += cleanedText.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(interval);
          isTyping = false;
          resolve();
        }
      }, TYPING_DELAY);

      const skipHandler = () => {
        if (isTyping) {
          clearInterval(interval);
          dialogueTextEl.textContent = cleanedText;
          isTyping = false;
          gameContainerEl.removeEventListener("click", skipHandler);
          resolve();
        }
      };
      gameContainerEl.addEventListener("click", skipHandler, {
        once: true,
        capture: true,
      });
    });
  }

  async function setDialogue(name, text) {
    characterNameEl.textContent = name;
    nextIndicatorEl.classList.add("hidden");

    optionsContainerEl.classList.add("hidden");
    promptContainerEl.classList.add("hidden");

    await typingAnimation(text);
    nextIndicatorEl.classList.remove("hidden");
  }

  function waitForPlayerClick() {
    return new Promise((resolve) => {
      const clickHandler = (event) => {
        if (isTyping) {
          return;
        }
        gameContainerEl.removeEventListener("click", clickHandler, {
          capture: true,
        });
        resolve();
      };
      gameContainerEl.addEventListener("click", clickHandler, {
        once: true,
        capture: true,
      });
    });
  }

  function waitForInput(placeholder = "") {
    return new Promise((resolve) => {
      userInputEl.value = "";
      userInputEl.placeholder = placeholder;
      nextIndicatorEl.classList.add("hidden");

      promptContainerEl.classList.remove("hidden");
      userInputEl.focus();

      const submitHandler = () => {
        const inputValue = userInputEl.value.trim();
        if (inputValue) {
          promptContainerEl.classList.add("hidden");
          submitInputEl.removeEventListener("click", submitHandler);
          resolve(inputValue);
        }
      };
      submitInputEl.addEventListener("click", submitHandler);
    });
  }

  function waitForYN(yesText = "Ya", noText = "Tidak") {
    return new Promise((resolve) => {
      optionsContainerEl.innerHTML = "";
      nextIndicatorEl.classList.add("hidden");

      promptContainerEl.classList.add("hidden");
      optionsContainerEl.classList.remove("hidden");

      const yesButton = document.createElement("button");
      yesButton.textContent = yesText;
      yesButton.onclick = () => {
        optionsContainerEl.classList.add("hidden");
        resolve(true);
      };

      const noButton = document.createElement("button");
      noButton.textContent = noText;
      noButton.onclick = () => {
        optionsContainerEl.classList.add("hidden");
        resolve(false);
      };

      optionsContainerEl.appendChild(yesButton);
      optionsContainerEl.appendChild(noButton);
    });
  }

  // === Game Logic / Batik Information ===

  function getBatikInformation(batik) {
    batik = batik.toLowerCase();
    let info = "";
    let found = true;

    switch (batik) {
      case "besurek":
        info =
          "Batik Besurek adalah batik khas Bengkulu yang bermotif kaligrafi Arab.\nPada umumnya, batik ini berciri khas motif kaligrafi dengan perpaduan bunga Rafflesia.\nBesurek merupakan bahasa Melayu dialek Bengkulu yang artinya bersurat atau tulisan.";
        break;
      case "kawung":
        info =
          "Batik Kawung adalah motif batik Jawa yang bentuknya berupa bulatan\nmirip buah kawung (aren) yang ditata rapi secara geometris.\nMotif ini melambangkan umur panjang dan kesucian.";
        break;
      case "parang":
        info =
          "Batik Parang adalah salah satu motif batik yang paling tua di Indonesia.\nParang berasal dari kata *pereng* (lereng).\nBentuknya berupa huruf “S” yang digambar secara berkaitan dan membentuk diagonal miring.";
        break;
      default:
        info = "Data batik tidak ditemukan.";
        found = false;
        break;
    }
    return { info, found };
  }

  // === Scenario Flow ===

  async function scenarioFlow() {
    // --- SCENARIO 0: INTRO (Dihapus karena sudah jadi judul) ---
    // await setDialogue("Narator", "=== BaTIK - Pola Batik Membentuk Pola Pikir ===\n");
    // await waitForPlayerClick();

    // --- SCENARIO 1: INPUT NAMA (Dimulai langsung dari sini) ---
    await setDialogue(
      "Guru BaTIK",
      "Halo! Selamat datang di aplikasi BaTIK. Sebelum kita mulai, siapa nama kamu?"
    );
    state.userName = await waitForInput("Masukkan nama kamu...");
    await setDialogue(
      "Guru BaTIK",
      `Halo ${state.userName}! Mari kita mulai pelajaran tentang pola batik dan informatika.`
    );
    await waitForPlayerClick();

    // --- SCENARIO 2: INPUT BATIK 1 ---
    let batik1Valid = false;
    while (!batik1Valid) {
      await setDialogue(
        "Guru BaTIK",
        "Masukkan hasil deteksi batik pertama (Contoh: Besurek, Kawung, Parang):"
      );
      const input = await waitForInput("Nama batik 1...");
      const batikInfo = getBatikInformation(input);

      if (batikInfo.found) {
        state.batik1 = input.toLowerCase();
        await setDialogue("Guru BaTIK", batikInfo.info);
        batik1Valid = true;
      } else {
        await setDialogue("Guru BaTIK", batikInfo.info);
      }
      await waitForPlayerClick();
    }

    // --- SCENARIO 3: LANJUT KE BATIK 2? ---
    await setDialogue(
      "Guru BaTIK",
      "Apakah kamu ingin lanjut mendeteksi batik kedua?"
    );
    const lanjut1 = await waitForYN("Ya, Lanjut", "Tidak, Cukup satu");

    if (lanjut1) {
      // --- SCENARIO 4: INPUT BATIK 2 ---
      let batik2Valid = false;
      while (!batik2Valid) {
        await setDialogue("Guru BaTIK", "Masukkan hasil deteksi batik kedua:");
        const input = await waitForInput("Nama batik 2...");
        const batikInfo = getBatikInformation(input);

        if (batikInfo.found) {
          state.batik2 = input.toLowerCase();
          await setDialogue("Guru BaTIK", batikInfo.info);
          batik2Valid = true;
        } else {
          await setDialogue("Guru BaTIK", batikInfo.info);
        }
        await waitForPlayerClick();
      }
    }

    if (!state.batik2) {
      state.batik2 = state.batik1;
    }

    // --- SCENARIO 5: PENJELASAN INFORMATIKA ---
    await setDialogue(
      "Guru BaTIK",
      `Nah ${
        state.userName
      }, kamu sudah tahu tentang Batik ${state.batik1.toUpperCase()} dan Batik ${state.batik2.toUpperCase()}.`
    );
    await waitForPlayerClick();
    await setDialogue(
      "Guru BaTIK",
      "Dengarkan penjelasan gurumu tentang keterkaitan batik dan informatika... (Simulasi Jeda)"
    );
    await waitForPlayerClick();

    await setDialogue(
      "Guru BaTIK",
      "Sekarang kita masuk ke topik utama! Anggap tiap batik tadi adalah variabel aljabar x dan y."
    );
    await waitForPlayerClick();

    await setDialogue(
      "Guru BaTIK",
      `Misalnya:\n- Batik ${state.batik1.toUpperCase()} adalah x\n- Batik ${state.batik2.toUpperCase()} adalah y`
    );
    await waitForPlayerClick();

    await setDialogue(
      "Guru BaTIK",
      "Tugasmu: Buat algoritma untuk mencari nilai x dan y dari data yang akan saya berikan!"
    );
    await waitForPlayerClick();

    // --- SCENARIO 6: GENERATE PERSAMAAN LINEAR ---

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    state.x = getRandomInt(1, 10);
    state.y = getRandomInt(1, 10);

    while (true) {
      state.a1 = getRandomInt(1, 10);
      state.b1 = getRandomInt(1, 10);
      state.a2 = getRandomInt(1, 10);
      state.b2 = getRandomInt(1, 10);

      if (state.a1 * state.b2 - state.a2 * state.b1 !== 0) {
        break;
      }
    }

    state.c1 = state.a1 * state.x + state.b1 * state.y;
    state.c2 = state.a2 * state.x + state.b2 * state.y;

    const eq1 = `${state.a1}x + ${state.b1}y = ${state.c1}`;
    const eq2 = `${state.a2}x + ${state.b2}y = ${state.c2}`;

    await setDialogue(
      "Guru BaTIK",
      `Ini datanya:\nPersamaan 1: ${eq1}\nPersamaan 2: ${eq2}`
    );
    await waitForPlayerClick();

    // --- SCENARIO 7: SOLUSI MASALAH ---
    await setDialogue(
      "Guru BaTIK",
      "Gunakan Berpikir Komputasional (dekomposisi dan algoritma) untuk mencari nilai x dan y!"
    );
    await waitForPlayerClick();
    await setDialogue(
      "Guru BaTIK",
      "Jika sudah dapat jawabannya, silakan masukkan jawabanmu."
    );

    // --- SCENARIO 8: INPUT JAWABAN ---
    let xAns, yAns;
    await setDialogue("Guru BaTIK", "Nilai x yang kamu temukan adalah:");
    xAns = parseInt(await waitForInput("Nilai x..."), 10);

    await setDialogue("Guru BaTIK", "Nilai y yang kamu temukan adalah:");
    yAns = parseInt(await waitForInput("Nilai y..."), 10);

    // --- SCENARIO 9: CEK HASIL ---
    if (xAns === state.x && yAns === state.y) {
      await setDialogue(
        "Guru BaTIK",
        `🎉 Wah keren banget! Jawabanmu benar semua! (x=${state.x}, y=${state.y}).`
      );
    } else if (xAns === state.x) {
      await setDialogue(
        "Guru BaTIK",
        `Hampir! Nilai x (${state.x}) sudah benar, tapi nilai y salah. Jawaban seharusnya ${state.y}.`
      );
    } else if (yAns === state.y) {
      await setDialogue(
        "Guru BaTIK",
        `Hampir! Nilai y (${state.y}) sudah benar, tapi nilai x salah. Jawaban seharusnya ${state.x}.`
      );
    } else {
      await setDialogue(
        "Guru BaTIK",
        `Waduh, jawabannya masih salah semua nih. Jawaban yang benar: x = ${state.x}, y = ${state.y}. Coba diskusikan lagi ya!`
      );
    }
    await waitForPlayerClick();

    // --- SCENARIO 10: ULANGI? ---
    await setDialogue("Guru BaTIK", "Mau coba soal yang baru lagi?");
    const loop = await waitForYN("Ya", "Tutup Program");

    if (loop) {
      state.batik1 = "";
      state.batik2 = "";
      scenarioFlow();
    } else {
      await setDialogue(
        "Narator",
        "\n===== TERIMA KASIH TELAH MENGGUNAKAN PROGRAM ====="
      );
      gameContainerEl.onclick = null;
      nextIndicatorEl.classList.add("hidden");
    }
  }

  // === START GAME ===
  scenarioFlow();
});
