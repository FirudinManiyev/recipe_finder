export default function Footer() {
    return (
        <footer className="bg-gray-700 text-white py-8">
            <div className="container mx-auto px-4 text-center">
                <p className="text-lg font-semibold">
                    RecipeFinder © {new Date().getFullYear()}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    Dadlı reseptləri asan tap!
                </p>
            </div>
        </footer>
    );
}