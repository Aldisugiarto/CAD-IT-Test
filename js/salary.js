//******************************************/
// Author       : Aldi Sugiarto
// Data         : March, 2nd 2022
// Filename     : salary.js
//******************************************/

// URL to get data
let urlUser = "http://jsonplaceholder.typicode.com/users"
let urlSalary = "json/salary_data.json"
let convertValue

// include api for currency change
const api = "https://api.exchangerate-api.com/v4/latest/USD";

//**********Function getresults**********//
async function getResults() {
    await fetch(`${api}`)
        .then(currency => {
            return currency.json();
        }).then(converResult);
};
  
//**********Display results after convertion**********//
function converResult(currency) {
    convertValue = currency.rates['IDR'];
    // console.log(convertValue);
};

//**********Function to fetch data**********//
async function fetchDaTA(urlUser, urlSalary) {
    try {
        const response1 = await fetch(urlUser);
        const response2 = await fetch(urlSalary)
        var userData = await response1.json();
        salaryData = await response2.json();
        console.log(userData);
        if (response2) {
            hideloader()
        }
        show(userData, salaryData)
    } catch (error) {
        console.log(error);
    }
};

// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
};

//**************Function to define innerHTML for HTML table**************//
function show(userData, salaryData) {
    console.log("Salary:");
    console.log(salaryData.array[0].salaryInIDR);
    console.log(convertValue);
    salaryData = salaryData.array;
    let tab =
        `<tr>
          <th>ID</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Address</th>
          <th>Phone</th>
          <th>Salary in IDR</th>
          <th>Salary in USD</th>
         </tr>`;

    // Loop to access all rows 
    userData.map((dat, index) => {
        if(dat.id === salaryData[index].id){
            // Conversion value for USD
            // console.log(convertValue);
            var finalValue = salaryData[index].salaryInIDR/convertValue;
            // console.log(finalValue)
            // Assign value to tab for inner HTML
            tab += `<tr> 
            <td class="align-center">${dat.id} </td>
            <td>${dat.name}</td>    
            <td>${dat.username}</td>    
            <td>${dat.email}</td>    
            <td>${dat.address.street}, ${dat.address.suite}, ${dat.address.city}, ${dat.address.zipcode}</td>    
            <td>${dat.phone}</td>    
            <td class="align-center">${salaryData[index].salaryInIDR.toFixed(2)}</td>    
            <td class="align-center">${finalValue.toFixed(2)}</td>    
            </tr>`;
        }
        
    })
    // Setting innerHTML as tab variable
    document.getElementById("currency").innerHTML = tab;
};

//***********Callback Function*************/
getResults();
fetchDaTA(urlUser, urlSalary);
  