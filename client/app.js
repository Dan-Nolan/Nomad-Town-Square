import jsCookie from 'js-cookie';

const profile = jsCookie.get('x-nomad-profile');
if(!profile) {
    window.location = "https://mynomad.quest";
}

// if