function renderTable(countries) {
    let countriesToRender = countries.map(country => {
        return {name, population, area, capital} = country;
    });

    let tableStr = `<table class="table table-bordered">
        <thead>
        <tr><td>Name</td><td>Capital</td><td>Population</td><td>Area</td></tr>
        </thead>
        <tbody>`;


    for (let item of countriesToRender) {
        tableStr += `<tr>
            <td>${item.name}</td>
            <td>${item.population}</td>
            <td>${item.area}</td>
            <td>${item.capital}</td>          
        </tr>`;
    }
    $('.placeForTable').append(tableStr);


}


let getCountries = () => {

    $('.btnGetCounties').attr('disabled', 'disabled');
    $.ajax({
            url: "https://restcountries.eu/rest/v2/all",

            success: function (countries) {
               // console.log('ok');
                renderTable(countries);
                $('.btnGetCounties').removeAttr('disabled');
                tablePressed();
            },
            error: errorStr => {
                console.log('error');
                $('.btnGetCounties').removeAttr('disabled');
            }
        }
    );
}



jQuery(document).ready(function ($) { //когда страница прогрузилась
    $('.btnGetCounties').on('click ', e => {
       // console.log('ok');
        getCountries();
    });
});


let tablePressed = () =>{
    $('.placeForTable').on('click',e=>{
       // console.log(e.target);
        $(e.target).toggleClass('active');
    });
}


