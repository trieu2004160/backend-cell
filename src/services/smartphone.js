const menuPhoneService = async () => {
  const result = [];

  // Hãng điện thoại
  const phoneBrands = [
    { name: "iPhone" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "OPPO" },
    { name: "realme" },
    { name: "TECNO" },
    { name: "vivo" },
    { name: "Infinix" },
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
  const phonePrices = [
    { name: "Dưới 2 triệu" },
    { name: "Từ 2 - 4 triệu" },
    { name: "Từ 4 - 7 triệu" },
    { name: "Từ 7 - 13 triệu" },
    { name: "Từ 13 - 20 triệu" },
    { name: "Trên 20 triệu" },
  ];
  result.push({ title: "Mức giá điện thoại", content: phonePrices });

  // Sản phẩm mới
  const newPhones = [
    { name: "iPad A16", tag: "MỚI" },
    { name: "Galaxy Z Flip7" },
    { name: "Galaxy Z Fold7" },
    { name: "S25 Ultra" },
    { name: "OPPO Find N5" },
    { name: "Xiaomi 15" },
    { name: "Samsung Galaxy A56" },
    { name: "Redmi Note 14" },
    { name: "Samsung Galaxy A36" },
    { name: "OPPO Reno14" },
    { name: "Nothing Phone 3A" },
    { name: "Tecno Camon 30S" },
    { name: "Xiaomi POCO C71" },
  ];
  result.push({ title: "Sản phẩm mới", content: newPhones });

  // Điện thoại HOT +
  const hotPhones = [
    { name: "iPhone 16", tag: "MỚI" },
    { name: "iPhone 15 Pro Max", tag: "MỚI" },
  ];
  result.push({ title: "Điện thoại HOT +", content: hotPhones });

  // Hãng máy tính bảng
  const tabletBrands = [
    { name: "iPad" },
    { name: "Samsung" },
    { name: "Xiaomi" },
    { name: "Huawei" },
    { name: "Lenovo" },
    { name: "Nokia" },
    { name: "Teclast" },
  ];
  result.push({ title: "Hãng máy tính bảng", content: tabletBrands });

  // Máy đọc sách
  const ebookReaders = [
    { name: "Kindle" },
    { name: "Boox" },
    { name: "Xem thêm tất cả Tablet" },
  ];
  result.push({ title: "Máy đọc sách", content: ebookReaders });

  // Máy tính bảng HOT +
  const hotTablets = [
    { name: "iPad Air M3 HOT", tag: "HOT" },
    { name: "iPad Air 2024" },
    { name: "iPad Pro 2024" },
    { name: "iPad mini 7" },
    { name: "Galaxy Tab S10 Series" },
    { name: "Galaxy Tab S9 FE 5G", tag: "MỚI" },
    { name: "Xiaomi Pad 7 Pro" },
    { name: "Xiaomi Pad 7" },
    { name: 'Huawei Matepad 11.5"S' },
    { name: "Xiaomi Pad SE" },
    { name: "Teclast M50" },
  ];
  result.push({ title: "Máy tính bảng HOT +", content: hotTablets });

  return result;
};

module.exports = {
  menuPhoneService,
};
