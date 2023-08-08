/**************
 Global
 ***************/

// get index of a specific element
function getElIndex(el) {
    let i;
    for (i = 0; el = el.previousElementSibling; i++) ;
    return i;
}

//add new product to cart
//let formData = { quantity: 1, id: 794864229, properties: { 'Personalize': 'ZHM' } };
function addProduct(formData) {
    return fetch(`${Shopify.routes.root}cart/add.js`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(function (data) {
            return data.json();
        })
}

//change an existing product in your cart
//let formData = { quantity: 1, id: 794864229 };
function changeProduct(formData) {
    return fetch(`${Shopify.routes.root}cart/change.js`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(function (data) {
            return data.json();
        })
}

//update cart note or attributes (_ for attributes are hidden and __ are private)
//let formData = { note: 'This is a note about my order', attributes: { 'Gift wrap': 'Yes' } }
function updateCart(formData) {
    return fetch(`${Shopify.routes.root}cart/update.js`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(function (data) {
            return data.json();
        })
}

//download product
function downloadProduct(handle) {
    return fetch(`${Shopify.routes.root}/products/${handle}.js`)
        .then(function (data) {
            return data.json();
        })
        .then(function (data) {
            return data;
        })
        .catch((error) => {
            return false;
        });
}


// print price ($51.27 = 5127)
function price(amount) {
    let total = (parseFloat(amount) / 100).toFixed(2);
    return `${currency}${total.replace(".00", "")}`;
}

// tool tip
document.querySelectorAll(".tool-tip").forEach(function (element) {
    element.addEventListener("click", async function () {
        await Swal.fire({
            text: this.dataset.value
        });
    });
});


/*******
 * Smooth Scroll
 **********/

document.querySelectorAll("[href^='#'].scrollTo").forEach(function (element) {
    element.addEventListener("click", function (e) {
        e.preventDefault();

        // mobile customize override
        if (window.innerWidth < 750 && this === document.querySelector("#athletesButton")) {
            window.scroll({
                top: document.querySelector("#benefit").offsetTop - 700,
                behavior: 'smooth'
            });
            return;
        }

        // check if element exists
        let scrollTo = document.querySelector(element.getAttribute("href"));

        // check for null
        if (!scrollTo) {
            scrollTo = document.querySelector(element.getAttribute("href").replace("#", "."));
        }

        window.scroll({
            top: scrollTo.offsetTop,
            behavior: 'smooth'
        });
    })
});
