import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/consts";
import axiosInstance from "../../utils/axiosInstance";
import type { GetReferenceByTypeDto } from "../../dtos/references";
import type { Reference, ReferenceBookType } from "../../types/references";
import { mapReferenceDtoToReference } from "../../mappers/references";

type ReferencesState = {
  data: Reference[];
  loading: boolean;
  error: string | null;
};

const initialState: ReferencesState = {
    
  data: [],
  loading: false,
  error: null,
};

export const fetchReferencesByType = createAsyncThunk<
  Reference[],
  ReferenceBookType,
  { rejectValue: string }
>(
  "references/fetchByType",
  async (type, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<GetReferenceByTypeDto>(
        `${BASE_URL}/references/${type}`
      );

      return data.references.map(mapReferenceDtoToReference);
    } catch (err: any) {
      return rejectWithValue(err.message ?? "Ошибка загрузки справочников");
    }
  }
);



export const referencesSlice = createSlice({
  name: "references",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferencesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferencesByType.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchReferencesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки справочников";
      });
  },
});

export default referencesSlice.reducer;