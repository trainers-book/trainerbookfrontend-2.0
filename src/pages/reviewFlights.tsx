import NewFlightModel from "../components/Popup/NewFlight/newFlight";

import PageWrapper from "../components/pageWrapper/PageWrapper";
import { useTranslation } from "react-i18next";
import FlightData from "../types/tables/flight";
import GenericTable from "../components/table/table";
import type React from "react";

const ReviewFlights: React.FC = () => {
  const { t } = useTranslation();

  const data = [
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
      <NewFlightModel />
      <GenericTable properties={new FlightData()} data={data} />
    </PageWrapper>
  );
};

export default ReviewFlights;
