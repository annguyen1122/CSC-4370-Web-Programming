
let theme_toggler = document.querySelector('#theme_toggler');

theme_toggler.addEventListener('click', function(){ 
    document.body.classList.toggle('light_mode');
    if(document.body.classList.contains('light_mode')){
        localStorage.setItem('website_theme','light_mode');
    }else{
        localStorage.setItem('website_theme','default');
    }
});

function retrieve_theme(){
    var theme = localStorage.getItem('website_theme'); 
    if(theme != null){
        document.body.classList.remove('default', 'light_mode'); 
        document.body.classList.add(theme);
    }
}
retrieve_theme();

window.addEventListener("storage",function(){
    retrieve_theme();
},false);