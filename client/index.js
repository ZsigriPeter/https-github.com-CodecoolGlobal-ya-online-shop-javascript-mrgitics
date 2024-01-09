


function createProductElement(product) {
    const productElement=document.createElement('div');
    productElement.id=product.id;
    productElement.classList.add('product');
    const img=document.createElement('img');
    img.src=product.image;
    img.classList.add('product-img');
    productElement.insertAdjacentElement('beforeend',img);
    const productName=document.createElement('h2');
    productName.innerText=product.name;
    productElement.insertAdjacentElement('beforeend',productName);
    const productDescription=document.createElement('p');
    productDescription.innerText=product.description;
    productElement.insertAdjacentElement('beforeend',productDescription);
    const productPrice=document.createElement('p');
    productPrice.innerText=product.price;
    productElement.insertAdjacentElement('beforeend',productPrice);

    return productElement;
}

async function fetchData(url) {
    try {
        const response=await fetch(url);
        const data=await response.json();
        return data;
    } catch {
        console.error(error);
    }
}

async function renderHTML(root) {
    const products=await fetchData('/api');
    const productElements=document.createElement('div');
    productElements.classList.add('products');
    products.forEach(product => {
        const currentProduct=createProductElement(product);
        productElements.insertAdjacentElement('beforeend',currentProduct);
    });
    root.insertAdjacentElement('beforeend',productElements);
}


function main() {
    const root=document.querySelector('#root');

    renderHTML(root);

}
main();