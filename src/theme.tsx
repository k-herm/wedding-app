import { createMuiTheme } from '@material-ui/core/styles'

export const mediaBreaks = {
  phone: 414,
  tablet: 768,
  desktop: 1200
}

export const colors = {
  blackGrey: '#212121',
  darkGreen: '#0a2828',
  error: '#fdecea',
  green: '#2b6e65',
  lightGreen: '#b9cdcb',
  sand: '#ceb280',
  success: '#edf7ed',
  terracotta: '#c74825',
  terracotta2: '#b24c1b'
}

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#00897b'
    },
    secondary: {
      main: '#ff8a80'
    }
  }
})
