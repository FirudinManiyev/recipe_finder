import api from "./api";
import type { Recipe } from "../types/recipe";

export const getRecipes = async (
    pageNumber: number = 1,
    pageSize: number = 6
) => {
    const response = await api.get(
        `/recipes?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
};

export const searchRecipes = async (data: {
    ingredients: string[];
    maxCookingTime?: number;
    difficulty?: string;
    sortBy?: string;
}) => {
    const response = await api.post("/recipes/search", data);
    return response.data;
};

