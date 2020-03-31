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

    for (let item of borders) {

        outputArray.push(countries.filter(e => e.alpha3Code === item)[0].name);
    }
    return outputArray.join(' ,');

}

//-----------------------Создание таблицы-------------------------------------------------------------------------------

function renderTable(countries) {

    buildSelect();
    let tableStr = `<table id = renderTable class="renderTable table table-bordered">
        <thead class='sortable th'>
        <tr><th>Name </th>
        <th>Population</th>
        <th>Area </th>
        <th>Capital</th>
        <th>Borders </th>
        <th>Currencies </th></tr>
        </thead>
        <tbody>`;


    for (let item of countries) {
        let borders = getBorders(item.borders);
        let currencies = item.currencies.map(el => el.name);
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

//-------------------Создание Select------------------------------------------------------------------------------------

const buildSelect = () => {
    let countries = storage.getCountries();

    let selectStr = '<select class="form-control"><option value="">Не выбрано</option>';

    for (let country of countries) {
        selectStr += `<option value="${country.name}">${country.name}</option>`;
    }

    selectStr += `</select>`;

    if ($('.search-container').length < 2) {
        $('.search-container').prepend(selectStr);
    }

};
//---------------------создание автозаполнения--------------------------------------------------------------------------
const setAutocomplete = () => {
    const countries = storage.getCountries();
    let countryNames = countries.map(country => country.name);
    // console.log(countryNames);
    $("#countries-auto").autocomplete({
        source: countryNames,
        minLength: 3,
        select: function (event, ui) {

            $('input').val($(ui)[0].item.value);
            $('.search-container').trigger('keyup');
        }

    });

};

//-----------------------Получение данных ajax--------------------------------------------------------------------------

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

        },
        error: errorStr => {
            console.log('error');
            $('.btnGetCounties').removeAttr('disabled');
        }
    });
}
//------------------------------------------------------------------------------------------------------------

$('.btnGetCounties').on('click ', e => {

    getCountries();
});
const addListeners = () => {
    $('.placeForTable').on('click', e => {
        $('.red-tr').removeClass('red-tr');
        $(e.target).parent('tbody tr').toggleClass('red-tr');

    });
    searchCounty();
    setAutocomplete();
    sortTable();
}


//-----------------------функция для поиска при помощи input-a и select-a-----------------------------------------------

const searchCounty = () => {


    $('.searchInput').show();
    $('.search-container').on('keyup change', e => {

        let inputText = $('#countries-auto').val();
        //  console.log(e.target);

        $.each($('#renderTable tbody tr td:first-child'), function () {

            if ($(this).text().toLowerCase().indexOf(inputText.toLowerCase()) === -1) {
                $(this).parent().hide();
            } else {
                //  console.log($(inputText).val().toLowerCase());
                $(this).parent().show();
            }

        });
    });
}

//----------------------------------------------------------------------------------------------------------------------

function sortTable() {


    $('th').click(function () {
        $('.orderLow').removeClass('orderLow');
        $(this).addClass('orderHi');


        let table = $(this).parents('table');
        let rows = table.find('tr:gt(0)').toArray().sort(compareRows($(this).index()));


        this.flag = !this.flag;

        if (this.flag) {
            rows = rows.reverse();
            $('.orderHi').removeClass('orderHi');
            $(this).addClass('orderLow');
        }


        for (let i = 0; i < rows.length; i++) {
            table.append(rows[i]);
        }
    });


    function compareRows(columnIndex) {
        return function (a, b) {
            let elemA = getTdText(a, columnIndex);
            let elemB = getTdText(b, columnIndex);
            return $.isNumeric(elemA) && $.isNumeric(elemB) ? elemA - elemB : elemA.toString().localeCompare(elemB);
        }
    }

    function getTdText(tr, columnIndex) {
        return $(tr).children('td').eq(columnIndex).text();// текст td по заданому индексу столбца
    }
}