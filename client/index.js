


function createProductElement(product, mode) {
    const productElement = document.createElement('div');
    productElement.id = product.id;
    productElement.classList.add('product');
    const img = document.createElement('img');
    img.src = product.image;
    img.classList.add('product-img');
    productElement.insertAdjacentElement('beforeend', img);
    const productName = document.createElement('h3');
    productName.innerText = product.name;
    productElement.insertAdjacentElement('beforeend', productName);
    const productDescription = document.createElement('p');
    productDescription.innerText = product.description;
    productElement.insertAdjacentElement('beforeend', productDescription);
    const productPrice = document.createElement('p');
    productPrice.innerText = product.price;
    productElement.insertAdjacentElement('beforeend', productPrice);
    if (mode === 'buy') {
        if (product.inventory > 0) {
            productElement.insertAdjacentElement('beforeend', createButtonElement('Add to cart', product.id, mode));
        } else {
            const outOfStock = document.createElement('h3');
            outOfStock.innerText = 'Out Of Stock';
            productElement.insertAdjacentElement('beforeend', outOfStock);
        }
    } else {
        productElement.insertAdjacentElement('beforeend', createButtonElement('Edit Product', product.id, mode));
    }

    return productElement;
}



async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch {
        console.error(error);
    }
}

async function renderHTML(root, mode) {
    const products = await fetchData('/api');
    const productElements = document.createElement('div');
    productElements.classList.add('products');
    products.forEach(product => {
        const currentProduct = createProductElement(product, mode);
        productElements.insertAdjacentElement('beforeend', currentProduct);
    });
    root.insertAdjacentElement('beforeend', productElements);
}

async function makeHTMLPages() {

    await makeEditorHtml()

    await makeClientHtml()
}

async function makeEditorHtml() {
    const editorPage = document.createElement('div');
    editorPage.id = 'editorPage';
    editorPage.style.display = 'block';

    const editorHeader = document.createElement('h1');
    editorHeader.innerText = 'Editor Page';
    editorPage.appendChild(editorHeader);


    const editorSwitchButton = document.createElement('button');
    editorSwitchButton.innerText = 'Switch to Client Page';
    editorSwitchButton.onclick = async () => {
        await switchPage('clientPage');

    };
    editorPage.appendChild(editorSwitchButton);
    editorPage.appendChild(createButtonElement('Add Product', '', 'add'));
    const editorProductList = document.createElement('div');
    editorProductList.id = 'editorProductList';
    editorProductList.classList.add('products');
    editorPage.appendChild(editorProductList);
    await renderHTML(editorProductList, 'edit');

    document.body.appendChild(editorPage);
}

async function makeClientHtml() {
    const clientPage = document.createElement('div');
    clientPage.id = 'clientPage';
    clientPage.style.display = 'none';

    const clientHeader = document.createElement('h1');
    clientHeader.innerText = 'Welcome to SwiftCart';
    clientPage.appendChild(clientHeader);

    const clientSwitchButton = document.createElement('button');
    clientSwitchButton.innerText = 'Switch to Editor Page';
    clientSwitchButton.onclick = async () => {
        await switchPage('editorPage');

    };
    clientPage.appendChild(clientSwitchButton);

    clientPage.appendChild(createButtonElement('Check Out','','checkout'));

    const clientProductList = document.createElement('div');
    clientProductList.id = 'clientProductList';
    clientProductList.classList.add('products');
    clientPage.appendChild(clientProductList);
    await renderHTML(clientProductList, 'buy');

    document.body.appendChild(clientPage);
}

async function switchPage(pageId) {
    const editorPage = document.getElementById('editorPage');
    const clientPage = document.getElementById('clientPage');

    if (pageId === 'clientPage') {
        editorPage.style.display = 'none';
        clientPage.style.display = 'block';

    } else {
        clientPage.style.display = 'none';
        editorPage.style.display = 'block';

    };
};

function createButtonElement(innerText, id, classHTML) {
    const buttonElement = document.createElement('button');
    buttonElement.innerText = innerText
    buttonElement.id = id
    buttonElement.classList.add(classHTML);
    return buttonElement;
}

function createSubmitButton(type, innerText, method) {
    const buttonElement = document.createElement('button');
    buttonElement.type = type;
    buttonElement.innerText = innerText;
    
    buttonElement.method = method;
    return buttonElement;
}

function inputElement (placeholder, className, value) {
    const inputElement = document.createElement('input');
    inputElement.placeholder = placeholder;
    inputElement.className = className;
    inputElement.value = value;

    return inputElement;
};

function createModal (artifact, callback) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
modal.appendChild(callback(artifact))
    return modal;
};

function checkModal () {
    const existingModal = document.querySelector('.modal');
    
        existingModal.remove();
}

function toggleModal() {
    const modal = document.querySelector('.modal');
    modal.classList.toggle('show');
};

function createForm(artifact) {
    const formElement = document.createElement('form');
    formElement.setAttribute('data-id', artifact.id);
    formElement.appendChild(inputElement('name', 'name', artifact.name));
    formElement.appendChild(inputElement('description', 'description', artifact.description));
    formElement.appendChild(inputElement('price', 'price', artifact.price));
    formElement.appendChild(inputElement('inventory', 'inventory', artifact.inventory))
    formElement.appendChild(inputElement('image', 'image', artifact.image))
    formElement.appendChild(createSubmitButton('submit', 'change', "PUT"))
    formElement.appendChild(createSubmitButton('submit', 'update', "PATCH"))
    formElement.appendChild(createSubmitButton('submit', 'delete', "DELETE"))
    formElement.appendChild(createButtonElement('close', '', 'close'))
    return formElement
}
async function addProductToCart(id) {
    const response=await fetch(`/cart/${id}`,{
        method: "POST",
        body: "DONE"
    });
    const cartCount = await response.json();
    const button=document.querySelector('.checkout');
    button.innerText=`Check Out (${cartCount})`;
}

function allClicks() {
    document.addEventListener('click', async (event) => {
        if (event.target.tagName === 'BUTTON') {
            if (event.target.classList.contains('buy')) {
                addProductToCart(event.target.id);
            }
            if (event.target.classList.contains('edit')) {
                console.log('edit');
                const index = parseInt(event.target.parentElement.id);
                console.log(index)
                const artifact = await fetchData(`/api/${index}`);
                const modal = createModal(artifact, createForm);
                document.body.appendChild(modal);
                toggleModal()

            }
        }
    });
}





function main() {
    makeHTMLPages();
    allClicks();



}
main();