"use strict";

//Money block
const currencyBlockUsd = document.querySelector(".data-1");
const currencyBlockEur = document.querySelector(".data-2");
const currencyDate = document.querySelector('.currency-date');

//Function ask value of currency
async function loadCurrency() {
   //Load gif if smth goes wrong
   currencyBlockUsd.innerHTML = `
      <div class="currency__loading">
         <img src="./img/load.gif">
      </div>
   `;
   currencyBlockEur.innerHTML = `
      <div class="currency__loading">
         <img src="./img/load.gif">
      </div>
   `;

   //Get server API data USD based
   const server = "https://cdn.cur.su/api/nbu.json";

   const response = await fetch(server, {
      method: "GET",
   });

   const resposeResult = await response.json();

   //Chek if we have data or show msg
   if (response.ok) {
      getCurrency(resposeResult);
   } else {
      currencyBlockUsd.innerHTML = resposeResult.message;
   }
}

//Getting data from loaded currency
function getCurrency(data) {
   console.log(data);
   const eurRate = 1 / data.rates.EUR;
   const currentDate = data.putISODate.slice(0, 10);

   const usdValue = data.rates.UAH.toFixed(2);
   const eurValue = (data.rates.UAH * eurRate).toFixed(2);

   //HTML visualize
   const templateUsd = `<div class="currency__value">
      <span class="currency__data data-1">${usdValue}</span>
   </div>`;

   const templateEur = `<div class="currency__value">
      <span class="currency__data data-2">${eurValue}</span>
   </div>`;

   currencyBlockUsd.innerHTML = templateUsd;
   currencyBlockEur.innerHTML = templateEur;
   currencyDate.innerHTML = " " + currentDate + " ";
}

if (currencyBlockUsd) {
   loadCurrency();
}

//Converter complex

document.addEventListener("DOMContentLoaded", function convertStart(event) {
   //declare variables for web data
   const leftInput = document.querySelector(".input--first");
   const rightInput = document.querySelector(".input--second");

   const leftSelect = document.querySelector(".select--first");
   const rightSelect = document.querySelector(".select--second");

   //Get events to data variables
   leftInput.addEventListener("input", currencyConvertion);
   rightInput.addEventListener("input", currencyConvertion);

   leftSelect.addEventListener("change", currencyConvertion);
   rightSelect.addEventListener("change", currencyConvertion);

   //Function to convert the currency
   async function currencyConvertion(event) {
      console.log(event)
      //get web variables value
      const leftInputValue = leftInput.value;
      const rightInputValue = rightInput.value;
      const leftSelectValue = leftSelect.value;
      const rightSelectValue = rightSelect.value;

      const state = event.target.dataset.state;
      console.log(state);
      if (state === "first") {
         const data = await getData(leftSelectValue, rightSelectValue, leftInputValue);
         rightInput.value = data.result;
      } else {
         const data = await getData(rightSelectValue, leftSelectValue, rightInputValue);
         leftInput.value = data.result;
      }
   }

   async function getData(from = "EUR", to = "UAH", amount = 100) {

      var myHeaders = new Headers();
      myHeaders.append("apikey", "4Au5RvYo9YX6NbPNUBoRgdfHF0aw7ghv");

      var requestOptions = {
         method: 'GET',
         redirect: 'follow',
         headers: myHeaders
      };

      return fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`, requestOptions)
         .then(response => response.text())
         .then(result => JSON.parse(result))
         .catch(error => console.log('error', error));

   }
});
