let x = 10;

const promesa = new Promise((resolve, reject) =>{
    setTimeout(()=>{
        x = x * 3 + 2;
        console.log('2 - Proce terminado...');
        resolve(x);
    },2000);
})

console.log("1 - Proceso iniciado...");

promesa.then(res =>{
    console.log("3 - El valro de x es: " + x);
}).catch(error =>{
    console.error(error);
});