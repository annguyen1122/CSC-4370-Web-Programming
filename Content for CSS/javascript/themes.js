
let theme_toggler = document.querySelector('#theme_toggler'); // links js to the button in the page

theme_toggler.addEventListener('click', function(){ //when the button is clicked
    document.body.classList.toggle('light_mode');
    if(document.body.classList.contains('light_mode')){ //sets the website to light, if it's in dark mode
        localStorage.setItem('website_theme','light_mode');
    }else{ //sets the website to dark, if it's in light mode
        localStorage.setItem('website_theme','default');
    }
});

function retrieve_theme(){
    var theme = localStorage.getItem('website_theme'); // gets the saved theme from storage
    if(theme != null){
        document.body.classList.remove('default', 'light_mode'); 
        document.body.classList.add(theme);
        // adds the theme to the website
    }
}
retrieve_theme(); //runs the function

window.addEventListener("storage",function(){
    retrieve_theme(); //if the theme updates, run the retrieve_theme function to adjust the page's theme to the correct one.
},false);