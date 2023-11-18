import {
  getStorage,
  icons,
  setStorage,
  translate,
  userIcon,
} from "./helpers.js";

//!htmlden gelenler

const form = document.querySelector("form");
const input = document.querySelector("form #title");
const cancelBtn = document.querySelector("form #cancel");
const noteList = document.querySelector("ul");
const expandBtn = document.querySelector("#checkbox");
const aside = document.querySelector(".wrapper");

/* site yüklenildiğinde "domcontentloaded olduğunda loadmap i çalıştır" */
//document.addEventListener("DOMContentLoaded", loadMap());
/* https://leafletjs.com/index.html */
/* mapi diğer fonksiyonlarda kullanmak için dışarı çıkardık. */

//!ortak değişkenler
var map;
//todo koordinatları tutmak için global scopeda bir array oluşturduk
var coords = [];
var notes = getStorage("notes") || [];
var markerLayer = [];

//! olay izleyicileri

//*Kullanıcının konumuna göre haritayı ekrana basma
function loadMap(coords) {
  /* Haritanın kurulumunu yapar */
  /* setview özelliği içerisindeki enlem ve boylam 13 değeri ise zoom oranı */
  /* L kütüphanenin ismi .map haritayı basar parantez içindeki de htmlden gelen id */
  map = L.map("map").setView(coords, 13);

  /* tilelayer kodu haritanın nasıl gözükeceğini belirler ör:sokak görünümü, fiziki harita vs. */
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  //* imleçleri tutacağımız ayrı bir katman oluşturma
  markerLayer = L.layerGroup().addTo(map);

  //harita üzerindeki markların nasıl görüneceğini belirtir.
  //marker ekler enlem ve boylama göre
  L.marker(coords, { icon: userIcon })
    //addTo(map) yazarsak haritaya ekler
    .addTo(map)
    //bindpopup markerin üzerine bir bilgilendirici popup ekler
    .bindPopup("Şimdi Buradasınız")
    //openPopup ise ekran yenilendiği anda popupun otamatik açılmasını sağlar
    .openPopup();

  // * lokalden gelen notları ekrana bas

  if (notes.length > 0) {
    aside.classList.remove("hide");
  } else {
    aside.classList.add("hide");
  }
  renderNoteList(notes);

  //* haritadaki tıklanma olaylarını izler
  map.on("click", onMapClick);
}

cancelBtn.addEventListener("click", () => {
  form.style.display = "none";
  clearForm();
  notes.length < 1 && aside.classList.add("hide");
});

//! formun gönderilmesini izleme
form.addEventListener("submit", (e) => {
  e.preventDefault();
  //? formun içindeki değerlere erişme
  const title = e.target[0].value;
  const date = e.target[1].value;
  const status = e.target[2].value;
  //? notlar dizisine bu elemanı ekle başa ekle unshift ile
  notes.unshift({
    id: new Date().getTime(),
    title,
    date,
    status,
    coords,
  });
  //*noteları listele
  renderNoteList(notes);

  //*gönderilen elemanları lokale kaydetme

  setStorage(notes);

  //* formu kapat
  form.style.display = "none";
  clearForm();
});

//* imleci ekrana basar
function renderMarker(item) {
  //? imleç oluştur
  L.marker(item.coords, { icon: icons[item.status] })
    //* imleci yeni oluşturduğumuz katmana ekle
    .addTo(markerLayer)
    //?popup ekle popupta eklediğim notun başlığı yazacak.
    .bindPopup(item.title);
}

//! not listesini ekrana basar

function renderNoteList(items) {
  //? eski elemanları temizleme tekrar basmaması için
  noteList.innerHTML = "";

  //? eski imleçleri temizler 2.kez basmasın diye

  markerLayer.clearLayers();

  //* her bir eleman için fonk çalıştırır ekrana basar.
  items.forEach((ele) => {
    // li elemanı oluştur
    const listEle = document.createElement("li");

    //* li elemanına data-id ekleme

    listEle.dataset.id = ele.id;

    //içeriğini belirleme
    listEle.innerHTML = `
    <div>
    <p>${ele.title}</p>
    <p><span>Tarih: </span> ${ele.date}</p>
    <p><span>Durum: </span> ${translate[ele.status]}</p>
    </div>
    <i id="fly" class="bi bi-airplane-fill"></i>
    <i id="delete" class="bi bi-trash3-fill"></i>
    `;
    //?htmldeki listeye gönderme
    noteList.appendChild(listEle);
    //* ekrana imleç bas
    renderMarker(ele);
  });
}

//! kullanıcının konumunu isteme
//?Kullanıcı izin verirse haritayı onun bulunduğu konumda açma
navigator.geolocation.getCurrentPosition(
  (e) => loadMap([e.coords.latitude, e.coords.longitude]),
  //! izin vermezse varsayılan enlem boylamda aç çankırıda
  () => {
    loadMap([40.6, 33.624543]);
  }
);

//*haritaya tıklanınca çalışan fonksiyonu yazalım

const onMapClick = (e) => {
  //* koordinatları ortak alana aktar
  coords = [e.latlng.lat, e.latlng.lng];
  //*tıklanıldığında formu göster
  form.style.display = "flex";
  aside.classList.remove("hide");
  checkbox.checked = true;
  //* form ekrana geldiği anda inputa focuslama
  input.focus();
};

//*formu temizler
function clearForm() {
  form[0].value = "";
  form[1].value = "";
  form[2].value = "goto";
}

//* not silme ve not koordinatlarına uçuş

noteList.addEventListener("click", (e) => {
  const found_id = e.target.closest("li").dataset.id;
  if (
    e.target.id === "delete" &&
    confirm("Silmek istediğinize emin misiniz?")
  ) {
    //* id'sini bildiğimiz elemanı diziden çıkarma  silme
    notes = notes.filter((note) => note.id !== Number(found_id));
    //*elemanı sildiğimiz için locali güncellemeliyiz.
    setStorage(notes);
    //*ekranı da güncellememiz gerekiyor
    renderNoteList(notes);
    map.flyTo([40.6, 33.624543], 14);

    notes.length < 1 && aside.classList.add("hide");
  }
  if (e.target.id === "fly") {
    //* id'sini bildiğimiz elemanın koordinatlarına erişme
    const note = notes.find((note) => note.id === Number(found_id));
    //*animasyonu çalıştır
    map.flyTo(note.coords, 15);

    //*elemanın koordinatlarında geçici bir popup oluşturma
    var popup = L.popup().setLatLng(note.coords).setContent(note.title);

    //*küçük ekranlarda uçurulduğunda menüyü kapat
    if (window.innerWidth < 769) {
      checkbox.checked = false;
      aside.classList.add("hide");
    }
    //popupu açma
    popup.openOn(map);
  }
});

//! gizle/göster
expandBtn.addEventListener("input", (e) => {
  const isChecked = e.target.checked;
  if (isChecked) {
    aside.classList.remove("hide");
  } else {
    aside.classList.add("hide");
  }
});
