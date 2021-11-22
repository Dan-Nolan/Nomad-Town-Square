import jsCookie from 'js-cookie';

const profile = jsCookie.get('x-nomad-profile');
if(!profile) {
    window.location = "https://mynomad.quest";
}

const image = document.createElement("img"); 
const imageUrl = new URL('townsquare-inventory-1.png', import.meta.url);
image.src = imageUrl;
image.classList.add("inventory");

document.body.appendChild(image);