interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const showPages = 5; // Number of page buttons to show

        let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
        const endPage = Math.min(totalPages, startPage + showPages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage + 1 < showPages) {
            startPage = Math.max(1, endPage - showPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center my-8">
            {/* Previous button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-tl-xl rounded-bl-xl border-r-0 ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
            >
                &lt;
            </button>

            {/* First page */}
            {getPageNumbers()[0] > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="px-4 py-2  border border-gray-300 border-r-0 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        1
                    </button>
                    {getPageNumbers()[0] > 2 && (
                        <span className="px-4 py-2 border border-gray-300 border-r-0">...</span>
                    )}
                </>
            )}

            {/* Page numbers */}
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-4 py-2  border border-r-0 ${
                        currentPage === page
                            ? 'bg-PLGreen text-white border-PLGreen'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {page}
                </button>
            ))}

            {/* Last page */}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                    {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                        <span className="px-4 py-2 border border-r-0 border-gray-300">...</span>
                    )}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="px-4 py-2 border border-gray-300 border-r-0 bg-white text-gray-700 hover:bg-gray-50"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            {/* Next button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2  rounded-tr-xl rounded-br-xl ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
            >
                &gt;
            </button>
        </div>
    );
}