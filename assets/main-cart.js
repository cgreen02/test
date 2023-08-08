/*****************Navadium***********************/


// active navadium variant used when atc is clicked
let navadiumVariant = null;

// remove navadium and determine which variant to add
async function setupNavadium() {
    // remove navadium product and calculate total
    for (let i = 0; i < cart.items.length; i++) {
        if (cart.items[i].handle === "navidium-shipping-protection") {
            await changeProduct({quantity: 0, id: cart.items[i].key});
            window.location.reload();
        }
    }

    // determine variant we're looking for
    let key = parseFloat(document.querySelector("#cartTotal").getAttribute("zmoney")) * 0.04 / 100;

    // find variant
    for (let i = 0; i < navadium.variants.length; i++) {
        let variant = parseFloat(navadium.variants[i].option1);
        if (key < variant) {
            // save variant id
            navadiumVariant = navadium.variants[i];
            break;
        }
    }

    // check if variant is null (meaning the most expensive one)
    if (navadiumVariant == null) {
        navadiumVariant = navadium.variants[navadium.variants.length - 1];
    }

    // update cost of protection
    document.querySelector(".shipping-protection-price").textContent = price(navadiumVariant.price)

    updateCartPricing();
}


// check if navadium is activated
function updateCartPricing() {
    let shippingProtectionActive = Shopify.country === "US" && document.querySelector("#shippingProtectionCheckBox").checked;
    let subtotal = parseInt(document.querySelector("#cartSubtotal").getAttribute("zmoney"));
    let total = parseInt(document.querySelector("#cartTotal").getAttribute("zmoney"));

    if (shippingProtectionActive) {
        document.querySelector(".nvd-selected").style.display = "block";
        document.querySelector(".nvd-dis-selected").style.display = "none";
        document.querySelector("#cartSubtotal").textContent = price(subtotal + navadiumVariant.price);
        document.querySelector("#cartTotal").textContent = price(total + navadiumVariant.price);
    } else {
        // navadium is US only
        if (Shopify.country === "US") {
            document.querySelector(".nvd-selected").style.display = "none";
            document.querySelector(".nvd-dis-selected").style.display = "block";
        }
        document.querySelector("#cartSubtotal").textContent = price(subtotal);
        document.querySelector("#cartTotal").textContent = price(total);
    }
}


// only setup navadium in the US
if (Shopify.country === "US") {
    setupNavadium();
    document.querySelector("#shippingProtectionCheckBox").addEventListener("change", updateCartPricing);
}

// update pricing
updateCartPricing();

/****************Checkout ATC************************/

// checkout
document.querySelector("#cartInfoSummaryCheckout").addEventListener("click", async function () {
    this.classList.add("loading");

    // update platinum insoles
    for (let i = 0; i < document.querySelectorAll(".cartBodyItemCustomTextarea").length; i++) {
        let element = document.querySelectorAll(".cartBodyItemCustomTextarea")[i];
        let key = element.dataset.key;
        let properties = cart.items.filter(item => item.key === key)[0].properties;
        properties.Note = element.value;
        await changeProduct({
            id: key,
            properties: properties
        })
    }

    // determine gold insoles count
    let insoleCount = 0;
    cart.items.forEach(function (item) {
        if (item.title.includes("Gold VK") || item.title.includes("Silver VK")) {
            insoleCount += item.quantity;
        }
    });

    // check if we need to add navadium
    if (Shopify.country === "US" && document.querySelector("#shippingProtectionCheckBox").checked) {
        await addProduct({quantity: 1, id: navadiumVariant.id})
    }

    // determine discount
    if (vktrySettings.multi_buy) {
        if (insoleCount === 2) {
            window.location.href = `/checkout?discount=INSOLES-15`;
        } else if (insoleCount > 2 && insoleCount < 5) {
            window.location.href = `${Shopify.routes.root}checkout?discount=INSOLES-20`;
        } else if (insoleCount >= 5) {
            window.location.href = `${Shopify.routes.root}checkout?discount=INSOLES-25`;
        } else {
            window.location.href = `${Shopify.routes.root}checkout`;
        }
    } else {
        window.location.href = `${Shopify.routes.root}checkout`;
    }

    this.classList.remove("loading")
});

