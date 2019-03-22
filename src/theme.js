/* @flow */
import { createMuiTheme } from 'material-ui/styles';
import { black, red } from 'material-ui/colors';

// https://material-ui-next.com/customization/themes/
// https://material-ui-next.com/style/color/
export default createMuiTheme({
  palette: {
    primary: black,
    secondary: red,
  },
  overrides: {
    MuiButton: {
      raisedPrimary: {
        color: 'white',
      },
    },
  },
});
