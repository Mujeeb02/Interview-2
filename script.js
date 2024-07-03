let selectedColor = '';
let selectedSize = '';
let quantity = 1;
let selectedThumbnailId = '';

document.addEventListener('DOMContentLoaded', () => {
    fetchProductData();
});

async function fetchProductData() {
    try {
        const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json');
        const data = await response.json();
        populateProductData(data.product);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

function populateProductData(data) {
    document.querySelector('.product-vendor').textContent = data.vendor;
    document.querySelector('.product-title').textContent = data.title;
    document.querySelector('.current-price').textContent = data.price;
    document.querySelector('.percentage-off').textContent = calculatePercentageOff(data.price, data.compare_at_price) + '% Off';
    document.querySelector('.compare-price').textContent = data.compare_at_price;
    document.getElementById('main-image').src = "/images/img1.jfif";

    // Populate thumbnails
    const thumbnailsContainer = document.querySelector('.thumbnails');
    thumbnailsContainer.innerHTML = '';
    data.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = `/images/img${index + 1}.${index === 0 ? 'jfif' : 'jpg'}`;
        thumbnail.id = `img${index + 1}`;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.classList.add('thumbnail');
        thumbnail.onclick = () => changeImage(thumbnail.src, thumbnail.id);
        thumbnailsContainer.appendChild(thumbnail);
    });

    // Populate color options
    const colorsContainer = document.querySelector('.colors');
    colorsContainer.innerHTML = '';
    const colorOptions = data.options.find(option => option.name === 'Color');
    colorOptions.values.forEach(color => {
        const colorName = Object.keys(color)[0];
        const colorValue = color[colorName];
        const colorOption = document.createElement('div');
        colorOption.className = `color ${colorName}`;
        colorOption.style.backgroundColor = colorValue;
        colorOption.onclick = () => selectColor(colorName);

        // Add checkmark element
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        checkmark.textContent = '✓';
        colorOption.appendChild(checkmark);

        colorsContainer.appendChild(colorOption);
    });

    // Populate size options with radio buttons
    const sizesContainer = document.querySelector('.sizes');
    sizesContainer.innerHTML = '';
    const sizeOptions = data.options.find(option => option.name === 'Size');
    sizeOptions.values.forEach(size => {
        const sizeOptionWrapper = document.createElement('div');
        sizeOptionWrapper.className = 'size-option';
        const sizeOption = document.createElement('input');
        sizeOption.type = 'radio';
        sizeOption.id = `size-${size}`;
        sizeOption.name = 'size';
        sizeOption.value = size;
        sizeOption.onclick = () => selectSize(size);
        const sizeLabel = document.createElement('label');
        sizeLabel.htmlFor = `size-${size}`;
        sizeLabel.textContent = size;

        sizeOptionWrapper.appendChild(sizeOption);
        sizeOptionWrapper.appendChild(sizeLabel);
        sizesContainer.appendChild(sizeOptionWrapper);
    });

    document.querySelector('.product-description').innerHTML = data.description;
}

function calculatePercentageOff(price, comparePrice) {
    const priceNum = parseFloat(price.replace('$', ''));
    const comparePriceNum = parseFloat(comparePrice.replace('$', ''));
    return Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100);
}

function changeImage(image, id) {
    document.getElementById('main-image').src = image;
    // Remove border from previously selected thumbnail
    if (selectedThumbnailId) {
        document.getElementById(selectedThumbnailId).classList.remove('selected-thumbnail');
    }
    // Add border to the newly selected thumbnail
    const selectedThumbnail = document.getElementById(id);
    selectedThumbnail.classList.add('selected-thumbnail');
    selectedThumbnailId = id;
}


function selectColor(color) {
    selectedColor = color;

    // Remove border and checkmark from previously selected color
    const previousSelected = document.querySelectorAll('.color.selected');
    previousSelected.forEach(element => {
        element.classList.remove('selected');
        element.style.boxShadow = 'none';
    });

    // Add border and checkmark to the newly selected color
    const selectedElements = document.getElementsByClassName(color);
    for (let element of selectedElements) {
        element.classList.add('selected');
        const colorValue = getComputedStyle(element).backgroundColor;
        element.style.boxShadow = `0 0 0 4px white, 0 0 0 6px ${colorValue}`;
    }

    updateCartMessage();
}


function selectSize(size) {
    selectedSize = size;
    updateCartMessage();
}

function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').value = quantity;
        updateCartMessage();
    }
}

function increaseQuantity() {
    quantity++;
    document.getElementById('quantity').value = quantity;
    updateCartMessage();
}

function addToCart() {
    if (selectedColor && selectedSize) {
        const message = `Embrace Sideboard with Color ${selectedColor} and Size ${selectedSize} added to cart`;
        document.getElementById('cart-message').textContent = message;
    } else {
        alert('Please select a color and size');
    }
}
