let array = Array.from({
    length: 5
}, () => new Array());

function findPos(letter){
    for (let index = 0; index < array.length; index++) {
        if(array[index].includes(letter))
            return [index,array[index].indexOf(letter)];
    }
}

function encryptCouple(letter1, letter2){
    let x = findPos(letter1);
    let y = findPos(letter2);
    if(x[0]===y[0]){
        let ch1 = x[1]===4?array[x[0]][0]:array[x[0]][x[1]+1];
        let ch2 = y[1]===4?array[y[0]][0]:array[y[0]][y[1]+1];
        return [ch1,ch2];
    }
    if(x[1]===y[1]){
        let ch1 = x[0]===4?array[0][x[1]]:array[x[0]+1][x[1]];
        let ch2 = y[0]===4?array[0][y[1]]:array[y[0]+1][y[1]];
        return [ch1,ch2];
    }
    let ch1 = array[x[0]][y[1]];
    let ch2 = array[y[0]][x[1]];
    return [ch1,ch2];
}

function decryptCouple(letter1, letter2){
    let x = findPos(letter1);
    let y = findPos(letter2);
    if(x[0]===y[0]){
        let ch1 = x[1]===0?array[x[0]][4]:array[x[0]][x[1]-1];
        let ch2 = y[1]===0?array[y[0]][4]:array[y[0]][y[1]-1];
        return [ch1,ch2];
    }
    if(x[1]===y[1]){
        let ch1 = x[0]===0?array[4][x[1]]:array[x[0]-1][x[1]];
        let ch2 = y[0]===0?array[4][y[1]]:array[y[0]-1][y[1]];
        return [ch1,ch2];
    }
    let ch1 = array[x[0]][y[1]];
    let ch2 = array[y[0]][x[1]];
    return [ch1,ch2];
}

function createMatrix(key){
    let alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ".split("");
    let setKeyword = Array.from(new Set(key.replace("J","I")));

    for (const row of array) {
        while(row.length<5){
            if(setKeyword.length>0)
                row.push(setKeyword.shift());
            else{
                let letter = alphabet.shift();
                if(!key.includes(letter))
                    row.push(letter);
            }
        }
    }
}

function encrypt(){
    let plain_text = document.getElementById('input_plain_text').value;
    let key = document.getElementById('key_encrypt').value.toUpperCase();
    key = Array.from(key).filter(function(letter){
        return letter.match(/[A-Z]/i);
    }).join("");
    let cipher_text = document.getElementById('cipher_text');
    let result = "";
    let res = /^[a-zA-Z]+$/.test(key);
    if(!res) {
        showSnakeBar();
        return;
    }

    createMatrix(key);

    let plain_text_array = Array.from(plain_text.toUpperCase().replace("J","I")).filter(function(letter){
        return letter.match(/[a-zA-Z]/i);
    });
    let i = 0;
    while (i<plain_text_array.length) {
        if(plain_text_array[i]===plain_text_array[i+1])
            plain_text_array.splice(i+1,0,"X");
        i+=2;
    }

    if(plain_text_array.length%2>0)
        plain_text_array.push("X");

    let cipher_text_array = [];
    for (let i = 0; i < plain_text_array.length; i+=2) {
        cipher_text_array = cipher_text_array.concat(encryptCouple(plain_text_array[i],plain_text_array[i+1]));
    }
    
    result = cipher_text_array.join("")

    cipher_text.innerHTML = result;

}

const pressEnterEncrypt = (e, flag)=>{
    if(e.key === "Enter"){
        flag ? encrypt() : decrypt();
    }

}

function showSnakeBar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
  }

const saveFileEncrypt = () => {
    result = document.getElementById("cipher_text").innerHTML;
    handleSaveFile(result,"ciphertext.txt");
}

function decrypt(){
    let cipher_text = document.getElementById('input_cipher_text').value;
    let key = document.getElementById('key_decrypt').value.toUpperCase();
    key = Array.from(key).filter(function(letter){
        return letter.match(/[A-Z]/i);
    }).join("");
    let plain_text = document.getElementById('plain_text');
    let plain_text_array = [];
    let result = "";
    let res = /^[a-zA-Z]+$/.test(key);
    if(!res) {
        showSnakeBar();
        return;
    }

    createMatrix(key);

    let cipher_text_array = Array.from(cipher_text.toUpperCase().replace("J","I")).filter(function(letter){
        return letter.match(/[a-zA-Z]/i);
    });

    for (let i = 0; i < cipher_text_array.length; i+=2) {
        plain_text_array = plain_text_array.concat(decryptCouple(cipher_text_array[i],cipher_text_array[i+1]));
    }

    result = plain_text_array.join("");
    
    plain_text.innerHTML = result;
}

const saveFileDecrypt = () => {
    result = document.getElementById("plain_text").innerHTML;
    // if(result!=="")
    handleSaveFile(result,"plaintext.txt");
}

async function handleSaveFile(result,fileName){
    if(result==="") return;
    if( window.showSaveFilePicker ) {
        const handle = await showSaveFilePicker({
            suggestedName: fileName,
        types: [{
          description: 'txt',
          accept: {
            'text/markdown': ['.txt'],
          },    
        }],
      });
      const writable = await handle.createWritable();
      await writable.write( result );
      writable.close();
    }
    else {
      const SaveFile = document.createElement( "a" );
      SaveFile.href = URL.createObjectURL( result );
      SaveFile.download= fileName;
      SaveFile.click();
      setTimeout(() => URL.revokeObjectURL( SaveFile.href ), 60000 );
    }
  }

