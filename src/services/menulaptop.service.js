const menuLaptopService = async () => {
  const result = [];

  // Temporary hardcode brands cho laptop
  const laptopBrands = [
    { name: "Apple" },
    { name: "Samsung" },
    { name: "ASUS" },
    { name: "Dell" },
    { name: "HP" },
    { name: "Lenovo" },
    { name: "Acer" },
    { name: "MSI" },
  ];

  result.push({ title: "Thương hiệu", content: laptopBrands });

  result.push({
    title: "Phân khúc giá",
    content: [
      { name: "Dưới 10 triệu" },
      { name: "Từ 10 - 15 triệu" },
      { name: "Từ 15 - 20 triệu" },
      { name: "Từ 20 - 25 triệu" },
      { name: "Từ 25 - 30 triệu" },
    ],
  });

  result.push({
    title: "Nhu cầu sử dụng",
    content: [
      { name: "Văn phòng" },
      { name: "Gaming" },
      { name: "Mỏng nhẹ" },
      { name: "Đồ họa - kỹ thuật" },
      { name: "Sinh viên" },
      { name: "Cảm ứng" },
      { name: "Laptop AI", tag: "MỚI" },
      { name: "Mac CTO – Nâng cấp theo cách của bạn", tag: "HOT" },
    ],
  });

  result.push({
    title: "Dòng chip",
    content: [
      { name: "Laptop Core i3" },
      { name: "Laptop Core i5" },
      { name: "Laptop Core i7" },
      { name: "Laptop Core i9" },
      { name: "Apple M1 Series" },
      { name: "Apple M3 Series", tag: "MỚI" },
      { name: "Apple M4 Series" },
      { name: "AMD Ryzen" },
      { name: "Intel Core Ultra", tag: "HOT" },
    ],
  });

  result.push({
    title: "Kích thước màn hình",
    content: [
      { name: "Laptop 12 inch" },
      { name: "Laptop 13 inch" },
      { name: "Laptop 14 inch" },
      { name: "Laptop 15.6 inch" },
      { name: "Laptop 16 inch" },
    ],
  });
  return result;
};
module.exports = {
  menuLaptopService,
};
