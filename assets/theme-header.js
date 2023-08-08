// open nav
function openNav() {
    document.querySelector("#slider").classList.add("active");
    document.querySelector("body").classList.add("noScroll");
}

// close nav
function closeNav() {
    document.querySelector("#slider").classList.remove("active");
    document.querySelector("body").classList.remove("noScroll");
}

// open nav event listener
document.querySelector("#headerMenu").addEventListener("click", openNav);

//close nav event listener
document.querySelectorAll(".closeNav").forEach(function (element) {
    element.addEventListener("click", closeNav);
});

// open nested nav
document.querySelectorAll(".sliderNavItem.dropdown").forEach(function (element) {
    element.addEventListener("click", function () {
        this.classList.toggle("active");
    });
});