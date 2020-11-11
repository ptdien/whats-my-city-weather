import { debounce, makeStyles, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import clsx from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncFetchCityNames, City } from "../../redux/slices/citiesSlice";
import { RootStoreState } from "../../redux/store";

type CitySearchProps = { initialValue?: City; label?: string; onChange?: (value: City | null) => void };

export default function CitySearch({ label = "Enter your city name", initialValue, onChange }: CitySearchProps) {
  const styles = useStyles();
  const cities = useSelector((state: RootStoreState) => state.cities.cities);
  const status = useSelector((state: RootStoreState) => state.cities.status);
  const dispatch = useDispatch();
  const handleSearchCity = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(asyncFetchCityNames(e.target.value));
  }, 500);
  return (
    <div className={clsx("CitySearch", styles.citySearch)}>
      <Autocomplete
        options={cities}
        getOptionLabel={(city: City) => city.cityName}
        clearOnBlur
        defaultValue={initialValue}
        loading={status === "loading"}
        onChange={(e: any, newValue: City | null) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        renderInput={(params) => <TextField {...params} autoFocus label={label} margin="normal" onChange={handleSearchCity} />}
      />
    </div>
  );
}

const useStyles = makeStyles({
  citySearch: {
    maxWidth: "300px",
  },
});
