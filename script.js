// const { readFile } = require('fs');
// const path = require('path')

// const fetchProductsJsonFile = async () => {
//     const pathProducts = path.join(__dirname, 'products.json');
//     const response = await readFile(pathProducts, 'utf-8');
//     const products = JSON.parse(response);

//     return products;
// };

const fetchProducts = async () => {
    const response = await fetch('products.json');
    const products = await response.json();
    return products;
};

const generateProductHtmlContent = (product) => {
    return `
        <div class="flex gap-2 px-2 h-full hover:scale-102 hover:bg-amber-50 duration-150 p-2 rounded-xl">
            <img src="${product.icon}" alt="${product.name}"
                class="w-26 h-26 rounded-2xl hover:-rotate-2 hover:scale-105 duration-200">
            <div class="flex flex-col justify-between w-full">
                <div>
                    <p class="font-bold text-base md:text-lg">${product.name}</p>
                    <p class="text-sm">${product.desc}</p>
                </div>
                <div class="flex justify-between px-2 w-full">
                    <p class="font-medium">R$ ${product.price.toFixed(2)}</p>
                    <button class="add-product bg-gray-700 w-12 cursor-pointer rounded hover:scale-105 duration-150 transition-colors ease-in-out active:bg-gray-950 hover:duration-300"
                        data-name="${product.name}" data-price="${product.price}">
                        <i class="fa-solid fa-cart-plus text-white"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
};

const insertProductsInHtml = async () => {
    const products = await fetchProducts();
    const main = document.querySelector('main');
    
    products.forEach(product => {
        main.innerHTML += generateProductHtmlContent(product);
    });
};

//Vars
let order = []

//Elements
const main = document.getElementById("main");
const orderbtn = document.getElementById("orderbtn");
const modalcart = document.getElementById("modalcart");
const closemodal = document.getElementById("closemodal");
const ordersquant = document.getElementById("ordersquant");


//Events
document.addEventListener('DOMContentLoaded', insertProductsInHtml);

orderbtn.addEventListener("click", () => {
    modalcart.style.display = "flex";
});

closemodal.addEventListener("click", () => {
    modalcart.style.display = "none";
});

modalcart.addEventListener("click", (event) => {
    if(event.target === modalcart) { 
        modalcart.style.display = "none";
    }
});

main.addEventListener("click", (event) => {

    //Pega o botão, se for clicado no botão ou se for em um elemento filho do botão. Busca por query
    let addButton = event.target.closest(".add-product");

    if(addButton) {
        // const product =  {name: addButton.getAttribute("data-name"), price: parseFloat(addButton.getAttribute("data-price"))}
        const product = {...addButton.dataset, price: parseFloat(addButton.dataset.price)}

        // console.log(product);
        addProductToOrder(product)

        ordersquant.innerText = parseInt(ordersquant.innerText)+1
    }

});

const addProductToOrder = (product) => { 
    const sameProduct = order.find(products => products.name === product.name)
    // console.log(sameProduct);
    if(sameProduct){
        sameProduct.quant += 1; // pointers?
    } else {
        order.push({...product, quant: 1});
    }
};