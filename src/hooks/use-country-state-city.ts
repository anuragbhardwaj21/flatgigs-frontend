import { Country, State, City } from "country-state-city";

const countries = Country.getAllCountries().map((country) => ({
  id: country.isoCode,
  name: country.name,
  type: "country",
}));

const states = State.getAllStates().map((state) => ({
  id: state.isoCode,
  name: state.name,
  countryCode: state.countryCode,
  type: "state",
}));

const cities = City.getAllCities().map((city) => ({
  id: `${city.countryCode}-${city.stateCode}-${city.name}`,
  name: city.name,
  countryCode: city.countryCode,
  stateCode: city.stateCode,
  type: "city",
}));

export const SEARCH_DATA = [...countries, ...states, ...cities];