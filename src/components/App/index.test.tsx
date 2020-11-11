import React from "react";
import { cleanup, screen } from "@testing-library/react";
import App from ".";
import { render } from "../../test-utils";
import { WeatherState, WeatherData } from "../../redux/slices/weatherSlice";

describe("App", () => {
  afterEach(cleanup);
  it("should see Enter your city name input", () => {
    render(<App></App>);
    expect(screen.getByLabelText("Enter your city name")).toBeInTheDocument();
  });
  it("should see Tuesday weather in Tokyo", () => {
    const todayWeather = {
      applicableDate: "Tue Nov 10 2020 22:29:16 GMT+0700 (Indochina Time)",
      maxTemperature: 10,
      minTemperature: 2,
    } as WeatherData;
    const weatherState = {
      cityName: "Tokyo",
      status: "success",
      weatherData: [todayWeather],
    } as WeatherState;
    render(<App></App>, { initialState: { weather: weatherState } });
    expect(screen.getByText(weatherState.cityName)).toBeInTheDocument();
    expect(screen.getByText("Tuesday")).toBeInTheDocument();
    expect(screen.getByText("Min: " + todayWeather.minTemperature + "℃")).toBeInTheDocument();
    expect(screen.getByText("Max: " + todayWeather.maxTemperature + "℃")).toBeInTheDocument();
    expect(screen).toMatchSnapshot();
  });
});
