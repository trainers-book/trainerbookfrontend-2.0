import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FlightData from "../types/tables/flight";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import NewFlightModel from "../components/Popup/NewFlight/newFlight";
import GenericTable from "../components/table/table";
import FilterFlights from "../components/filterTables/filterFlights";
import { Box } from "@mui/material";

const ReviewFlights: React.FC = () => {
  const { t } = useTranslation();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // const getRowClass = (row: FlightData) => {
  //   return Object.keys(Status)
  //     .filter((value) => Status[value as keyof typeof Status] === row.status)[0]
  //     .toLocaleLowerCase();
  // };

  const changePlatform = (selected: string[]) => {
    setSelectedPlatforms(selected);
    filterData();
  };

  const changeSearch = (search: string) => {
    setSearchQuery(search);
    filterData();
  };

  const changedate = (selected: string) => {
    setSelectedDate(selected);
    filterData();
  };

  const filterData = () => {
    return flightData.filter((dataSet) => {
      const getDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      };

      return (
        // add permissions filtering
        (selectedPlatforms.length == 0 ||
          selectedPlatforms.includes(dataSet.platform)) &&
        (selectedDate == "" || getDate(dataSet.dateTime) == selectedDate) &&
        Object.values(dataSet)
          .map(String)
          .reduce(
            (accumulator, value) => accumulator || value.includes(searchQuery),
            false
          ) // make sure this is always the last check
      );
    });
  };

  const flightData = [
    new FlightData(
      new Date(),
      1,
      "שם גיחה",
      "מדריכה1",
      "תצפיתנית1",
      "צא1",
      "צא2",
      "תיאור תקלה",
      0,
      t("baz")
    ),
  ];

  return (
    <PageWrapper>
      <Box
        sx={{
          mt: 1,
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <FilterFlights
          selectedPlatform={selectedPlatforms}
          setSelectedPlatform={changePlatform}
          setSearch={changeSearch}
          setDate={changedate}
        />
        <NewFlightModel />
      </Box>
      <GenericTable
        properties={new FlightData()}
        data={filterData()}
        // getRowClass={getRowClass}
        // color={true}
      ></GenericTable>
    </PageWrapper>
  );
};

export default ReviewFlights;
