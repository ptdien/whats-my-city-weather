import { rest } from "msw";
import { setupServer } from "msw/node";
import { makeStore } from "redux/store";
import { asyncFetchCityNames, CitiesState, City, mapMetaWeatherLocationResponse } from "./citiesSlice";

describe("Cities Slice", () => {
  const responseCities = [{ title: "Ho Chi Minh City", location_type: "City", woeid: 1252431, latt_long: "10.759180,106.662498" }];
  const store = makeStore();
  const server = setupServer(
    rest.get("/location/search", (req, res, ctx) => {
      const query = req.url.searchParams.get("query");
      if (query === "Ho chi minh") {
        return res(ctx.json(responseCities));
      }
      if (query === "not-exist-city-name") {
        return res(ctx.status(422));
      }
    })
  );
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("The mapper function should return an array of `City`", () => {
    const mapperFn = mapMetaWeatherLocationResponse;
    expect(mapperFn(responseCities)[0]).toEqual(
      {
        cityName: responseCities[0].title,
        latitude: responseCities[0].latt_long.split(",")[0],
        longitude: responseCities[0].latt_long.split(",")[1],
        woeid: responseCities[0].woeid,
      } as City);
  });
  it("should have status 'success' and payload not empty if query OK", () => {
    const successState = {
      status: "success",
      errorMessage: undefined,
      cities: mapMetaWeatherLocationResponse(responseCities),
    } as CitiesState;
    return store.dispatch(asyncFetchCityNames("Ho chi minh")).then(() => {
      expect(store.getState().cities).toEqual(successState);
    });
  });

  it("should have status 'success' and payload empty if 'query' is empty", () => {
    const successState = {
      status: "success",
      errorMessage: undefined,
      cities: [],
    } as CitiesState;
    return store.dispatch(asyncFetchCityNames("")).then(() => {
      expect(store.getState().cities).toEqual(successState);
    });
  });
  it("should have status 'error' if api error happens", () => {
    return store.dispatch(asyncFetchCityNames("not-exist-city-name")).then(() => {
      expect(store.getState().cities.status).toEqual("error");
    });
  });

  it("should have status 'loading' if async action is running", () => {
    store.dispatch(asyncFetchCityNames("not-exist-city-name"));
    expect(store.getState().cities.status).toEqual("loading");
  });
});
