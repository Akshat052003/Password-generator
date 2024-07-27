const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generate = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@$%&*#~`()+-/\|{}[];""?,.' ; 

let password = "" ;
let passwordLength = 10 ;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength ; 
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%" 

}
handleSlider();

function setIndicator(color){
    indicator.style.backgroundColor = color ;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`; 
}

function getRndInteger(min , max){
    return Math.floor(Math.random() * (max-min)) + min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbols(){
    const randNum = getRndInteger(0 , symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false ; 
    let hasNumber = false;
    let hasSymbol = false;
    if(upperCheck.checked) hasUpper = true;
    if(lowerCheck.checked) hasLower = true;
    if(numberCheck.checked) hasNumber = true;
    if(symbolCheck.checked) hasSymbol = true;
    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    } , 2000);
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider();
    }
    
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
});
inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value){
        copyContent() ; 
    }
})

generate.addEventListener('click' , () => {
    if(passwordLength == 0) {
        return ;
    }
    if(passwordLength < checkCount){
        checkCount++;
        handleSlider();
    }
    //finding the new password

    //remove old password
    password = "";

//     if(upperCheck.checked){
//         password = password + generateUpperCase();
//     }
//     if(lowerCheck.checked){
//         password = password + generateLowerCase();
//     }
//     if(numberCheck.checked){
//         password = password + generateRandomNumber();
//     }
//     if(symbolCheck.checked){
//         password = password + generateSymbols();
//     }
    let funcArr = [] ;
    if(upperCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowerCheck.checked){
        funcArr.push(generateLowerCase);

    }
    if(numberCheck.checked){
        funcArr.push(generateRandomNumber);

    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbols);
    }

    //compulsory addition
    for(let i=0 ; i < funcArr.length ; i++){
        password = password + funcArr[i]();
    }

    //remaining addition
    for(let i=0 ;  i < passwordLength - funcArr.length ; i++){
        let randIndex = getRndInteger(0 , funcArr.length);
        password = password + funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
})

