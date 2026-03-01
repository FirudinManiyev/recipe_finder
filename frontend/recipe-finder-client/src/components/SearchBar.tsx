import { useState } from "react";

interface Props {
    onSearch: (data: {
        ingredients: string[];
        maxCookingTime?: number;
        difficulty?: string;
        sortBy?: string;
    }) => void;
}

const SearchBar = ({ onSearch }: Props) => {
    const [input, setInput] = useState("");
    const [maxTime, setMaxTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [sortBy, setSortBy] = useState("mostmatched");

    const handleSearch = () => {
        const ingredientsArray = input
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i !== "");

        onSearch({
            ingredients: ingredientsArray,
            maxCookingTime: maxTime ? Number(maxTime) : undefined,
            difficulty: difficulty || undefined,
            sortBy,
        });
    };

    return (
        <div className="mb-8 bg-white p-4 rounded-xl shadow">
            <div className="grid md:grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="toyuq, kartof"
                    className="border rounded-lg p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Max vaxt (dəq)"
                    className="border rounded-lg p-2"
                    value={maxTime}
                    onChange={(e) => setMaxTime(e.target.value)}
                />

                <select
                    className="border rounded-lg p-2"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="">Çətinlik</option>
                    <option value="Asan">Asan</option>
                    <option value="Orta">Orta</option>
                    <option value="Çətin">Çətin</option>
                </select>

                <select
                    className="border rounded-lg p-2"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="mostmatched">Ən uyğun</option>
                    <option value="newest">Ən yeni</option>
                    <option value="az">A-Z</option>
                </select>
            </div>

            <button
                onClick={handleSearch}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
                Axtar
            </button>
        </div>
    );
};

export default SearchBar;