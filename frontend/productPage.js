const wrapper = document.querySelector(".sliderWrapper");
const menuItems = document.querySelectorAll(".menuItem");

const products = [
  {
    id: 1,
    title: "Apple iPhone 16 Pro Max",
    price: 739.00,
    colors: [
      {
        code: "black",
        img: "./img/iPhone16Promax1.jpg",
      },
      {
        code: "ultramarine",
        img: "./img/iPhone16Promax2.jpg",
      },
    ],
  },
  {
    id: 2,
    title: "Apple iPad 10th Gen",
    price: 269.00,
    colors: [
      {
        code: "blue",
        img: "./img/iPad10thGen1.jpg",
      },
      {
        code: "pink",
        img: "./img/iPad10thGen2.jpg",
      },
    ],
  },
  {
    id: 3,
    title: "Apple Watch Series 10",
    price: 329.00,
    colors: [
      {
        code: "black",
        img: "./img/AppleWatchSeries10_1.jpg",
      },
      {
        code: "silver",
        img: "./img/AppleWatchSeries10_2.jpg",
      },
    ],
  },
  {
    id: 4,
    title: "Macbook Air 2024",
    price: 999.00,
    colors: [
      {
        code: "midnight",
        img: "./img/MacbookAir2024_1.jpg",
      },
      {
        code: "silver",
        img: "./img/MacbookAir2024_2.jpg",
      },
    ],
  },
  {
    id: 5,
    title: "Microsoft Surface 2024",
    price: 949.00,
    colors: [
      {
        code: "black",
        img: "./img/MicrosoftSurface2024_1.jpg",
      },
      {
        code: "platinum",
        img: "./img/MicrosoftSurface2024_2.jpg",
      },
    ],
  },
];

let choosenProduct = products[0];

const currentProductImg = document.querySelector(".productImg");
const currentProductTitle = document.querySelector(".productTitle");
const currentProductPrice = document.querySelector(".productPrice");
const currentProductColors = document.querySelectorAll(".color");
const currentProductSizes = document.querySelectorAll(".size");

menuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    //change the current slide
    wrapper.style.transform = `translateX(${-100 * index}vw)`;

    //change the choosen product
    choosenProduct = products[index];

    //change texts of currentProduct
    currentProductTitle.textContent = choosenProduct.title;
    currentProductPrice.textContent = "$" + choosenProduct.price;
    currentProductImg.src = choosenProduct.colors[0].img;

    //assing new colors
    currentProductColors.forEach((color, index) => {
      color.style.backgroundColor = choosenProduct.colors[index].code;
    });
  });
});

currentProductColors.forEach((color, index) => {
  color.addEventListener("click", () => {
    currentProductImg.src = choosenProduct.colors[index].img;
  });
});

currentProductSizes.forEach((size, index) => {
  size.addEventListener("click", () => {
    currentProductSizes.forEach((size) => {
      size.style.backgroundColor = "white";
      size.style.color = "black";
    });
    size.style.backgroundColor = "black";
    size.style.color = "white";
  });
});

const productButton = document.querySelector(".productButton");
const payment = document.querySelector(".payment");
const close = document.querySelector(".close");

productButton.addEventListener("click", () => {
  payment.style.display = "flex";
});

close.addEventListener("click", () => {
  payment.style.display = "none";
});
