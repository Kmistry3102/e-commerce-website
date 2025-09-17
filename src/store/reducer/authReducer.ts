import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    auth: null as any,
}

export const authReducer = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login : (state, action) => {
            state.auth = action.payload
        },
        logout : (state) => {
            state.auth = null
        },
    },
})

export const { login, logout } = authReducer.actions
export default authReducer.reducer