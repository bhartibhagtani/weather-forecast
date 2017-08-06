import { Component, OnInit } from '@angular/core';
import { OpenWeatherFactory } from 'angular-openweathermap-api-factory';
import { WeatherService } from './weather.service';
import { Weather } from './weather.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WeatherService]
})

export class AppComponent {
  private weather: Weather = new Weather();
  private response: any;
  private weatherForecastList =[];
  private minTempObj : any;
  private maxTempObj : any;
  private temperatureArray =[];
  private timeArray =[];
  options: Object;

  constructor(private weatherService: WeatherService) {

  }

  onSubmit() {
    let thisI = this;
    let minimumTempArray = [];
    let maximumTempArray = [];
    let minimumTempObj: {
      minTemp: string;
      time: string;
    }
    let maximumTempObj: any;
    thisI.weatherService.getWeatherForecast(thisI.weather.cityName).subscribe(response => {
      if (response.cod == "200") {
        thisI.response = response;
        JSON.stringify(thisI.response);
        thisI.weatherForecastList = thisI.prepareWeatherForecastList(thisI.response);
        thisI.getMinMaxTemperature(thisI.weatherForecastList);
        thisI.initializeChart(thisI.weatherForecastList);
      }
    });
  }

  prepareWeatherForecastList(response){
     let thisI = this;
     let newWeatherList : any ={};
     response.list.forEach(list => {  
        let newWeatherList : any ={};
      newWeatherList.temp_min = +((list.main.temp_min - 273.15).toFixed(2))
      newWeatherList.temp_max = +((list.main.temp_max - 273.15).toFixed(2))
      newWeatherList.temp = +((list.main.temp - 273.15).toFixed(2))
      newWeatherList.dt = list.dt
      newWeatherList.dt_txt = list.dt_txt
      newWeatherList.time = list.dt_txt.substr(11, 5)
      thisI.weatherForecastList.push(newWeatherList)
    })
    return thisI.weatherForecastList;
  }

  getMinMaxTemperature(weatherForecastList){
    let thisI = this;
    let minTempSortedList = [];
    let maxTempSortedList = [];
    minTempSortedList = weatherForecastList.sort((value1, value2) => value1.temp_min - value2.temp_min);
    maxTempSortedList = weatherForecastList.sort((value1, value2) => value1.temp_max - value2.temp_max);
    thisI.minTempObj = minTempSortedList[0];
    thisI.maxTempObj = maxTempSortedList[maxTempSortedList.length-1];
  }

  initializeChart(weatherForecastList) {
    let thisI = this;
   let weatherForecastListForChart = []
    weatherForecastListForChart = weatherForecastList.sort((value1, value2) => value1.temp - value2.temp)
    weatherForecastListForChart.forEach(element => {
      thisI.temperatureArray.push(element.temp);
      thisI.timeArray.push(element.time);
    });

    this.options = {
      title: { text : thisI.response.city.name+' Weather Data' },
      series: [{
        name: "Temperature °C",
        data: thisI.temperatureArray
      }],
      xAxis: {
        type: 'datetime',
        categories: thisI.timeArray,
        title: {
          text: "Time (HH:MM)"
        }
      },
      yAxis: {
        title: {
          text: 'Temperature °C'
        },

      },
    };
  }
}

