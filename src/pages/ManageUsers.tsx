import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import UsersData from "../types/tables/users";
import NewEntity from "../components/Dynamics/newEntityForm";
import { Box } from "@mui/material";
import FilterSearchControl from "../components/filterControl/filterSearchControl";
import { useState } from "react";

const ManageUsers = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [personalNumber, setPersonalNumber] = useState<string>("");
  const [platforms, setPlatforms] = useState<string>("");

  return (
    <PageWrapper>
      <Box
        sx={{ mt: 1, mb: 1, display: "flex", justifyContent: "space-between" }}
      >
        <FilterSearchControl label={t("search")} setSearch={setSearch} />
        <NewEntity
          textInputs={{
            [t("firstName")]: setName,
            [t("lastName")]: setLastName,
            [t("personalNumber")]: setPersonalNumber,
            [t("platforms")]: setPlatforms,
          }}
          callback={() => {
            console.log(name, lastName, personalNumber, platforms);
          }}
        />
      </Box>
      <GenericTable
        properties={new UsersData()}
        data={[
          new UsersData("the first", "xbox", "מספר אישי 1", t("raam")),
          new UsersData("xbox", "360", "מספר אישי 2", t("baz")),
          new UsersData("xbox", "one", "מספר אישי 3", t("baz")),
          new UsersData("xbox", "one s", "מספר אישי 4", t("baz")),
          new UsersData("xbox", "one x", "מספר אישי 5", t("raam")),
          new UsersData("xbox", "series x", "מספר אישי 6", t("raam")),
          new UsersData("xbox", "series s", "מספר אישי 7", t("raam")),
        ]}
      />
    </PageWrapper>
  );
};

export default ManageUsers;
