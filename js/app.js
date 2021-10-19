import {
    productsData
} from './product.js';

import {
    Storage
} from './localStorage.js';

// selectors
const shopCartBtn = document.querySelector(".cart-button");
const shopCartModal = document.querySelector(".shop-cart")
const favoritetBtn = document.querySelector(".favorite");
const mainProductDiv = document.querySelector(".main-product");
const menuBarElement = document.querySelector(".menu-bar");
const menuBarBtn = document.querySelector(".menu-bar-icon");
const backDrop = document.querySelector(".backdrop");
const productDom = document.querySelector(".main-col");
const cartTotalPrice = document.querySelector(".total-price-num");
const cartCounter = document.querySelector(".cart-counter");
const cartContainerDiv = document.querySelector(".cart-container");
const clearCartBtn = document.querySelector(".clear-cart");
const favoriteContent = document.querySelector(".favorite-content");


let cart = [];
let favorite = [];
let btnDOM = [];


// declare function
function showModalFunction(a) { //toggling
    a.classList.toggle("active");
}

function hideModalFunction(a) {
    a.classList.remove("active");
}

function showEmpty(a) {
    if (a.children.length === 0) {
        a.classList.add("empty");
    } else {
        a.classList.remove("empty");
    }
}

function ShowHideElement(a) {

    if (!a.classList.contains('active')) {
        setTimeout(function () {
            a.classList.remove('visuallyhidden');
        }, 20);
        a.classList.add('active');
    } else {
        a.classList.add('visuallyhidden');
        a.addEventListener('transitionend', function (e) {
            a.classList.remove('active');
        }, {
            capture: false,
            once: true,
            passive: false
        });
    }

}

// shopCartBtn.addEventListener('click', ShowHideElement, false);

// call function & Add Event
shopCartBtn.addEventListener("click", () => {
        ShowHideElement(shopCartModal);
    hideModalFunction(mainProductDiv);
});
favoritetBtn.addEventListener("click", () => {
    ShowHideElement(mainProductDiv);
    hideModalFunction(shopCartModal);
});



menuBarBtn.addEventListener("click", () => {
    menuBarElement.classList.toggle("active");
    backDrop.classList.toggle("active");
});
backDrop.addEventListener("click", () => {
    hideModalFunction(menuBarElement);
    hideModalFunction(backDrop);
});
// Event classes
document.addEventListener("DOMContentLoaded", () => {
    const products = new Product();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.displayProducts(productsData);
    ui.setupApp();
    ui.getAddToCartBtns();
    ui.getfavoriteBtns();
    ui.getAddInFavBtn();
    ui.cartLogic();
    ui.favoriteLogic();
    Storage.saveProducts(productsData);
    showEmpty(favoriteContent);
    showEmpty(cartContainerDiv);
    // this.setCartValue();
});

//--------------------------------------------- Classes --------------------------------------------//

// get products
class Product {
    getProducts() {
        return productsData;
    }
}

// display product
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(item => {
            result += `
        <div class="product">
            <div class="product-img">
                <img src=${item.imageURL} alt="">
            </div>
            <div class="product-inf">
                <div class="product-detail">
                    <h5 class="product-name">${item.title}</h5>
                    <p class="product-cost">$ ${item.price}</p>
                </div>
                <button class="add-to-cart" data-id="${item.id}">Add to cart</button>
            </div>
            <button class="fal fa-heart product-favorite" data-id="${item.id}" ></button>
        </div>
            `;
            productDom.innerHTML = result;
        });

    }
    addFavoriteItem(favItem) {
        // const itemTotalPrice = cartItem.price * cartItem.quantity;
        const cartDiv = document.createElement("div");
        cartDiv.classList.add("favorite-product");
        cartDiv.innerHTML = `
        <img src=${favItem.imageURL} alt="">
        <button class="like" data-id="${favItem.id}"></button>
        <div class="product-more">
            <p class="product-fav-name">${favItem.title}</p>
            <button class="fal fa-shopping-bag fav-add-cart" data-id="${favItem.id}"></button>
        </div>
        `;
        favoriteContent.appendChild(cartDiv);
        showEmpty(favoriteContent);
        this.getAddInFavBtn();
    }
    getAddToCartBtns() {
        const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
        btnDOM = addToCartBtns;
        // console.log(btnDOM)
        // console.log(addToCartBtns);
        addToCartBtns.forEach(btn => {
            const id = btn.dataset.id;
            const isInCart = cart.find((pro) => parseInt(pro.id) === parseInt(id));
            if (isInCart) {
                btn.innerText = "In cart";
                btn.disabled = true;
            }

            btn.addEventListener("click", (event) => {
                // console.log(event);
                event.target.innerText = "In cart";
                event.target.disabled = true;

                const addedProduct = {
                    ...Storage.getProduct(id),
                    quantity: 1
                };

                cart = [...cart, addedProduct];
                Storage.saveCart(cart);

                this.setCartValue(cart);
                this.addCartItem(addedProduct);
            });
        })
    }
    setCartValue(cart) {

        let tempCartCounter = 0;

        const totalPrice = cart.reduce((acc, curr) => {
            tempCartCounter += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartCounter.innerText = tempCartCounter;
        cartTotalPrice.innerText = totalPrice.toFixed(2);
        cartCounter.innerText > 0 ? cartCounter.style.display = "flex" : cartCounter.style.display = "none";
        // console.log(tempCartCounter)
    }
    addCartItem(cartItem) {
        const itemTotalPrice = cartItem.price * cartItem.quantity;
        const cartDiv = document.createElement("div");
        cartDiv.classList.add("cart-product");
        cartDiv.innerHTML = `
        <button class="delete-product" data-id="${cartItem.id}"></button>
        <div class="cart-product-img">
            <img src=${cartItem.imageURL} alt="">
        </div>
        <div class="shop-inf">
            <p class="product-title">${cartItem.title}</p>
            <p class="product-price">$ ${cartItem.price}</p>
            <p class="product-total-price">$ ${itemTotalPrice}</p>
        </div>
        <div class="product-counter">
            <button class="increment" data-id="${cartItem.id}"></button>
            <span class="product-quantity">${cartItem.quantity}</span>
            <button class="decrement" data-id="${cartItem.id}" disabled ="true"></button>
        </div>
        `;
        cartContainerDiv.appendChild(cartDiv);
        showEmpty(cartContainerDiv);
    }
    getfavoriteBtns() {
        const likeBtn = [...document.querySelectorAll(".product-favorite")];
        likeBtn.forEach((btn) => {
            const id = btn.dataset.id;
            const isInFav = favorite.find((pro) => parseInt(pro.id) === parseInt(id));
            if (isInFav) {
                btn.style.fontWeight = 900;
                btn.disabled = true;
            }
            // console.log(isInFav)
            btn.addEventListener("click", (event) => {
                event.target.style.fontWeight = 900;
                event.target.disabled = true;
                const addedProduct = {
                    ...Storage.getProduct(id),
                    isLiked: true
                };
                favorite = [...favorite, addedProduct];
                // console.log(favorite);
                Storage.savedFavorite(favorite);
                this.addFavoriteItem(addedProduct);
            });
        })
    }
    getAddInFavBtn() {
        const addCartBtn = [...document.querySelectorAll(".fav-add-cart")];
        addCartBtn.forEach((btn) => {
            const id = btn.dataset.id;
            const isInCart = cart.find((pro) => parseInt(pro.id) === parseInt(id));
            if (isInCart) {
                btn.style.fontWeight = 900;
                btn.disabled = true;
            }
            // btn.addEventListener("click", (event)=>{
            //     event.target.style.fontWeight = 900;
            //     btn.disabled = true;
            //     const addedProduct = {...Storage.getProduct(id), quantity: 1};
            //     cart = [...cart, addedProduct];
            //     // console.log(favorite)
            //     Storage.saveCart(cart);
            //     this.setCartValue(cart);
            //     this.addCartItem(addedProduct);
            // });
        })
    }
    setupApp() {
        cart = Storage.getCart() || [];
        cart.forEach(item => this.addCartItem(item));
        this.setCartValue(cart);
        favorite = Storage.getFavorite() || [];
        favorite.forEach(item => this.addFavoriteItem(item));
    }
    cartLogic() {
        // clear Cart
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });

        // cart functionality
        cartContainerDiv.addEventListener("click", (event) => {
            if (event.target.classList.contains("increment")) {
                const addedItem = cart.find((ctTtem) => ctTtem.id == event.target.dataset.id);
                addedItem.quantity++;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                event.target.nextElementSibling.innerText = addedItem.quantity;
                event.target.nextElementSibling.nextElementSibling.disabled = false;
                // console.log(event.target.nextElementSibling)
            } else if (event.target.classList.contains("decrement")) {
                const substractedItem = cart.find((ctTtem) => ctTtem.id == event.target.dataset.id);
                substractedItem.quantity--;
                this.setCartValue(cart);
                Storage.saveCart(cart);
                event.target.previousElementSibling.innerText = substractedItem.quantity;
                if (substractedItem.quantity === 1) {
                    // this.removeItem(id);
                    // cartContainerDiv.removeChild(subQuantity.parentElement.parentElement);
                    // return;
                    event.target.disabled = true;
                } else {
                    event.target.disabled = false;
                }
            } else if (event.target.classList.contains("delete-product")) {
                cartContainerDiv.removeChild(event.target.parentElement);
                this.getSingleButton(event.target.dataset.id);
                this.removeItem(event.target.dataset.id);
                // console.log(cartContainerDiv.children.length)
                if (cartContainerDiv.children.length === 0) {
                    ShowHideElement(shopCartModal);
                    showEmpty(cartContainerDiv);
                }
            }
        })
    }
    favoriteLogic() {
        favoriteContent.addEventListener("click", (event) => {
            if (event.target.classList.contains("fav-add-cart")) {

                event.target.style.fontWeight = 900;
                event.target.disabled = true;

                let addedItem = favorite.find((fvItem) => fvItem.id == event.target.dataset.id);
                addedItem = {
                    ...Storage.getProduct(event.target.dataset.id),
                    quantity: 1
                };
                cart = [...cart, addedItem];
                Storage.saveCart(cart);
                this.setCartValue(cart);
                this.addCartItem(addedItem);

            } else if (event.target.classList.contains("like")) {
                event.target.style.fontWeight = 400;
                favoriteContent.removeChild(event.target.parentElement);
                // this.getSingleButton(event.target.dataset.id);
                this.removeFavItem(event.target.dataset.id);

                const likeBtn = [...document.querySelectorAll(".product-favorite")];
                likeBtn.forEach((btn) => {
                    const id = btn.dataset.id;
                    const isInFav = favorite.find((pro) => parseInt(pro.id) === parseInt(id));
                    if (!isInFav) {
                        btn.style.fontWeight = 300;
                        btn.disabled = false;
                    }
                })

                // console.log(cartContainerDiv.children.length)
                if (favoriteContent.children.length === 0) {
                    ShowHideElement(mainProductDiv);
                    showEmpty(favoriteContent);
                }
            }
        });
    }
    clearCart() {
        // cartContainerDiv.innerHTML="";
        cart.forEach((item) => this.removeItem(item.id));
        while (cartContainerDiv.children.length) {
            cartContainerDiv.removeChild(cartContainerDiv.children[0]);
        }
        ShowHideElement(shopCartModal);
        showEmpty(cartContainerDiv);
    }
    removeItem(id) {
        cart = cart.filter((cartItem) => cartItem.id != id);
        this.setCartValue(cart);
        Storage.saveCart(cart);
        this.getSingleButton(id);
    }
    removeFavItem(id) {
        favorite = favorite.filter((favItem) => favItem.id != id);
        Storage.savedFavorite(favorite);
    }
    getSingleButton(id) {
        const button = btnDOM.find((btn) => parseInt(btn.dataset.id) == parseInt(id));
        button.disabled = false;
        button.innerHTML = `add to cart`;
    }
}

// localStorage
// class Storage {

//     static saveProducts(products) {
//         localStorage.setItem("products", JSON.stringify(products));
//     }
//     static getProduct(id) {
//         const _products = JSON.parse(localStorage.getItem("products"));
//         return _products.find((p) => p.id == parseInt(id));
//         // console.log(_products);
//     }
//     static saveCart(cart) {
//         localStorage.setItem("cart", JSON.stringify(cart));
//     }
//     static getCart() {
//         return JSON.parse(localStorage.getItem("cart"));
//     }
//     static savedFavorite(favorite){
//         localStorage.setItem("favorite", JSON.stringify(favorite));
//     }
//     static getFavorite() {
//         return JSON.parse(localStorage.getItem("favorite"));
//     }
// }
