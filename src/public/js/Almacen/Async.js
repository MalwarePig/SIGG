async function myDisplay() {
    let myPromise = new Promise(function(myResolve, myReject) {
      myResolve("I love You !!");
    });
    document.getElementById("demo").innerHTML = await myPromise;
  }
  
  myDisplay();