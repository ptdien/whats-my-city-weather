import { screen } from "@testing-library/react";
import React from "react";
import CitySearch from ".";
import { render } from "../../test-utils";

describe("CitySearch", () => {
  it("should render correctly", () => {
    render(<CitySearch />);
    expect(screen).toMatchSnapshot();
  });
});
