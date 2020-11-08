import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

type WeatherData = {
  applicableDate: Date;
  minTemperature: number;
  maxTemperature: number;
};

export type WeatherState = {
  cityName: string;
  woeid: number;
  weatherData: WeatherData[];
  status: "idle" | "loading" | "error";
  errorMessage?: string;
};

export const asyncGetWeatherData = createAsyncThunk<WeatherState, { cityName: string }, { rejectValue: { errorMessage: string } }>(
  "weather/fetchData",
  async ({ cityName }, thunkApi) => {
    const cities: any[] = await Axios.get(`/location/search/?query=${cityName}`).then((response) => response.data);
    if (!cities || !cities.length) {
      return thunkApi.rejectWithValue({
        errorMessage: "No city or location name matched",
      });
    }
    const { woeid, title } = cities[0];
    const weatherData = await Axios.get(`/location/${woeid}`).then((response) => response.data);
    return {
      cityName: title,
      woeid: +woeid,
      weatherData: weatherData.consolidated_weather.map(
        (w: any) =>
          ({
            applicableDate: w.applicable_date,
            maxTemperature: w.max_temp,
            minTemperature: w.min_temp,
          } as WeatherData)
      ),
    } as WeatherState;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    status: "idle",
  } as WeatherState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncGetWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(asyncGetWeatherData.fulfilled, (state, action) => {
        state.status = "idle";
        state.weatherData = action.payload.weatherData;
        state.cityName = action.payload.cityName;
        state.errorMessage = undefined;
      })
      .addCase(asyncGetWeatherData.rejected, (state, action) => {
        state.status = "error";
        state.errorMessage = action.payload?.errorMessage;
      });
  },
});

export default weatherSlice.reducer;
