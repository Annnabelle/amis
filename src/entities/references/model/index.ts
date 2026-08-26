import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "shared/lib/consts";
import axiosInstance from "shared/lib/axiosInstance";
import type { GetDistrictsResponseDto, GetReferenceByTypeDto, GetRegionsResponseDto } from "entities/references/dtos";
import type { Reference, ReferenceBookType } from "entities/references/types";
import { mapAddressReferenceDtoToReference, mapReferenceDtoToReference } from "entities/references/mappers";

type ReferencesState = {
  references:  Record<string, Reference[]>;
  districtsByRegionId: Record<string, Reference[]>;
  loading: boolean;
  districtsLoading: boolean;
  error: string | null;
};

const initialState: ReferencesState = {

  references: {},
  districtsByRegionId: {},
  loading: false,
  districtsLoading: false,
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

export const fetchRegions = createAsyncThunk<
    Reference[],
    void,
    { rejectValue: string }
>(
    "references/fetchRegions",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get<GetRegionsResponseDto>(
            `${BASE_URL}/references/regions`
        );

        return data.regions.map(mapAddressReferenceDtoToReference);
      } catch (err: any) {
        return rejectWithValue(err.message ?? "Ошибка загрузки регионов");
      }
    }
);

export const fetchDistrictsByRegion = createAsyncThunk<
    { regionId: string; data: Reference[] },
    string,
    { rejectValue: string }
>(
    "references/fetchDistrictsByRegion",
    async (regionId, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get<GetDistrictsResponseDto>(
            `${BASE_URL}/references/districts`,
            { params: { regionId } }
        );

        return {
          regionId,
          data: data.districts.map(mapAddressReferenceDtoToReference),
        };
      } catch (err: any) {
        return rejectWithValue(err.message ?? "Ошибка загрузки районов");
      }
    }
);




export const referencesSlice = createSlice({
  name: "references",
  initialState,
  reducers: {
    resetOrders: (state) => {
      state.references = {};
      state.districtsByRegionId = {};
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
      })
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.references.regions = action.payload;
        state.loading = false;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка загрузки регионов";
      })
      .addCase(fetchDistrictsByRegion.pending, (state) => {
        state.districtsLoading = true;
        state.error = null;
      })
      .addCase(fetchDistrictsByRegion.fulfilled, (state, action) => {
        state.districtsByRegionId[action.payload.regionId] = action.payload.data;
        state.districtsLoading = false;
      })
      .addCase(fetchDistrictsByRegion.rejected, (state, action) => {
        state.districtsLoading = false;
        state.error = action.payload || "Ошибка загрузки районов";
      });
  },
});

export default referencesSlice.reducer;



