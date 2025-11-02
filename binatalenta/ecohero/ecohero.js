// Link model Teachable Machine Anda
const URL = "https://teachablemachine.withgoogle.com/models/LZguVfn4B/";

let model, webcam, maxPredictions;
let bestClass = "unknown";
let isWebcamActive = false;
// Variabel state untuk kamera dan model
let isModelLoaded = false;
let isLooping = false;
let currentFacingMode = "environment"; // Default ke kamera belakang/lingkungan

// Element DOM
const webcamContainer = document.getElementById("webcam-container");
const labelContainer = document.getElementById("label-container");
const initMessage = document.getElementById("init-message");
const startButton = document.getElementById("start-button");
const toggleButton = document.getElementById("toggle-camera-button");
const resultMessage = document.getElementById("result-message");

const organikButton = document.querySelector(".organik");
const kertasButton = document.querySelector(".kertas");
const plastikButton = document.querySelector(".plastik");
const logamButton = document.querySelector(".logam");
const allButtons = [organikButton, kertasButton, plastikButton, logamButton];

// --- FUNGSI UTAMA TEAHCABLE MACHINE ---

// Fungsi untuk menghentikan stream webcam
function stopWebcam() {
  if (webcam && webcam.webcam) {
    // webcam.stop() adalah fungsi dari tmImage.Webcam yang menghentikan stream
    webcam.stop();
  }
  isWebcamActive = false;
  isLooping = false;
}

async function init() {
  if (isModelLoaded && isWebcamActive) return;

  if (isModelLoaded) {
    // Jika model sudah dimuat, langsung mulai ulang webcam
    await startWebcam(currentFacingMode);
    return;
  }

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
    isModelLoaded = true; // Tandai model sudah dimuat

    // Tambahkan elemen div untuk setiap label prediksi (di div tersembunyi)
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    // Mulai webcam untuk pertama kali (default: environment)
    await startWebcam(currentFacingMode);

    // Update UI state setelah semua berhasil
    startButton.innerHTML = '<i class="fas fa-bolt mr-2"></i> Kamera Aktif';
    allButtons.forEach((btn) => (btn.disabled = false));
    toggleButton.disabled = false; // Aktifkan tombol toggle
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-eco-blue shadow-inner";
    resultMessage.textContent =
      "Ayo! Posisikan sampahnya, dan pilih jenisnya di bawah.";
  } catch (error) {
    console.error("Gagal menginisialisasi:", error);
    resultMessage.className =
      "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-red-600 shadow-inner";
    resultMessage.textContent =
      "Gagal mengaktifkan kamera atau memuat model. Pastikan izin kamera diberikan.";
    startButton.disabled = false;
    startButton.innerHTML = '<i class="fas fa-video mr-2"></i> Coba Lagi';
    toggleButton.disabled = true;
  }
}

// Fungsi untuk memulai atau mengganti webcam
async function startWebcam(mode) {
  // 1. Tunjukkan status loading & nonaktifkan tombol
  initMessage.innerHTML =
    '<i class="fas fa-sync-alt fa-spin mr-2"></i> Mengganti kamera...';
  toggleButton.disabled = true;

  // 2. Hentikan webcam yang ada
  stopWebcam();

  // 3. Setup webcam baru
  // Flip=true untuk kamera depan ('user') agar terlihat seperti cermin
  const flip = mode === "user";
  webcam = new tmImage.Webcam(250, 250, flip);

  const videoConstraints = {
    width: 250,
    height: 250,
    // facingMode adalah properti yang diminta ke browser
    facingMode: mode,
  };

  try {
    await webcam.setup({ video: videoConstraints });
    await webcam.play();
    isWebcamActive = true;
    currentFacingMode = mode;

    // Update DOM
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);
    initMessage.textContent = "";

    // Update tombol toggle
    if (mode === "environment") {
      toggleButton.innerHTML =
        '<i class="fas fa-camera-rotate mr-2"></i> Ganti ke Depan';
    } else {
      toggleButton.innerHTML =
        '<i class="fas fa-camera-rotate mr-2"></i> Ganti ke Belakang';
    }

    toggleButton.disabled = false; // Aktifkan lagi tombol toggle

    // Mulai loop prediksi jika belum berjalan
    if (!isLooping) {
      window.requestAnimationFrame(loop);
      isLooping = true;
    }
  } catch (e) {
    console.error(`Gagal mengatur webcam ke mode ${mode}:`, e);

    // Masalah ini sering terjadi: Browser gagal mengaktifkan kamera belakang (environment)
    if (mode === "environment") {
      // Tampilkan pesan kesalahan yang lebih spesifik
      resultMessage.className =
        "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-orange-500 shadow-inner";
      resultMessage.textContent =
        "⚠️ Browser gagal mengakses kamera belakang. Secara otomatis beralih ke kamera depan. Coba lagi!";

      // Coba mode 'user' sebagai fallback
      currentFacingMode = "user";
      // Lakukan panggilan ulang untuk memastikan kamera depan aktif
      return startWebcam("user");
    }

    // Jika kedua mode gagal
    webcamContainer.innerHTML =
      '<p class="text-sm text-red-500 p-4 text-center">Gagal mengakses kamera. Pastikan izin kamera diberikan.</p>';
    startButton.disabled = false;
    startButton.innerHTML = '<i class="fas fa-video mr-2"></i> Coba Lagi';
    toggleButton.disabled = true;
  }
}

// Fungsi untuk mengganti mode kamera
function toggleCamera() {
  if (!isWebcamActive || !isModelLoaded) return;

  // Flip mode
  const newMode = currentFacingMode === "environment" ? "user" : "environment";

  // Reset pesan hasil saat kamera diganti
  resultMessage.className =
    "mt-8 p-5 rounded-xl text-center text-white font-extrabold transition-all duration-500 bg-gray-400 shadow-inner";
  resultMessage.textContent =
    "Kamera diganti. Posisikan sampah Anda, dan pilih jenisnya.";

  // Restart webcam dengan mode baru
  startWebcam(newMode);
}

async function loop() {
  if (!isWebcamActive) {
    isLooping = false;
    return;
  }
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  if (!model || !webcam || !isWebcamActive) return;

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
