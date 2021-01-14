const WEATHER_API_KEY = "1a3d5b7d34963716d551a5d2de0ef98b";

let cityName = "Detroit";

function makeIcon(id) {
    return `http://openweathermap.org/img/wn/${id}@4x.png`;
}

function buildCityPage(currentcity) {
    $('#cityname').text(currentcity);
    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/weather?q=${currentcity}&units=metric&appid=${WEATHER_API_KEY}`,
        method: 'GET'
    }).done((currentWeatherResult) => {
        console.log(currentWeatherResult);
        $('#current_temp').text(currentWeatherResult.main.temp);
        $('#current_wind').text(currentWeatherResult.wind.speed);
        $('#current_humidity').text(currentWeatherResult.main.humidity);
        $('#current_uv').text(currentWeatherResult.main.temp);
        $('#current_emoji').attr('src', makeIcon(currentWeatherResult.weather[0].icon));


        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherResult.coord.lat}&lon=${currentWeatherResult.coord.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`,
            method: 'GET'
        }).done((multiDayResult) => {
            // console.log(JSON.stringify(multiDayResult));
            console.log(multiDayResult);
            
            let fiveDay = [];

            for (let dayIndex = 0; dayIndex < multiDayResult.daily.length; dayIndex++) {
                const currentDay = multiDayResult.daily[dayIndex];
                if (dayIndex === 0) {
                    $('#current_uv').text(currentDay.uvi);
                } else {
                    const processedDate = new Date(currentDay.dt * 1000).toDateString();

                    let dayBox = `<div class='col'><div id='day-${dayIndex}' class='forecast'>
                            <h1 class='date'>${processedDate}</h1>
                            <img src='${makeIcon(currentDay.weather[0].icon)}' class='emoji'></img>
                            <div class='temp'>${currentDay.temp.day}</div>
                            <div class='humidity'>${currentDay.humidity}</div>
                        </div></div>`;
                    
                    fiveDay.push(dayBox);
                }
            }
            
            $('#fiveday').append(fiveDay.join(''));
            
        });
    });
}

$(document).ready(() => {
   
    buildCityPage(cityName);
});