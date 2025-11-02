// Link model Teachable Machine Anda
const URL = "https://teachablemachine.withgoogle.com/models/LZguVfn4B/";

let model, webcam, maxPredictions;
let bestClass = "unknown";
let isWebcamActive = false;

// Element DOM
const webcamContainer = document.getElementById("webcam-container");
const labelContainer = document.getElementById("label-container");
const initMessage = document.getElementById("init-message");
const startButton = document.getElementById("start-button");
const resultMessage = document.getElementById("result-message");

const organikButton = document.querySelector(".organik");
const kertasButton = document.querySelector(".kertas");
const plastikButton = document.querySelector(".plastik");
const logamButton = document.querySelector(".logam");
const allButtons = [organikButton, kertasButton, plastikButton, logamButton];

// --- FUNGSI UTAMA TEAHCABLE MACHINE ---

// Load the image model and setup the webcam
async function init() {
  if (isWebcamActive) return; // Prevent double initialization

  try {
    // Tampilkan loading state
    initMessage.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i> Memuat model dan mengaktifkan kamera...';
    startButton.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Load model
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Setup webcam
    const flip = false;
    webcam = new tmImage.Webcam(250, 250, flip); // width, height, flip
    await webcam.setup({ facingMode: "environment" });
    await webcam.play();
    isWebcamActive = true;

    // Hapus pesan inisialisasi dan tambahkan canvas
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);

    // Tambahkan elemen div untuk setiap label prediksi (di div tersembunyi)
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    // Update UI state
    startButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Kamera Aktif';
    allButtons.forEach((btn) => (btn.disabled = false));
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-eco-blue shadow-inner";
    resultMessage.textContent =
      "Ayo! Posisikan sampahnya, dan pilih jenisnya di bawah.";

    // Mulai continuous loop
    window.requestAnimationFrame(loop);
  } catch (error) {
    console.error("Gagal menginisialisasi:", error);
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-red-600 shadow-inner";
    resultMessage.textContent =
      "Gagal mengaktifkan kamera atau memuat model. Pastikan izin kamera diberikan.";
    startButton.disabled = false;
    startButton.innerHTML = '<i class="fas fa-video mr-2"></i> Coba Lagi';
  }
}

async function loop() {
  if (!isWebcamActive) return;
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  if (!model || !webcam) return;

  const prediction = await model.predict(webcam.canvas);
  let highestProbability = 0;
  let predictedClass = "Tidak Diketahui";

  for (let i = 0; i < maxPredictions; i++) {
    // Temukan prediksi dengan probabilitas tertinggi
    if (prediction[i].probability > highestProbability) {
      highestProbability = prediction[i].probability;
      predictedClass = prediction[i].className;
    }
  }

  // Update variabel global (huruf kecil)
  bestClass = predictedClass.toLowerCase();
}

// --- FUNGSI HASIL ---

function updateResult(isCorrect, userGuess, modelPrediction) {
  if (isCorrect) {
    // Respon Benar
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-lime-600 shadow-inner animate-pulse";
    resultMessage.innerHTML = `<i class="fas fa-check-circle mr-2"></i> BENAR! Kamu adalah EcoHero! (${userGuess})`;
  } else {
    // Respon Salah
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-red-600 shadow-inner";
    // Gunakan huruf besar di awal untuk tampilan yang lebih baik
    const modelDisplay =
      modelPrediction.charAt(0).toUpperCase() + modelPrediction.slice(1);
    resultMessage.innerHTML = `<i class="fas fa-times-circle mr-2"></i> SALAH! Model memprediksi: <b>${modelDisplay}</b>. Coba lagi!`;
  }
  // Hentikan animasi setelah 1 detik
  setTimeout(() => {
    resultMessage.classList.remove("animate-pulse");
  }, 1000);
}

// --- EVENT LISTENERS UNTUK TOMBOL ---

// Catatan: bestClass sudah diubah menjadi huruf kecil (lowercase) di fungsi predict()

organikButton.addEventListener("click", function () {
  const isCorrect = bestClass === "organik";
  updateResult(isCorrect, "Organik", bestClass);
});

kertasButton.addEventListener("click", function () {
  const isCorrect = bestClass === "kertas";
  updateResult(isCorrect, "Kertas", bestClass);
});

plastikButton.addEventListener("click", function () {
  const isCorrect = bestClass === "plastik";
  updateResult(isCorrect, "Plastik", bestClass);
});

logamButton.addEventListener("click", function () {
  const isCorrect = bestClass === "logam";
  updateResult(isCorrect, "Logam", bestClass);
});
