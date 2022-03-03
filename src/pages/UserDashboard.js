import { useState, useContext, useEffect } from "react";
import {
  Grid,
  Button,
  Link,
  Typography,
  Box,
  Paper,
  ButtonGroup,
} from "@mui/material";
import { styled } from "@mui/styles";
import AddBooks from "../components/AddBooks";
import DataTable from "../components/Dashboard/DataTable";
import ChangePostalCode from "../components/ChangePostalCode";
import AuthenticationContext from "../AuthenticationContext";
import {
  columns1,
  columns2,
  columns3,
  columns4,
} from "../data/tableOptions.js";
import MyRating from "../components/MyRating.js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const UserDashboard = ({
  books,
  setBooks,
  booksRented,
  tableDisplay,
  setTableDisplay,
  lentBooks,
  pendingRentals,
}) => {
  const authContext = useContext(AuthenticationContext);
  const [bookData, setBookData] = useState({
    comments: "",
    condition: "gently used",
    isbn: "",
  });
  const [myRating, setMyRating] = useState(null);

  useEffect(() => {
    async function getRating() {
      let result = await fetch(`/api/getRating/${authContext.userId}`);
      result = await result.json();
      console.log(result);
      setMyRating(result[0][0].value);
    }
    getRating();
  }, []);

  async function deleteBook(id) {
    console.log(id);
    setBooks(() => {
      let newBooks = books.filter((book) => {
        return book.id !== id;
      });
      return newBooks;
    });
    let response = await fetch("/api/deleteBook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: authContext.userId }),
    });
    response = await response.json();
    if (response) {
      alert("Delete was successful");
    } else {
      alert("something went wrong");
    }
  }

  const options1 = {
    filterType: "checkbox",
    serverSide: false,
    sort: true,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20, 50, 100],
    onRowsDelete: (rowsDeleted) => {
      console.log(rowsDeleted.data);
      for (let i = 0; i < rowsDeleted.data.length; i++) {
        deleteBook(books[rowsDeleted.data[i].dataIndex].id);
      }
    },
  };
  const options2 = {
    filterType: "checkbox",
    serverSide: false,
    sort: true,
    selectableRows: "none",
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10],
  };

  const options3 = {
    filterType: "checkbox",
    serverSide: false,
    sort: true,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10],
    selectableRows: "none",
  };

  return (
    <div>
      <Box sx={{ flexGrow: 2, marginBottom: 10 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2} sx={{ marginTop: 2 }}>
            <Item>
              <Typography component="subtitle1" variant="h6">
                Profile Area
              </Typography>
              <MyRating myRating={myRating} label="Your average rating" />
              <ChangePostalCode />
            </Item>
          </Grid>
          <Grid item xs={12} md={8}>
            <Item>
              <ButtonGroup
                variant="outlined"
                aria-label="outlined primary button group"
              >
                <Button
                  variant={tableDisplay === 1 ? "contained" : "outlined"}
                  onClick={() => setTableDisplay(1)}
                >
                  Owned
                </Button>
                <Button
                  variant={tableDisplay === 2 ? "contained" : "outlined"}
                  onClick={() => setTableDisplay(2)}
                >
                  Loaned
                </Button>
                <Button
                  variant={tableDisplay === 3 ? "contained" : "outlined"}
                  onClick={() => setTableDisplay(3)}
                >
                  Rented
                </Button>
                <Button
                  variant={tableDisplay === 4 ? "contained" : "outlined"}
                  onClick={() => setTableDisplay(4)}
                >
                  Pending
                </Button>
              </ButtonGroup>
            </Item>
            <Item>
              {" "}
              {tableDisplay === 1 && (
                <>
                  <Button component={Link}>Books Owned</Button>{" "}
                  <DataTable
                    books={books}
                    columns={columns1}
                    setBooks={setBooks}
                    options={options1}
                  />
                </>
              )}
              {tableDisplay === 2 && (
                <>
                  <Button component={Link}>Books Loaned</Button>{" "}
                  <DataTable
                    columns={columns2}
                    books={lentBooks}
                    options={options2}
                  />
                </>
              )}
              {tableDisplay === 3 && (
                <>
                  <Button component={Link}>Rented</Button>
                  <DataTable
                    columns={columns3}
                    books={booksRented}
                    options={options3}
                  />
                </>
              )}
              {tableDisplay === 4 && (
                <>
                  <Button component={Link}>Pending</Button>
                  <DataTable
                    columns={columns4}
                    books={pendingRentals}
                    options={options3}
                  />
                </>
              )}
            </Item>
          </Grid>
          <Grid item xs={12} md={2} sx={{ paddingRight: 1, marginTop: 2 }}>
            <Item>
              <Button component={Link}>Add book</Button>
              <AddBooks
                bookData={bookData}
                setBookData={setBookData}
                setBooks={setBooks}
                books={books}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UserDashboard;
