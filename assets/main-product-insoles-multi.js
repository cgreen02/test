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

/********
 * Matrix
 */

// update active variant
let formData = {
    items: []
};

// top cover is based off of sport (GOLD INSOLES)
const sportTo = {
    "Baseball/Softball": "B",
    "Basketball": "Y",
    "Biking/Cycling": "B",
    "Boxing/Wrestling": "B",
    "Cheerleading": "R",
    "Fitness": "Y",
    "Golf": "Y",
    "Hiking": "Y",
    "Football": "B",
    "Lacrosse": "B",
    "Rugby": "B",
    "Running": "Y",
    "Soccer": "R",
    "Tennis/Pickleball": "Y",
    "Track & Field": "R",
    "Volleyball": "Y",
    "Walking": "Y",
    "Other": "Y",
}


// top cover is based of weight (SILVER INSOLES)
let weightTo = {
    "99 - 120lbs": "L",
    "121 - 150lbs": "L",
    "151 - 180lbs": "H",
    "181 - 210lbs": "H",
    "211 - 230lbs": "H",
    "231 - 260lbs": "H",
    "261lbs - Up": "H"
};


// function to take variables from prodt options to a formdata item
function getFormData(options) {
    // gender is a variant (make sure something is checked)
    let gender = options.gender ?? null;

    // sport is a property
    let sport = options.sport ?? null;

    // size is a variant
    let size = options.size ?? null;

    // weight is a property
    let weight = options.weight ?? null;

    // age is a property
    let age = options.age ?? null;

    // gold & silver
    if (window.location.href.includes("gold") || window.location.href.includes("silver")) {
        // both gold and siver have top cover
        let topCover;

        // gold
        if (window.location.href.includes("gold")) {
            // top cover is variant that is dependent on the sport
            topCover = sportTo[sport];

            // the product is dependent on the weight
            product = productTo[weight];

            /******* OVERRIDES **********/
            // AFTER determining the product (based on the weight) we check on special cases
            // Note we do not touch the weight variable since it's used as a line item property
            // if they are Female and size 151-180, it changes the weight to pro level 3 from level 4 (we have another case for ages 50 and up so we exclude that)
            if (gender === "Female" && weight === "151 - 180lbs" && age !== "50 and Up") {
                product = productTo["121 - 150lbs"];
            }

            // if they are age 50 & up, we decrease the pro level by 1
            if (age === "50 and Up") {
                if (weight === "261lbs - Up") {
                    product = productTo["231 - 260lbs"];
                } else if (weight === "231 - 260lbs" || weight === "211 - 230lbs") {
                    product = productTo["181 - 210lbs"];
                } else if (weight === "181 - 210lbs" || weight === "151 - 180lbs") {
                    product = productTo["121 - 150lbs"];
                } else if (weight === "121 - 150lbs") {
                    product = productTo["99 - 120lbs"];
                }
            }
            /******* END OVERRIDES ********/

        }
        // silver
        else if (window.location.href.includes("silver")) {
            // top cover is variant that is dependent on the weight
            topCover = weightTo[weight];

            /************ OVERRIDES ************/

            // 37-H -> 37-L
            // 38-H -> 38-L
            if (
                gender == "Male" && size == "5-5.5" ||
                gender == "Female" && size == "7-7.5" ||
                gender == "Male" && size == "6-6.5" ||
                gender == "Female" && size == "8-8.5"
            ) {
                topCover = "L";
            }

            // 43-L -> 43-H
            // 44-L -> 44-H
            // 45-L -> 45-H
            if (
                gender == "Male" && size == "11-11.5" ||
                gender == "Female" && size == "13-13.5" ||
                gender == "Male" && size == "12-12.5" ||
                gender == "Male" && size == "13-13.5"
            ) {
                topCover = "H";
            }

            // athletes over 50 and 151-180 receive a topCover of L
            if (age == "50 and Up" && weight == "151 - 180lbs") {
                topCover = "L";
            }

            /*********** END OF OVERRIDES ********/
        }

        // option order is size, top cover, gender
        let selectedOptions = [size, topCover, gender];

        // find the correct variant based on the active options
        let activeVariant = null;
        for (let i = 0; i < product.variants.length; i++) {
            if (JSON.stringify(product.variants[i].options) === JSON.stringify(selectedOptions)) {
                activeVariant = product.variants[i];
                break;
            }
        }

        // check if active variant is not found in any setup
        if (activeVariant == null) {
            document.querySelector("#productATC").textContent = "Sorry, we don't offer a product that meets the selected options right now.";
            document.querySelector("#productATC").classList.add("disabled");
            document.querySelector("#productATC").classList.add("message");
            return;
        }

        // gather item
        return {
            quantity: 1,
            id: activeVariant.id,
            properties: {
                "Age": age,
                "Sport": sport,
                "Weight": weight
            }
        };
    }
    // platinum
    else if (window.location.href.includes("platinum")) {
        // gather item
        return {
            quantity: 1,
            id: activeVariant.id,
            properties: {
                "Gender": gender,
                "Sport": sport,
                "Size": size,
                "Weight": weight,
                "Age": age
            }
        };
    }
}

/**************
 Product Slider
 ***************/

// enable swiper
let productOptionSwiper = new Swiper("#productOptionSwiper", {
    allowTouchMove: false,
    autoHeight: true,
});

// update active variant on click
document.querySelectorAll(".productOptionSlideLabelInput").forEach(function (element) {
    element.addEventListener("change", function (e) {
        // skip checkbox for multi select
        if (this.getAttribute("type") === "checkbox") {
            return;
        }

        // check for multi or single change
        if (document.querySelector(`.productOptionSlideLabelInput[name="athlete"][value="single"]:checked`)) {
            document.querySelectorAll(`.productOptionSlideLabelInput[name="sport"]`).forEach(element => element.setAttribute("type", "radio"));
        } else {
            document.querySelectorAll(`.productOptionSlideLabelInput[name="sport"]`).forEach(element => element.setAttribute("type", "checkbox"));
        }

        productOptionSwiper.slideNext();

        // calculate total and complete pages
        let totalPages = document.querySelectorAll(".productOptionSlide").length;
        let completePages = 0;
        document.querySelectorAll(".productOptionSlide").forEach(element => {
            // is there at least one item checked
            if (element.querySelector(".productOptionSlideLabelInput:checked")) {
                completePages++;
            }
        });

        // not all pages are complete
        if (completePages < totalPages) {
            document.querySelector("#productOptionSwiper").classList.add("active");
            document.querySelector("#productForm").classList.remove("active");
            return;
        }

        console.log(1)

        // enable product form
        document.querySelector("#productOptionSwiper").classList.remove("active");
        document.querySelector("#productForm").classList.add("active");

        // gather options for all selected sports (this works for both single and multi)
        document.querySelectorAll(`.productOptionSlideLabelInput[name="sport"]:checked`).forEach(element => {
            // create options object
            let options = {
                sport: element.value
            };

            // update options with the values of each selected input
            document.querySelectorAll(`.productOptionSlideLabelInput:not([name="sport"]):checked`).forEach(element => {
                options[element.getAttribute("name")] = element.value;
            });

            console.log(options)

            // save pair
            document.querySelector(".productPair:not(.active)").setAttribute("options", JSON.stringify(options));
            document.querySelector(".productPair:not(.active)").classList.add("active");
        })

        updateProduct();
    });
})

// back button
document.querySelectorAll(".productOptionSlideNavBack").forEach(function (element) {
    element.addEventListener("click", function () {
        productOptionSwiper.slidePrev();
    });
});

// next button
document.querySelectorAll(".productOptionSlideNavNext").forEach(function (element) {
    element.addEventListener("click", function () {
        productOptionSwiper.slideNext();
    });
});

/*******************
 * Product Pairs
 */

// open edit
document.querySelectorAll(".productPairEdit").forEach(element => {
    element.addEventListener("click", function () {
        // save pair element
        let pairElement = this.closest(".productPair");

        // save option element
        let options = pairElement.getAttribute("options");

        // open modal
        pairElement.querySelector(".productPairModal").showModal();

        // select options
        let optionsParsed = JSON.parse(options);
        pairElement.querySelectorAll(`.productPairModalLabelSelect`).forEach(element => {
            element.value = optionsParsed[element.getAttribute("name")]
        });
    })
});

// close event
document.querySelectorAll(".productPairModal").forEach(element => {
    element.addEventListener('close', function () {
        // save pair element
        let pairElement = this.closest(".productPair");

        // check if this input has no options, then we hide it (it means they added a product with different options and canclled)
        if (!pairElement.getAttribute("options")) {
            pairElement.classList.remove("active");
        }
    });
})

// trigger close modal
document.querySelectorAll(".productPairModal,.productPairModalCancel,.productPairModalExit").forEach(element => {
    element.addEventListener("click", function (e) {
        if (e.target === this) {
            document.querySelector(".productPairModal[open]").close();
        }
    })
});

// form input events
document.querySelectorAll(".productPairModalLabelSelect").forEach(element => element.addEventListener("change", function () {
    // check if the entire form is ready
    let form = this.closest(".productPairModalContent");

    // check if all inputs are entered
    let ready = true;
    form.querySelectorAll(".productPairModalLabelSelect").forEach(input => {
        if (input.selectedIndex === 0) {
            ready = false;
        }
    });

    // update update button
    form.querySelector(".productPairModalUpdate").disabled = !ready;
}));

// update pair
document.querySelectorAll(".productPairModalContent").forEach(element => {
    element.addEventListener("submit", function (e) {
        e.preventDefault();

        // save pair element
        let pairElement = this.closest(".productPair");

        // set this option as active
        pairElement.classList.add("active");

        // update options attribute
        let options = {};
        this.closest(".productPairModal").querySelectorAll(`.productPairModalLabelSelect`).forEach(element => {
            options[element.getAttribute("name")] = element.value;
        });
        pairElement.setAttribute("options", JSON.stringify(options));

        // close modal
        document.querySelector(".productPairModal[open]").close();

        updateProduct();
    });
});

// remove
document.querySelectorAll(".productPairRemove").forEach(element => {
    element.addEventListener("click", function () {
        // save pair element
        let pairElement = this.closest(".productPair");

        // remove active and options
        pairElement.classList.remove("active");
        pairElement.removeAttribute("options");

        // update product
        updateProduct();

        // check if there are no more left
        if (document.querySelectorAll(".productPair.active").length === 0) {
            document.querySelector("#productOptionSwiper").classList.add("active");
            document.querySelector("#productForm").classList.remove("active");
            document.querySelectorAll(".productOptionSlideLabelInput:checked").forEach(element => element.checked = false);
            productOptionSwiper.slideTo(0);
        }
    });
})

// same as first
document.querySelector("#productActionSame").addEventListener("click", function () {
    // check for a free slot
    let nextFree = document.querySelector(".productPair:not(.active)");
    if (nextFree) {
        nextFree.classList.add("active");
        nextFree.setAttribute("options", document.querySelector(".productPair").getAttribute("options"));
    }
    updateProduct();
});

// new pair
document.querySelector("#productActionNew").addEventListener("click", function () {
    //check for a free slot
    let nextFree = document.querySelector(".productPair:not(.active)");
    if (nextFree) {
        nextFree.classList.add("active");
        nextFree.querySelector(".productPairModal").showModal();
    }
});


function updateProduct() {
    // reset atc button (atc active)
    document.querySelector("#productATC").textContent = "Add To Cart";
    document.querySelector("#productATC").classList.add("active");
    document.querySelector("#productATC").classList.remove("disabled");
    document.querySelector("#productATC").classList.remove("message");

    // reset form data
    formData.items = [];
    document.querySelectorAll(".productPair.active").forEach((element, index) => {
        // get formdata
        let options = JSON.parse(element.getAttribute("options"));
        let item = getFormData(options);

        // reindex
        element.querySelector(".productPairTitle").textContent = `PAIR ${index + 1} (${options.sport})`

        // check if item is not defined (variant can't be found)
        if (!item) {
            return;
        }

        // check for duplicates (id and property, if you check the entire object, the id won't match)
        for (let i = 0; i < formData.items.length; i++) {
            if (formData.items[i].id === item.id && JSON.stringify(formData.items[i].properties) === JSON.stringify(item.properties)) {
                formData.items[i].quantity++;
                return;
            }
        }
        formData.items.push(item);
    });
}

// pre-selects
function preselectURL() {
    const url = new URL(window.location.href);

    let gender = url.searchParams.get("gender");
    if (gender != null) {
        document.querySelector(`.productOptionSlideLabelInput[name="gender"][value="${gender}"]`).checked = true;
    }

    let sport = url.searchParams.get("sport");
    if (sport != null) {
        // undo sport url parameter adjustments
        sport = sport.replace("_", " & ").replace("-", "/");
        document.querySelector(`.productOptionSlideLabelInput[name="sport"][value="${sport}"]`).checked = true;
    }

    let size = url.searchParams.get("size");
    if (size != null) {
        document.querySelector(`.productOptionSlideLabelInput[name="size"][value="${size}"]`).checked = true;
    }
}

preselectURL();


/**************
 Product ATC
 ***************/

//add new product to cart
//let formData = { quantity: 1, id: 794864229, properties: { 'Personalize': 'ZHM' } };
function addProduct(formData) {
    return fetch('/cart/add.js', {
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

document.querySelector("#productATC").addEventListener("click", async function () {
    // add loading animation
    this.classList.add("loading");

    // add product
    await addProduct(formData);

    // upsell only on main insoles
    if (product.handle === "vktry-insoles-gold" || product.handle.includes("vktry-performance-insoles") || product.handle === "vktry-insoles-silver") {
        openAnkle();
    } else {
        window.location.href = `${Shopify.routes.root}cart`;
    }

    // add loading animation
    this.classList.remove("loading");
});

/********************************************** Ankle ***************************************/

// reigster modal
dialogPolyfill.registerDialog(document.querySelector("#ankle"));

function isSizeInRange(element, min, max) {
    if (element) {
        const sizeValue = element.value;
        const range = sizeValue.split('-').map(parseFloat);
        const size = parseFloat(range[0]);

        if (range.length === 2 && !isNaN(size) && size >= min && size <= max) {
            return true;
        }
    }
    return false;
}

// open ankle upsell
function openAnkle() {
    document.querySelector("#ankle").showModal()
}

// close ankle
document.querySelector("#ankle").addEventListener('close', (e) => {
    window.location.href = `${Shopify.routes.root}cart`;
});

// close ankle upsell
function closeAnkle() {
    document.querySelector("#ankle").close();
}

// close ankle event listener
document.querySelector("#ankleClose").addEventListener("click", closeAnkle);
document.querySelector("#ankle").addEventListener("click", function (e) {
    if (e.target === this) {
        closeAnkle();
    }
})
// add to cart event listener
document.querySelector("#ankleCheckout").addEventListener("click", async function () {
    this.classList.add("loading");
    let variantID;
    /*
    Men's Size 9/Women's Size 10.5 and below
     */
    const selectedGender = document.querySelector(`.productOptionSlideLabelInput[name="gender"]:checked`);
    const selectedSize = document.querySelector(`.productOptionSlideLabelInput[name="size"]:checked`);

    if (
        (selectedGender && selectedGender.value === "Male" && isSizeInRange(selectedSize, 0, 9.5)) ||
        (selectedGender && selectedGender.value === "Female" && isSizeInRange(selectedSize, 0, 10.5))
    ) {
        variantID = 41728752779435
    } else {
        variantID = 41728752812203;
    }
    await addProduct({quantity: 1, id: variantID});
    this.classList.remove("loading");

    closeAnkle();
});