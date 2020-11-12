import dayjs from "dayjs";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { makeStore } from "redux/store";
import { City } from "./citiesSlice";
import { map7TimeWeatherData, WeatherData, WeatherState, asyncFetchWeatherData, selectFiveDayWeather } from "./weatherSlice";

describe("Weather Slice", () => {
  const longitude = "106.662498";
  const latitude = "10.759180";
  const response = {
    product: "civillight",
    init: "2020111106",
    dataseries: [
      {
        date: 20201111,
        weather: "cloudy",
        temp2m: {
          max: 26,
          min: 23,
        },
        wind10m_max: 2,
      },
      {
        date: 20201112,
        weather: "cloudy",
        temp2m: {
          max: 31,
          min: 22,
        },
        wind10m_max: 2,
      },
      {
        date: 20201113,
        weather: "cloudy",
        temp2m: {
          max: 31,
          min: 22,
        },
        wind10m_max: 3,
      },
      {
        date: 20201114,
        weather: "cloudy",
        temp2m: {
          max: 29,
          min: 22,
        },
        wind10m_max: 3,
      },
      {
        date: 20201115,
        weather: "ishower",
        temp2m: {
          max: 32,
          min: 23,
        },
        wind10m_max: 2,
      },
      {
        date: 20201116,
        weather: "ishower",
        temp2m: {
          max: 33,
          min: 24,
        },
        wind10m_max: 2,
      },
      {
        date: 20201117,
        weather: "ishower",
        temp2m: {
          max: 33,
          min: 24,
        },
        wind10m_max: 2,
      },
    ],
  } as any;
  const store = makeStore();
  const server = setupServer(
    rest.get("/forecast", (req, res, ctx) => {
      const lon = req.url.searchParams.get("lon");
      if (lon === longitude) {
        return res(ctx.json(response));
      }
      if (lon === "0") {
        return res(ctx.status(422));
      }
    })
  );
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("map7TimeWeatherData function should return an array of `WeatherData`", () => {
    const mapperFn = map7TimeWeatherData;
    const firstRecord = response.dataseries[0];
    expect(mapperFn(response as any)[0]).toEqual({
      applicableDate: dayjs(String(firstRecord.date)).toISOString(),
      maxTemperature: firstRecord.temp2m.max,
      minTemperature: firstRecord.temp2m.min,
    } as WeatherData);
  });
  it("should have status 'success' and payload not empty if query OK", () => {
    const expectedPayload = map7TimeWeatherData(response);
    return store.dispatch(asyncFetchWeatherData({ longitude, latitude } as City)).then(() => {
      expect(store.getState().weather.status).toStrictEqual("success");
      expect(store.getState().weather.weatherData).toEqual(expectedPayload);
    });
  });

  it("should have status 'error' and payload empty if 'longitude' or 'latitude' is empty", () => {
    return store.dispatch(asyncFetchWeatherData({ longitude: "", latitude } as City)).then(() => {
      expect(store.getState().weather.status).toStrictEqual("error");
    });
  });
  it("should have status 'error' if api error happens", () => {
    return store.dispatch(asyncFetchWeatherData({ longitude: "0", latitude } as City)).then(() => {
      expect(store.getState().weather.status).toStrictEqual("error");
    });
  });

  it("should have status 'loading' if async action is running", () => {
    store.dispatch(asyncFetchWeatherData({ longitude, latitude } as City));
    expect(store.getState().weather.status).toStrictEqual("loading");
  });

  it("#selectFiveDayWeather should return only 5 day of weather forecast data", () => {
    return store.dispatch(asyncFetchWeatherData({ longitude, latitude } as City)).then(() => {
      expect(selectFiveDayWeather(store.getState()).length).toStrictEqual(5);
    });
  });
});
