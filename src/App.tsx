import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ReactPaginate from "react-paginate";

const URL = "https://restcountries.com/v2/all?fields=name,region,area";

interface CountryData {
  name: string;
  region: string;
  area: number;
  independent: boolean;
}

type FilterTypes = "smallerThanLithuania" | "inOceania" | "";

const filters = [
  {
    key: "smallerThanLithuania",
    text: "Smaller Than Lithuania",
  },
  {
    key: "inOceania",
    text: "In Oceania",
  },
];

const itemsPerPage = 10;

const App = () => {
  const [countries, setCountries] = useState<CountryData[] | []>([]);
  const [filter, setFilter] = useState<FilterTypes>("");
  const [currentItems, setCurrentItems] = useState<CountryData[] | []>(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const setData = async () => {
    const response = await axios.get<CountryData[]>(URL);

    const sortedCountriesList = response.data?.sort((a, b) =>
      a?.name.localeCompare(b?.name)
    );
    setCountries(sortedCountriesList);
  };

  const getFilteredData = (data) => {
    if (filter) {
      if (filter === "smallerThanLithuania") {
        const area: number = countries.find((i) => i.name === "Lithuania")
          ?.area as number;
        return data.filter((i) => i.area < area);
      }
      if (filter === "inOceania")
        return data.filter((i) => i.region === "Oceania");
    } else return data;
  };

  const renderList = (data: CountryData[]) => {
    const filteredData = getFilteredData(data);

    return (
      <div>
        {filteredData?.map((item) => (
          <div key={item?.name} className="countries-list">
            <div>
              <span className="list-item list-item-key">Name: </span>
              <span className="list-item list-item-value">{item?.name}</span>
            </div>
            <div>
              <span className="list-item list-item-key">Region: </span>
              <span className="list-item list-item-value">{item?.region}</span>
            </div>
            <div>
              <span className="list-item list-item-key">Area: </span>
              <span className="list-item list-item-value">{item?.area}</span>
            </div>
            <div>
              <span className="list-item list-item-key">Independent: </span>
              <span className="list-item list-item-value">
                {item?.independent ? "Yes" : "NO"}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const updateFilter = (key: FilterTypes) => {
    setFilter(key);
  };

  const renderFilters = () => {
    return (
      <div className="filters-container">
        {filters.map((item) => (
          <div
            key={`${item.key}`}
            className={`filter-btn ${
              filter === item.key && "filter-btn-active"
            }`}
            role={"button"}
            onClick={() => updateFilter(item.key as FilterTypes)}
          >
            {item.text}
          </div>
        ))}

        <div
          className={"filter-btn"}
          role={"button"}
          onClick={() => updateFilter("")}
        >
          Reset
        </div>
      </div>
    );
  };

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % countries.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    setData();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(countries.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(countries.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, countries]);

  return (
    <div className="App">
      <div>
        <h5 className="title">Countries List</h5>
        {renderFilters()}
      </div>
      {renderList(currentItems)}
      {countries.length > 0 ? (
        <ReactPaginate
          breakLabel="..."
          nextLabel="next >"
          containerClassName={"pagination"}
          activeLinkClassName={"pages pagination"}
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
        />
      ) : (
        <h1>Loadding...</h1>
      )}
    </div>
  );
};

export default App;
