import FilterSearchBar from "../Dynamics/filterSearchBar";
import "../../i18n";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Checkbox,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Stack,
} from "@mui/material";
import { PlatformData } from "../../types/tables/manageTypes";
import { API_Pathes, useBackend } from "../../context/backendContext";
import { HttpStatusCode } from "axios";

interface EditPlatformProps {
  platformData: PlatformData;
  objectCallback: (data: PlatformData) => void;
}

const EditPlatform: React.FC<EditPlatformProps> = ({ platformData, objectCallback }) => {
  const { t } = useTranslation();
  const { connection } = useBackend();
  const [id, setId] = useState<string>("" + platformData._id);
  const [name, setName] = useState<string>(platformData.name);
  const [selectableField, setSelectableField] = useState<any>([]);
  const [selectableFieldChecked, setSelectableFieldChecked] = useState<
    boolean[]
  >([]);
  const [modifiedFields, setModifiedFields] = useState<any[]>([]);

  const handleNameChange = (newName: string) => {
    setName(newName);
    objectCallback(new PlatformData(newName, Number(id), modifiedFields));
  };

  useEffect(() => {
    getSelectableFields();
  }, []);

  const getSelectableFields = async () => {
    if (selectableField.length === 0) {
      const fields = await connection.getAllEntities(
        API_Pathes.NEW_FLIGHTS_FIELDS,
      );

      if (fields.status === HttpStatusCode.Ok) {
        setSelectableField(fields.data);

        setSelectableFieldChecked(
          fields.data.map((field: any) => {
            if (!field.showFor || !Array.isArray(field.showFor)) {
              return false;
            }
            const hasExactName = field.showFor.includes(platformData.name);

            const hasTranslatedName = field.showFor.includes(
              t(platformData.name, { lng: "heEn" }),
            );

            return hasExactName || hasTranslatedName;
          }),
        );
      }
    }
  };

  const togglePlatformInShowFor = (
    showForArray: string[] | undefined,
    isNowChecked: boolean,
    exactName: string,
    translatedName: string,
  ): string[] => {

    let updatedShowFor = Array.isArray(showForArray) ? [...showForArray] : [];

    if (isNowChecked) {
      if (!updatedShowFor.includes(exactName)) {
        updatedShowFor.push(exactName);
      }
    } else {
      updatedShowFor = updatedShowFor.filter(
        (existingPlatformName) =>
          existingPlatformName !== exactName &&
          existingPlatformName !== translatedName,
      );
    }

    return updatedShowFor;
  };

  const handleCheckedBoxChange = (index: number) => {
    const updatedCheckedState = [...selectableFieldChecked];
    const isNowChecked = !updatedCheckedState[index];
    updatedCheckedState[index] = isNowChecked;
    setSelectableFieldChecked(updatedCheckedState);

    const updatedFields = [...selectableField];
    const fieldToUpdate = { ...updatedFields[index] };

    const exactName = platformData.name;
    const translatedName = t(platformData.name, { lng: "heEn" });

    fieldToUpdate.showFor = togglePlatformInShowFor(
      fieldToUpdate.showFor,
      isNowChecked,
      exactName,
      translatedName
    );

    updatedFields[index] = fieldToUpdate;
    setSelectableField(updatedFields);

    const newlyModified = [
      ...modifiedFields.filter(
        (existingField: any) => existingField._id !== fieldToUpdate._id,
      ),
      fieldToUpdate,
    ];
    setModifiedFields(newlyModified);

    objectCallback(new PlatformData(name, Number(id), newlyModified));
  };

  return (
    <DialogContent>
      <Stack spacing={2}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box sx={{ minWidth: "200px", flex: 1 }}>
            <FilterSearchBar
              label={t("platformId")}
              value={id}
              setSearch={setId}
              isReset={false}
              width="100%"
              disabled
            />
          </Box>
          <Box sx={{ minWidth: "220px", flex: 2 }}>
            <FilterSearchBar
              label={t("platformName")}
              value={name}
              setSearch={handleNameChange}
              isReset={false}
              width="100%"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {selectableField.map((field: any, index: number) => (
            <Box sx={{ width: "calc(31% - 10px)" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectableFieldChecked[index]}
                      onChange={() => handleCheckedBoxChange(index)}
                    />
                  }
                  label={field.display}
                />
              </FormGroup>
            </Box>
          ))}
        </Box>
      </Stack>
    </DialogContent>
  );
};

export default EditPlatform;
