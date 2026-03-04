import Footer from "./Footer";
import Navbar from "./Navbar";

interface Props {
    children: React.ReactNode;
}

export default function Layout({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-10">
                {children}
            </main>
            <Footer />
        </div>
    );
}