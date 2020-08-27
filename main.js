window.onload = main;

function main(){

    window.addEventListener('contextmenu', function(e){
        
        e.preventDefault();
    
    });

}

function getEl(id){return document.getElementById(String(id));}