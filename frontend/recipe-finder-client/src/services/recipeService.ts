import api from "./api";
import type { Recipe } from "../types/recipe";

export const getRecipes = async (): Promise<Recipe[]> => {
    const response = await api.get("/recipes");
    return response.data;
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
};