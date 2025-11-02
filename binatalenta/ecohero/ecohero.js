// Link model Teachable Machine Anda
const URL = "https://teachablemachine.withgoogle.com/models/LZguVfn4B/";

let model, webcam, maxPredictions;
let bestClass = "unknown";
let isWebcamActive = false;
// KODE BARU START: Variabel state untuk kamera dan model
let isModelLoaded = false;
let isLooping = false;
let currentFacingMode = "environment"; // Default ke kamera belakang/lingkungan
// KODE BARU END

// Element DOM
const webcamContainer = document.getElementById("webcam-container");
const labelContainer = document.getElementById("label-container");
const initMessage = document.getElementById("init-message");
const startButton = document.getElementById("start-button");
const toggleButton = document.getElementById("toggle-camera-button"); // KODE BARU: Referensi tombol toggle
const resultMessage = document.getElementById("result-message");

const organikButton = document.querySelector(".organik");
const kertasButton = document.querySelector(".kertas");
const plastikButton = document.querySelector(".plastik");
const logamButton = document.querySelector(".logam");
const allButtons = [organikButton, kertasButton, plastikButton, logamButton];

// --- FUNGSI UTAMA TEAHCABLE MACHINE ---

// KODE DIUBAH START: Memuat model hanya sekali dan memanggil startWebcam
async function init() {
  if (isModelLoaded) {
    // Jika model sudah dimuat, langsung mulai ulang webcam (jika sebelumnya dimatikan)
    if (!isWebcamActive) {
      await startWebcam(currentFacingMode);
    }
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
// KODE DIUBAH END: Memuat model hanya sekali dan memanggil startWebcam

// KODE BARU START: Fungsi untuk memulai atau mengganti webcam
async function startWebcam(mode) {
  // Hentikan webcam yang ada jika aktif
  if (webcam && webcam.webcam) {
    webcam.stop();
    isWebcamActive = false;
  }

  // Setup webcam baru
  const flip = mode === "user"; // Flip untuk kamera depan
  webcam = new tmImage.Webcam(250, 250, flip);

  const videoConstraints = {
    width: 250,
    height: 250,
    facingMode: mode, // 'environment' (belakang) atau 'user' (depan)
  };

  try {
    await webcam.setup({ video: videoConstraints });
    await webcam.play();
    isWebcamActive = true;
    currentFacingMode = mode; // Pastikan mode saat ini diperbarui

    // Update DOM
    webcamContainer.innerHTML = "";
    webcamContainer.appendChild(webcam.canvas);
    initMessage.textContent = ""; // Hapus pesan inisialisasi jika ada

    // Update tombol toggle
    if (mode === "environment") {
      toggleButton.innerHTML =
        '<i class="fas fa-camera-rotate mr-2"></i> Ganti ke Depan';
    } else {
      toggleButton.innerHTML =
        '<i class="fas fa-camera-rotate mr-2"></i> Ganti ke Belakang';
    }

    // Mulai loop prediksi jika belum berjalan
    if (!isLooping) {
      window.requestAnimationFrame(loop);
      isLooping = true;
    }
  } catch (e) {
    console.error(`Gagal mengatur webcam ke mode ${mode}:`, e);

    if (mode === "environment" && currentFacingMode === "environment") {
      // Jika gagal menggunakan mode 'environment', coba mode 'user' sebagai fallback
      console.log("Mencoba kamera depan sebagai fallback...");
      currentFacingMode = "user";
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
  if (!isWebcamActive) return;

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
// KODE BARU END: Fungsi untuk memulai atau mengganti webcam

// KODE DIUBAH START: Kontrol loop agar berhenti jika webcam tidak aktif
async function loop() {
  if (!isWebcamActive) {
    isLooping = false;
    return;
  }
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}
// KODE DIUBAH END: Kontrol loop agar berhenti jika webcam tidak aktif

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
