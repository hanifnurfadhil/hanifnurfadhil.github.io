let ulang = true;

while (ulang == true) {
  // menangkap pilihan player
  let p = prompt("Pilih Salah Satu = Batu, Gunting, atau Kertas");
  p = p.toLowerCase();
  console.log("p = " + p);
  // menentukan pilihan komputer scr random (generate bilangan random)
  let com = Math.random();

  if (com < 0.34) {
    com = "batu";
  } else if (com < 0.67) {
    com = "gunting";
  } else {
    com = "kertas";
  }
  console.log("com = " + com);
  // menentukan hasilnya dan menampilkan hasilnya
  let hasil;

  if (p == com) {
    hasil = "SERI";
  } else if (p == "batu") {
    //   if (com == "gunting") {
    //     hasil = "MENANG";
    //   } else {
    //     hasil = "KALAH";
    //   }
    hasil = com == "gunting" ? "MENANG" : "KALAH";
  } else if (p == "gunting") {
    //   if (com == "batu") {
    //     hasil = "KALAH";
    //   } else {
    //     hasil = "MENANG";
    //   }
    hasil = com == "batu" ? "KALAH" : "MENANG";
  } else if (p == "kertas") {
    //   if (com == "batu") {
    //     hasil = "MENANG";
    //   } else {
    //     hasil = "KALAH";
    //   }
    hasil = com == "batu" ? "MENANG" : "KALAH";
  } else {
    hasil = "memasukkan pilihan yang salah!";
  }

  console.log(hasil);

  alert(
    "Kamu memilih = " +
      p +
      "\n" +
      "Komputer memilih = " +
      com +
      "\n" +
      p +
      " vs " +
      com +
      " ==> kamu " +
      hasil
  );
  ulang = confirm("Main lagi?");
}

alert("Terima kasih sudah bermain!"); // pop up ulangi yes/no
