let ulang = true;

while (ulang == true) {
  // welcome page
  alert("SELAMAT DATANG DI GAME PENGENALAN POLA");

  // penjelasan game
  alert("Tugas kamu adalah memasukkan angka secara random sebanyak 10x.");
  alert("Setiap angka akan mengeluarkan hasil yang berbeda");
  alert("Catat hasilnya, dan tentukan polanya!");

  // user memasukkan angka (1-10) (pengulangan 10x)
  // pengecekan setiap angka ganjil dan genap
  let p;
  for (let a = 1; a <= 10; a++) {
    p = parseInt(prompt("Masukkan angka berapapun! \nKesempatan ke - " + a));

    if (p % 2 == 0) {
      alert(p + " = Bakso");
    } else if (p % 2 == 1) {
      alert(p + " = Sate");
    } else {
      alert("Yang kamu masukkan bukan angka!");
      a--;
    }
  }

  alert("Kamu sudah memasukkan angka 10x");
  alert("Kira-kira polanya apa ya?\nDiskusikan dengan gurumu!");
  alert("Terima kasih sudah bermain!");

  ulang = confirm("Mau main lagi?");
}
