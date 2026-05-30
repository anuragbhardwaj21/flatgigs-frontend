import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { store } from "./store";
import { buildMuiTheme } from "./utils/mui";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const muiTheme = buildMuiTheme("green");

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme} defaultMode="light">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <RouterProvider router={router} />
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
