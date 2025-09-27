// tebak angka 1-10
//ada 3 kesempatan
//dalam 3x kesempatan, diberi clue lebih rendah/lebih tinggi

//Pengulangan
let ulang = true;
while (ulang == true) {
  //tampilan awal (welcome page)
  alert("SELAMAT DATANG DI GAME TEBAK ANGKA!");
  alert(
    "Kamu diminta untuk menebak angka yang dipilih komputer, mari kita mulai!"
  );

  //komputer generate random number
  let com = Math.ceil(Math.random() * 10);
  console.log("Komputer = " + com);
  alert("---KOMPUTER SUDAH MEMILIH ANGKA---");

  //input tebakan dan kesempatan
  let win = false;
  let p;

  //pencocokan input user dengan komputer sebanyak 3x kesempatan
  for (let chance = 3; chance > 0; chance--) {
    p = parseInt(prompt("Silahkan tebak angka 1-10 \nKesempatan = " + chance));
    if (p < com) {
      alert("Tebakan kamu terlalu rendah");
    } else if (p > com) {
      alert("Tebakan kamu terlalu tinggi");
    } else if (p == com) {
      win = true;
      alert("SELAMAT TEBAKAN KAMU BENAR!");
      chance = 0;
    } else {
      alert("Kamu bukan memasukkan angka!");
    }
  }

  if (win == true) {
    alert("Terima kasih sudah bermain!");
    ulang = confirm("Mau main lagi?");
  } else {
    alert("MAAF KAMU KALAH! \nAngka yang dipilih komputer = " + com);
    alert("Terima kasih sudah bermain!");
    ulang = confirm("Mau main lagi?");
  }
}
//penutup
