import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import IssueData from "../../types/tables/issues";
import GenericTable from "./table";

interface InfinateScrollDataProps {
  properties: string[];
  data: any[];
  sortFunction?: (val: any, nexVal: any) => number;
  filterFunction?: (data: any[]) => any[];
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
}

const InfinateScrollData: React.FC<InfinateScrollDataProps> = ({
  properties,
  data,
  sortFunction,
  filterFunction,
  getRowClass,
  color,
  deleteRow,
}) => {
  const tableHeightPercent = 85;
  const tableRowHeight = 82;
  const tableFetchExtra = 4;
  const tableHeadHeight = 56.5;

  const tableRef = useRef(null);
  const columns = properties.slice();
  if (color != undefined) {
    columns.push("!color");
  }
  if (deleteRow != undefined) {
    columns.push("!delete");
  }

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
        filterFunction={filterFunction}
        getRowClass={getRowClass}
        color={color}
        deleteRow={deleteRow}
        onScroll={handleScroll}
        tableRef={tableRef}
    />

  );
};

export default InfinateScrollData;
