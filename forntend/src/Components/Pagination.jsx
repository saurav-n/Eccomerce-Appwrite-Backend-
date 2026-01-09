'use client';
import { 
    Pagination, 
    PaginationContent, 
    PaginationItem, 
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis
} from "@/Components/ui/pagination";
import { useEffect, useState } from "react";



export default function AppPagination({ currentPage, totalPages, onPageChange }) {
    // Generate array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        
        // Always show first page
        pages.push(1);
        
        // Calculate which pages to show based on current page
        for (let i = 2; i < totalPages; i++) {
            const diff = Math.abs(i - currentPage);
            
            // Show page if difference is <= 3 from current page
            if (diff <= 3) {
                pages.push(i);
            }
        }
        
        // Always show last page if there's more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }
        
        // Insert ellipsis where there are gaps
        const pagesWithEllipsis = [];
        for (let i = 0; i < pages.length; i++) {
            pagesWithEllipsis.push(pages[i]);
            
            // Check if there's a gap between current and next page
            if (i < pages.length - 1 && typeof pages[i] === 'number' && typeof pages[i + 1] === 'number') {
                const current = pages[i]
                const next = pages[i + 1]
                
                if (next - current > 1) {
                    pagesWithEllipsis.push('ellipsis');
                }
            }
        }
        
        return pagesWithEllipsis;
    };

    const [pageNumbers,setPageNumbers] = useState(getPageNumbers());

    const handlePageClick = (page) => {
        if (onPageChange) {
            console.log('paginating',page)
            onPageChange(page);
        }
    };

    useEffect(() => {
        setPageNumbers(getPageNumbers());
    }, [currentPage, totalPages]);


    return (
        <Pagination>
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                                handlePageClick(currentPage - 1);
                            }
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => (
                    page === 'ellipsis' ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink 
                                href="#" 
                                isActive={currentPage === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageClick(page);
                                }}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                ))}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) {
                                handlePageClick(currentPage + 1);
                            }
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}