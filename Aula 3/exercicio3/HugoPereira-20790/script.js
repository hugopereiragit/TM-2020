function changeColors(){
 var titulosVar = document.getElementsByClassName("titulo");
 for (let titulo of titulosVar){
     // o titulo vai ser uma iteracao do titulosVar
     titulo.style.color="red";
 }
}
function getInfo(){
    var link = document.getElementById("idLink");
    var lista = document.getElementById("info");
    lista.innerHTML=
        "ID: "+ link.id + "<br>" +
        "Target: "+ link.target + "<br>" +
        "Type: "+ link.type + "<br>" +
        "Href: "+ link.href + "<br>"  ;
}

function setClick() {
    var cells = document.getElementsByTagName("td");
    console.log(cells);
    for (var i = 0; i < cells.length; i++) {
    cells[i].onclick= function (){
        this.innerText = clickId();
        this.style.backgroundColor = "green";
    }
    }
}

function clickId(){
  return prompt("novo Valor");
}

setClick();
//setTimeout(()=>setClick(), 0)
