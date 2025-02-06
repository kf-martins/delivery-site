//Vars
let order = []

//Elements
const main = document.getElementById("main");
const orderbtn = document.getElementById("orderbtn");
const modalcart = document.getElementById("modalcart");
const closemodal = document.getElementById("closemodal");
const ordersquant = document.getElementById("ordersquant");
const modalproducts = document.getElementById("modalproducts");
const totalcart = document.getElementById("totalcart");
const removeitem = document.getElementById("removeitem");
const paybuttoncart = document.getElementById("paybuttoncart");

//Functions
const fetchProducts = async () => {
    // const response = await fetch('products.json');
    const response = await fetch('/api/products');
    const products = await response.json();
    // console.log(products);

    return products;
};

const fetchOrderPost = () => {
    fetch('api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        return response.text();
    }).then(data => {
        // console.log(`Resposta: ${data}`);
        order = [];
        ordersquant.innerText = 0;
        updateModalCart();

    }).catch(error => {
        console.log(`Ocorreu um erro ao enviar o pedido! Erro: ${error}`);
        
    });
}

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

const showModal = () => {
    modalcart.style.display = "flex";
    modalcart.querySelector('.modal-content').animate([
        { opacity: 0, transform: 'translateY(50px)' },
        { opacity: 1, transform: 'translateY(0)' }
    ], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards'
    });

    updateModalCart();
}

const hideModal = () => {
    const animation = modalcart.querySelector('.modal-content').animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(50px)' }
    ], {
        duration: 200,
        easing: 'ease-out',
        fill: 'forwards'
    });

    animation.onfinish = () => {
        modalcart.style.display = "none";
    };
}

const addProductToOrder = (product) => {
    const sameProduct = order.find(products => products.name === product.name)
    // console.log(sameProduct);
    if (sameProduct) {
        sameProduct.quant += 1; // pointers?
    } else {
        order.push({ ...product, quant: 1 });
    }
};

const updateModalCart = () => {

    modalproducts.innerHTML = ``;
    let total = 0.00;

    order.forEach(product => {
        modalproducts.innerHTML += `
            <div class="w-full flex justify-between items-center my-2">
                <div class="flex flex-col items-start">
                    <p class="font-bold ">${product.name}</p>
                    <p>Quantidade: ${product.quant}</p>
                    <p>Preço: R$ ${(product.price * product.quant).toFixed(2)}</p>
                </div>

                <button class="remove-product cursor-pointer text-red-950" data-name="${product.name}">
                    Remover
                </button>
            </div>
        `;

        total += (product.price * product.quant);
        // console.log(total);
    });

    totalcart.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

//Events
document.addEventListener('DOMContentLoaded', insertProductsInHtml);

orderbtn.addEventListener("click", showModal);

closemodal.addEventListener("click", hideModal);

modalcart.addEventListener("click", (event) => {
    if (event.target === modalcart) {
        hideModal()
    }
});

main.addEventListener("click", (event) => {
    //Pega o botão, se for clicado no botão ou se for em um elemento filho do botão. Busca por query
    let addButton = event.target.closest(".add-product");

    if (addButton) {
        // const product =  {name: addButton.getAttribute("data-name"), price: parseFloat(addButton.getAttribute("data-price"))}
        const product = { ...addButton.dataset, price: parseFloat(addButton.dataset.price) }

        // console.log(product);
        addProductToOrder(product)
        ordersquant.innerText = order.length;
    }
});

modalproducts.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-product")) {
        const name = event.target.getAttribute("data-name");

        const indexOrder = order.findIndex(product => product.name === name);
        order.splice(indexOrder, 1);

        updateModalCart();
        ordersquant.innerText = order.length;
    }
});

paybuttoncart.addEventListener("click", () => {
    if(order.length === 0){
        // TODO: Fazer uma notificação para caso o pedido esteja vazio
        alert(`Nenhum produto foi adicionado!`);
        
    } else {
        fetchOrderPost();
    }
});