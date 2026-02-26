export interface Recipe {
    id: number;
    title: string;
    description: string;
    cookingTime: number;
    difficulty: string;
    imageUrl: string;
    ingredients: string[];
    matchingScore: number;
    missingIngredients: string[];
}