import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import IssueData from "../../types/tables/issues";
import GenericTable from "./table";
import FlightData from "../../types/tables/flight";

interface InfinateScrollDataProps {
  properties: string[];
  data: any[];
  getRowKey: (row: any) => string;
  sortFunction?: (val: any, nexVal: any) => number;
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  clickable?: (row: IssueData | FlightData) => void;
  noHeight?: boolean;
}

const InfinateScrollData: React.FC<InfinateScrollDataProps> = ({
  properties,
  data,
  getRowKey,
  sortFunction,
  getRowClass,
  color,
  deleteRow,
  clickable,
  noHeight,
}) => {
  const tableHeightPercent = noHeight ? Math.min(30, data.length * 14) : 85;
  const tableRowHeight = 82;
  const tableFetchExtra = 4;
  const tableHeadHeight = 56.5;
  const tableRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [sortedData, setSortedData] = useState(data.sort(sortFunction));
  const limit = Math.round(
    (window.innerHeight * (tableHeightPercent / 100)) / tableRowHeight +
      tableFetchExtra
  );
  const [dataToShow, setdataToShow] = useState(
    sortedData.slice(offset, limit * offset)
  );

  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  useEffect(() => {
    setOffset(0);
    const sorted = data.sort(sortFunction);
    setSortedData(sorted);
    setdataToShow(sorted.slice(0, limit));
  }, [data]);

  const fetchMoreData = async () => {
    const newData = sortedData.slice(offset * limit, (offset + 1) * limit);
    setdataToShow([...new Set([...dataToShow, ...newData])]);
  };

  const handleScroll = (event: any) => {
    const children = document.getElementById("table")?.childElementCount;
    const target = event.target;

    if (
      target.scrollTop + target.offsetHeight + tableHeadHeight >=
      tableRowHeight * (children ? children : 1)
    ) {
      setOffset(offset + 1);
    }
  };

  return (
    <GenericTable
      properties={properties}
      data={dataToShow}
      getRowKey={getRowKey}
      getRowClass={getRowClass}
      color={color}
      deleteRow={deleteRow}
      onScroll={handleScroll}
      tableRef={tableRef}
      clickable={clickable}
      tableHeight={tableHeightPercent}
    />
  );
};

export default InfinateScrollData;
