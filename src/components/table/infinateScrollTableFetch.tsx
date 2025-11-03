import "./table.css";
import "../../i18n";
import React, { useEffect, useRef, useState } from "react";
import IssueData from "../../types/tables/issues";
import { useBackend } from "../../context/backendContext";
import { usePlatforms } from "../../context/platformsContext";
import { HttpStatusCode } from "axios";
import GenericTable from "./table";

interface InfinateScrollFetchProps {
  properties: string[];
  fetchCollection: string;
  sortFunction?: (val: any, nexVal: any) => number;
  filterFunction?: (data: any[]) => any[];
  getRowClass?: (row: IssueData) => string;
  color?: boolean;
  deleteRow?: (row: any) => void;
  objectFromFetch: (data: any) => any;
}

const InfinateScrollFetch: React.FC<InfinateScrollFetchProps> = ({
  properties,
  fetchCollection,
  sortFunction,
  filterFunction,
  getRowClass,
  color,
  deleteRow,
  objectFromFetch
}) => {
  const tableRowHeight = 82;
  const tableHeadHeight = 56.5;

  const tableRef = useRef(null);
  const { connection } = useBackend();
  const { platforms } = usePlatforms();

  const [fetching, setFetching] = useState<boolean>(false);
  const [fetchMore, setFetchMore] = useState<boolean>(true);
  const [offset, setOffset] = useState(0);
  const [dataToShow, setDataToShow] = useState<any[]>([]);

  useEffect(() => {
    fetchMoreData();
  }, [offset]);

  useEffect(() => {
    fetchMoreData();
  }, [platforms]);

  useEffect(() => {
    setFetching(false);
  }, [dataToShow]);

  const fetchMoreData = async () => {
    if (platforms.length == 0 || !fetchMore) {
      return;
    }

    const newData = await connection.getObjects(
      fetchCollection,
      offset * 25,
      platforms
    );
    console.log(offset, newData);

    if (newData.status == HttpStatusCode.Ok) {
      const newFetchedData: any[] = newData.data;
      if (newFetchedData.length != 0) {
        setDataToShow([
          ...new Set([
            ...dataToShow,
            ...newFetchedData
              .map(
                (data) =>
                  objectFromFetch(data)
              )
              .sort(sortFunction),
          ]),
        ]);
      } else {
        setFetchMore(false);
      }
    }
  };

  const handleScroll = (event: any) => {
    if (!fetchMore) {
      return;
    }

    const children = tableRef.current.childElementCount;
    const target = event.target;

    if (
      target.scrollTop + target.offsetHeight + tableHeadHeight >=
        tableRowHeight * (children ? children : 1) &&
      !fetching
    ) {
      setFetching(true);
      setOffset(offset + 1);
    }
  };

  return (
    <GenericTable
      properties={properties}
      data={dataToShow}
      sortFunction={sortFunction}
      filterFunction={filterFunction}
      getRowClass={getRowClass}
      color={color}
      deleteRow={deleteRow}
      onScroll={handleScroll}
      tableRef={tableRef}
    />
  );
};

export default InfinateScrollFetch;
