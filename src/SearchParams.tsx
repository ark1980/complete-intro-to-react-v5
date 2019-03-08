import React, {
  useState,
  useEffect,
  useContext,
  FunctionComponent
} from "react";
import { RouteComponentProps } from "@reach/router";
import pf, { ANIMALS, Pet } from "petfinder-client";
import useDropdown from "./useDropdown";
import Results from "./Results";
import ThemeContext from "./ThemeContext";

if (!process.env.API_KEY || !process.env.API_SECRET) {
  throw new Error("you need API keys");
}

const petfinder = pf({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET
});

const SearchParams: FunctionComponent<RouteComponentProps> = () => {
  const [theme, setTheme] = useContext(ThemeContext);
  const [location, updateLocation] = useState("Seattle, WA");
  const [breeds, updateBreeds] = useState([] as string[]);
  const [pets, setPets] = useState([] as Pet[]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, updateBreed] = useDropdown("Breed", "", breeds);

  async function requestPets() {
    const res = await petfinder.pet.find({
      location,
      breed,
      animal,
      output: "full"
    });

    if (res.petfinder.pets) {
      setPets(
        Array.isArray(res.petfinder.pets.pet)
          ? res.petfinder.pets.pet
          : [res.petfinder.pets.pet as Pet]
      );
    }
  }

  useEffect(() => {
    updateBreeds([]);
    updateBreed("");

    petfinder.breed.list({ animal }).then(data => {
      if (data.petfinder.breeds) {
        updateBreeds(
          Array.isArray(data.petfinder.breeds.breed)
            ? data.petfinder.breeds.breed
            : [data.petfinder.breeds.breed as string]
        );
      }
    }, console.error);
  }, [animal]);

  return (
    <div className="search-params">
      <form
        onSubmit={e => {
          e.preventDefault();
          requestPets();
        }}
      >
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={location}
            placeholder="Location"
            onChange={e => updateLocation(e.target.value)}
          />
        </label>
        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="location">
          Theme
          <select
            value={theme}
            onChange={e => setTheme(e.target.value)}
            onBlur={e => setTheme(e.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="chartreuse">Chartreuse</option>
            <option value="mediumorchid">Medium Orchid</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
