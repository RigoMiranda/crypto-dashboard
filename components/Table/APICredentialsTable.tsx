import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useAppContext } from "../../context/AppContext";
import { APICredentialsType } from "../../types/indes";
import { IconButton } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: '#4fc3f7',
    // color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const columns = ["Name", "Is Default", "Is SandBox", "Edit"];

export default function APICredentialsTable() {
  const { apiCredentials, setAPICredentials } = useAppContext();

  const handleIsDefault = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const temp = [...apiCredentials];
    console.log(temp);

    for (let i = 0; i < temp.length; i++) {
      if (e.target.checked) {
        temp[i].isDefault = i === index ? true : false;
      } else {
        temp[i].isDefault = false;
      }
    }
    setAPICredentials(temp);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {columns.map((title, i) => (
              <StyledTableCell key={i} align="center">
                {title}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {apiCredentials?.map((credential: APICredentialsType, i: number) => (
            <StyledTableRow key={i}>
              <StyledTableCell align="center" component="th" scope="row">
                {credential.name}
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                <Checkbox
                  checked={credential.isDefault}
                  disabled={apiCredentials?.length === 1}
                  onChange={(e) => {
                    handleIsDefault(i, e);
                  }}
                />
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                <Checkbox checked={credential.isSandBox} disabled />
              </StyledTableCell>
              <StyledTableCell align="center" component="th" scope="row">
                <IconButton onClick={() => console.log("Remove Creds")}>
                  <HighlightOff />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
