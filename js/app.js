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

function renderTable(countries) {


    let tableStr = `<table id = renderTable class="renderTable table table-bordered">
        <thead>
        <tr><td>Name</td><td>Population</td><td>Area</td><td>Capital</td></tr>
        </thead>
        <tbody>`;


    for (let item of countries) {
        tableStr += `<tr>
            <td>${item.name || 'Нет данных'}</td>
            <td>${item.population || 'Нет данных'}</td>
            <td>${item.area || 'Нет данных'}</td>
            <td>${item.capital || 'Нет данных'}</td>`;


        let appendBorders = '';
        for (let borders of item.borders) {

            const filteredItem = storage.getCountries().filter(function (e) {
                return e.alpha3Code == borders;

            });

            // вытягиваем названия страны
            for (let f of filteredItem) {
                appendBorders += f.name + '; ';
            }
        }
        tableStr += `<td>${appendBorders || 'Нет данных'}</td>`;


        //добавляем список валют
        let countCurrencies = 0;
        for (let currency of item.currencies) {
            if (countCurrencies == 0) {
                tableStr += `<td>${currency.name || 'Нет данных'} `;
                countCurrencies++;
            } else {
                tableStr += `, ${currency.name}`;
                countCurrencies++
            }
        }


        tableStr += '<td></tr>';
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


//jQuery(document).ready(function ($) { //когда страница прогрузилась
$('.btnGetCounties').on('click ', e => {
    // console.log('ok');
    getCountries();
});
//});


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
        $.each($('#renderTable tbody tr'), function () {

            if ($(this).text().toLowerCase().indexOf($(inputText).val().toLowerCase()) === -1) {
                $(this).hide();
            } else {
                $(this).show();
            }

        });

    });
}





