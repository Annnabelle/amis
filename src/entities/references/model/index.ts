import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { GetReferenceByTypeDto } from "entities/references/dtos";
import type { Reference, ReferenceBookType } from "entities/references/types";
import { mapReferenceDtoToReference } from "entities/references/mappers";

type ReferencesState = {
  references:  Record<string, Reference[]>;
  loading: boolean;
  error: string | null;
};

const initialState: ReferencesState = {

  references: {},
  loading: false,
  error: null,
};

export const fetchReferencesByType = createAsyncThunk<
    { type: ReferenceBookType; data: Reference[] },
    ReferenceBookType,
    { rejectValue: string }
>(
    "references/fetchByType",
    async (type, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get<GetReferenceByTypeDto>(
            `${BASE_URL}/references/${type}`
        );

        return {
          type,
          data: data.references.map(mapReferenceDtoToReference),
        };
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
      state.references = {};
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
        const { type, data } = action.payload;

        state.references[type] = data;
        state.loading = false;
      })
      .addCase(fetchReferencesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки справочников";
      });
  },
});

export default referencesSlice.reducer;



