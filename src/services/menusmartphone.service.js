const menuPhonesmartService = async () => {
  const result = [];

  // Hãng điện thoại
  const phoneBrands = [
    { name: "iPhone" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "OPPO" },
    { name: "realme" },
    { name: "TECNO" },
    { name: "Honor" },
    { name: "vivo" },
    { name: "Nokia" },
    { name: "Nubia" },
    { name: "Nothing Phone" },
    { name: "Masstel" },
    { name: "Sony" },
    { name: "Itel" },
    { name: "Điện thoại phổ thông" },
  ];
  result.push({ title: "Hãng điện thoại", content: phoneBrands });

  // Mức giá điện thoại
  result.push({
    title: "Mức giá điện thoại",
    content: [
      { name: "Dưới 2 triệu" },
      { name: "Từ 2 - 4 triệu" },
      { name: "Từ 4 - 7 triệu" },
      { name: "Từ 7 - 13 triệu" },
      { name: "Từ 13 - 20 triệu" },
      { name: "Trên 20 triệu" },
    ],
  });

  // Điện thoại HOT +
  result.push({
    title: "Điện thoại HOT",
    content: [
      { name: "iPhone 16", tag: "MỚI" },
      { name: "iPhone 15 Pro Max", tag: "HOT" },
      { name: "Galaxy Z Fold7" },
      { name: "Galaxy Z Flip7" },
      { name: "OPPO Reno14" },
      { name: "Xiaomi 15" },
      { name: "S25 Ultra" },
      { name: "OPPO Find N5" },
      { name: "Samsung Galaxy A17 5G" },
      { name: "Redmi Note 14" },
      { name: "Samsung Galaxy A36" },
      { name: "Nothing Phone 3A" },
      { name: "Tecno Pova 7" },
      { name: "Xiaomi POCO C71" },
      { name: "Tecno Camon 30S" },
    ],
  });

  // Hãng máy tính bảng
  const tabletBrands = [
    { name: "iPad" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "Huawei" },
    { name: "Lenovo" },
    { name: "Nokia" },
    { name: "Teclast" },
    { name: "Xem thêm tất cả Tablet" },
  ];
  result.push({ title: "Hãng máy tính bảng", content: tabletBrands });

  // Máy đọc sách
  result.push({
    title: "Máy đọc sách",
    content: [{ name: "Kindle" }, { name: "Boox" }],
  });

  // Máy tính bảng HOT +
  result.push({
    title: "Máy tính bảng HOT ",
    content: [
      { name: "iPad Air M3" },
      { name: "iPad A16", tag: "HOT" },
      { name: "iPad Air 2024" },
      { name: "iPad Pro 2024" },
      { name: "iPad mini 7" },
      { name: "Galaxy Tab S10 Series" },
      { name: "Galaxy Tab S9 FE 5G" },
      { name: "Lenovo Idea Tab Wifi" },
      { name: "Xiaomi Redmi Pad 2", tag: "MỚI" },
      { name: 'Huawei MatePad 11.5"' },
      { name: "Teclast Wifi P30" },
    ],
  });

  return result;
};

module.exports = {
  menuPhonesmartService,
};
