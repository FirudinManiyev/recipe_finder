import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RecipeDetailPage from "../pages/RecipeDetailPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;