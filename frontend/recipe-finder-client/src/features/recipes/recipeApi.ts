import axios from "axios";
import api from "../../shared/api/client";
import type { Recipe } from "../../types/recipe";

export const getRecipes = async (
    pageNumber: number = 1,
    pageSize: number = 6
): Promise<Recipe[]> => {
    const response = await api.get(
        `/recipes?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return Array.isArray(response.data) ? response.data : [];
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
}): Promise<Recipe[]> => {
    const response = await api.post("/recipes/search", data);
    return Array.isArray(response.data) ? response.data : [];
};

export const getRandomRecipe = async (): Promise<Recipe | null> => {
    try {
        const response = await api.get("/recipes/random");
        return response.data as Recipe;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
    }
};

export const getRecipeCount = async (): Promise<number> => {
    const response = await api.get("/recipes/count");
    return Number(response.data) || 0;
};
