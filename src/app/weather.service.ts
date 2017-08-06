import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherService {
  constructor (
    private http: Http
  ) {}

  getWeatherForecast(cityName) {
    let params: URLSearchParams = new URLSearchParams()
    if(cityName!=null){
        params.set("q",cityName);
    }
    params.set("cnt","8");
    params.set("APPID","28478077c249b1920eb3152b91f86ec8");
    return this.http.get(`http://api.openweathermap.org/data/2.5/forecast`,{search:params})
    .map((res:Response) => res.json());
  }

}