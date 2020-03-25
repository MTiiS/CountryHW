"use strict";


function storageFunction() {
    let countries = [];
    return {
        getCountries: function () {
            return countries;
        },
        setCountries: function (data) {
            return countries = data;
        }
    }

}


let storage = storageFunction();
$('.searchInput').hide();

function getBorders(borders) {
   let outputArray = [];
   let countries = storage.getCountries();

   for (let item of borders){

       outputArray.push(countries.filter(e=>e.alpha3Code===item)[0].name);
           }
   return outputArray.join(' ,');

}

function renderTable(countries) {


    let tableStr = `<table id = renderTable class="renderTable table table-bordered">
        <thead>
        <tr><td>Name</td><td>Population</td><td>Area</td><td>Capital</td></tr>
        </thead>
        <tbody>`;


    for (let item of countries) {
         let borders = getBorders(item.borders);
        let currencies = item.currencies.map(el=>el.name);
            tableStr += `<tr>
            <td>${item.name || 'Нет данных'}</td>
            <td>${item.population || 'Нет данных'}</td>
            <td>${item.area || 'Нет данных'}</td>
            <td>${item.capital || 'Нет данных'}</td>
            <td>${borders || 'Нет данных'}</td>
            <td>${currencies.join(' ,') || 'Нет данных'}</td>`;


        tableStr += '</tr>';
    }
    if (!($('.table').length)) {
        $('.placeForTable').append(tableStr);
    }

}


let getCountries = () => {

    $('.btnGetCounties').attr('disabled', 'disabled');
    $.ajax({
        url: "https://restcountries.eu/rest/v2/all",

        success: function (countries) {
            countries = countries.map(country => {
                return {
                    name: country.name,
                    population: country.population,
                    area: country.area,
                    capital: country.capital,
                    borders: country.borders,
                    currencies: country.currencies,
                    alpha3Code: country.alpha3Code
                };
            });
            storage.setCountries(countries);
            renderTable(countries);
            $('.btnGetCounties').removeAttr('disabled');
            addListeners();
            searchCounty();
        },
        error: errorStr => {
            console.log('error');
            $('.btnGetCounties').removeAttr('disabled');
        }
    });
}


$('.btnGetCounties').on('click ', e => {

    getCountries();
});



const addListeners = () => {
    $('.placeForTable').on('click', e => {
        // console.log(e.target);
        $(e.target).toggleClass('active');

    });
}


const searchCounty = () => {

    $('.searchInput').show();
    $('.searchInput').on('keyup', e => {

        let inputText = e.currentTarget;
        $($.each('#renderTable tbody tr'), function () {

            if ($(this).text().toLowerCase().indexOf($(inputText).val().toLowerCase()) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }

        });

    });
}





