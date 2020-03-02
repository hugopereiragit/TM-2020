function atualizaTexto(){
   var texto = document.getElementById("inputTexto").value;
   if(!texto.length) alert("Escreva algo no Input");
    alert(texto);
    document.getElementById("texto").innerText = texto;
}