import { useTranslation } from "react-i18next";
import PageWrapper from "../components/pageWrapper/PageWrapper";
import GenericTable from "../components/table/table";
import UsersData from "../types/tables/users";
import { Box } from "@mui/material";
import FilterSearchControl from "../components/filterControl/filterSearchControl";
import { useEffect, useState } from "react";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/Inbox";
import SideBar from "../components/sidebar/sidebar";
import NewUser from "../components/Dynamics/newUserForm";

const ManageUsers: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>("");

  return (
    <PageWrapper>
      <Box sx={{ display: "flex" }}>
        <SideBar
          titlesIcons={{
            test1: <MailIcon />,
            test2: <InboxIcon />,
            test3: <MailIcon />,
            test4: <InboxIcon />,
          }}
          activeTitle="test2"
        />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              mt: 1,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FilterSearchControl label={t("search")} setSearch={setSearch} />
            <NewUser
              callback={(user: UsersData) => {
                console.log(user);
              }}
            />
          </Box>
          <GenericTable
            properties={new UsersData()}
            data={[
              new UsersData("the first", "xbox", "מספר אישי 1", [t("raam")]),
              new UsersData("xbox", "360", "מספר אישי 2", [t("baz")]),
              new UsersData("xbox", "one", "מספר אישי 3", [t("baz")]),
              new UsersData("xbox", "one s", "מספר אישי 4", [t("baz")]),
              new UsersData("xbox", "one x", "מספר אישי 5", [t("raam")]),
              new UsersData("xbox", "series x", "מספר אישי 6", [t("raam")]),
            ]}
          />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default ManageUsers;
