/************
 Product Swiper
 ************/

// setup product swiper
let productImages = new Swiper("#productSwiper");

// thumbnail
document.querySelectorAll(".productThumbnail").forEach(function (element) {
    element.addEventListener("click", function () {
        // determine index
        let index = getElIndex(this);

        // change active slide
        productImages.slideTo(index);
    });
});


/**************
 Product Options
 ***************/

// update active variant on click
// update active variant on click
document.querySelectorAll(".optionDropdown").forEach(function (element) {
    element.addEventListener("change", function () {
        updateProduct();
    });
})

// update active variant
function updateProduct() {
    // find active options
    let selectedOptions = [];
    document.querySelectorAll(".optionDropdown").forEach(function (element) {
        selectedOptions.push(element.value);
    })

    // find the correct variant based on the active options
    for (let i = 0; i < product.variants.length; i++) {
        if (JSON.stringify(product.variants[i].options) == JSON.stringify(selectedOptions)) {
            activeVariant = product.variants[i];
            break;
        }
    }

    // update price
    document.querySelector("#productPrice").textContent = price(activeVariant.price);

    // check if the variant is in stock
    if (activeVariant.available == true) {
        document.querySelector("#productATC").classList.remove("disabled");
        document.querySelector("#productATC").textContent = "Add To Cart";
    } else {
        document.querySelector("#productATC").classList.add("disabled");
        document.querySelector("#productATC").textContent = "Sold Out";
    }
}

/****************
 * Product Quantity
 */

let quantity = 1;


/**************
 Product ATC
 ***************/

document.querySelector("#productATC").addEventListener("click", async function () {
    // add loading animation
    this.classList.add("loading");

    let formData = {
        items: [{
            quantity: quantity,
            id: activeVariant.id,
        }]
    };

    // add product
    await addProduct(formData);

    // open cart
    window.location.href = `${Shopify.routes.root}cart`;

    // remove loading animation
    this.classList.remove("loading");
});

/*** Scroll To Questions Section ***/
const haveQuestionsButton = document.querySelector("#haveQuestionsButton");

if (haveQuestionsButton) {
    haveQuestionsButton.addEventListener("click", function () {
        if (this.dataset.behavior == "scroll") {
            document.querySelectorAll(".order")[0].scrollIntoView({
                behavior: "smooth"
            });
        } else if (this.dataset.behavior == "dialog") {
            document.querySelector("#haveQuestionsDialog").showModal();
        }
    });

    /*** Dialog Listeners ***/
    if (haveQuestionsButton.dataset.behavior == "dialog") {
        document.querySelector("#haveQuestionsDialog #haveQuestionsDialogClose").addEventListener("click", function () {
            document.querySelector("#haveQuestionsDialog").close();
        })
    }
}
