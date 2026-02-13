import Link from 'next/link';

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/public" className="font-bold text-xl text-indigo-600">
                        TopTier Service Co.
                    </Link>
                    <nav className="flex gap-4 text-sm text-gray-500">
                        <Link href="/public/booking" className="hover:text-gray-900">Book Now</Link>
                        <Link href="/public/contact" className="hover:text-gray-900">Contact</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {children}
            </main>
            <footer className="text-center py-8 text-gray-400 text-sm">
                &copy; 2026 TopTier Service Co.
            </footer>
        </div>
    );
}
