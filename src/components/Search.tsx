import { FormControl, FormHelperText, Input, InputLabel, makeStyles, InputProps, InputAdornment, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";

export default function Search({
  label = "Search",
  defaultValue,
  onChange,
  value,
  errorMessage,
  onSubmit,
}: InputProps & {
  label?: string;
  errorMessage?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const styles = useStyles();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (onSubmit) {
          onSubmit(e);
        }
      }}
    >
      <FormControl className={styles.root} error={Boolean(errorMessage)}>
        <InputLabel htmlFor="search-input">{label}</InputLabel>
        <Input
          id="search-input"
          className={styles.input}
          endAdornment={
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon></SearchIcon>
              </IconButton>
            </InputAdornment>
          }
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          aria-describedby="component-error-text"
        />
        {errorMessage && <FormHelperText id="component-error-text">{errorMessage}</FormHelperText>}
      </FormControl>
    </form>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
  },
  input: {
    flex: 1,
  },
  iconButton: {},
}));
