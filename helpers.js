//!gönderilen verilerii lokale localstoragee kaydedecek fonk

export const setStorage = (data) => {
  //* gelen veriyi string'e çevirme
  const strData = JSON.stringify(data);

  //*locale kaydetme

  localStorage.setItem("notes", strData);
};

//*localden eleman alır ve geri döndürür

export const getStorage = (key) => {
  //*localden string veriyi alma
  const strData = localStorage.getItem(key);
  //* veriyi js objesine çevirme
  return JSON.parse(strData);
};

//* inputtaki valuelara karşılık gelen içerikleri değiştirmek için

export const translate = {
  goto: "Ziyaret",
  home: "Ev",
  job: "İş",
  park: "Park Yeri",
};

//* iconları özelleştirme

export var userIcon = L.icon({
  iconUrl: "/images/Person.png",
  iconSize: [50, 55],
  iconAnchor: [22, 94],
  popupAnchor: [15, -85],
  shadowUrl: "/images/shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

var homeIcon = L.icon({
  iconUrl: "/images/Home_8.png",
  iconSize: [70, 75],
  iconAnchor: [22, 94],
  popupAnchor: [15, -85],
  shadowUrl: "/images/shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

var jobIcon = L.icon({
  iconUrl: "/images/Briefcase_8.png",
  iconSize: [70, 75],
  iconAnchor: [22, 94],
  popupAnchor: [15, -85],
  shadowUrl: "/images/shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

var gotoIcon = L.icon({
  iconUrl: "/images/Aeroplane_8.png",
  iconSize: [70, 75],
  iconAnchor: [22, 94],
  popupAnchor: [15, -85],
  shadowUrl: "/images/shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

var parkIcon = L.icon({
  iconUrl: "/images/Parking_8.png",
  iconSize: [70, 75],
  iconAnchor: [22, 94],
  popupAnchor: [15, -85],
  shadowUrl: "/images/shadow.png",
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});

//! iconları htmlde güncelleme

export const icons = {
  goto: gotoIcon,
  home: homeIcon,
  job: jobIcon,
  park: parkIcon,
};
