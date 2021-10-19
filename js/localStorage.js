export class Storage {

    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        const _products = JSON.parse(localStorage.getItem("products"));
        return _products.find((p) => p.id == parseInt(id));
        // console.log(_products);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"));
    }
    static savedFavorite(favorite){
        localStorage.setItem("favorite", JSON.stringify(favorite));
    }
    static getFavorite() {
        return JSON.parse(localStorage.getItem("favorite"));
    }
}
