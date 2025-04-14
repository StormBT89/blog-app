import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    lux: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toogleTheme: (state) => {
            state.lux = state.lux === 'light' ? 'dark' : 'light';
        },
    }
});

export const {toogleTheme} = themeSlice.actions;

export default themeSlice.reducer;

