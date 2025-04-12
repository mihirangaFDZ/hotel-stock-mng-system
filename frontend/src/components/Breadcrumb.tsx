import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

// Helper function to format path names
const formatPathName = (name: string): string => {
    // Handle specific cases
    if (name.includes("update-item")) return "Update Item";
    if (name.includes("add-item")) return "Add Item";
    if (name.includes("all-products")) return "All Products";
    if (name.includes("low-stock-items")) return "Low Stock Items";

    // Default formatting: replace hyphens with spaces and capitalize words
    return name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const Breadcrumb: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav className="flex items-center space-x-2 text-sm font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 py-3 px-5 rounded-lg shadow-sm mb-6">
            {/* Home Link */}
            <Link
                to="/"
                className="flex items-center text-blue-600 hover:text-blue-800 transition-all duration-200 group"
            >
                <Home className="h-4 w-4 mr-1 text-blue-600 group-hover:text-blue-800" />
                <span className="relative">
                    Home
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
            </Link>

            {/* Breadcrumb Items */}
            {pathnames.map((name, index) => {
                // Skip rendering the ID part for /update-item/:id
                if (name.match(/^[0-9a-fA-F]{24}$/)) {
                    return null; // MongoDB IDs are 24-character hex strings
                }

                // Adjust the routeTo path to exclude the ID if we're on /update-item/:id
                const isUpdateItemPath = pathnames[index - 1] === "update-item";
                const routeTo = isUpdateItemPath
                    ? "/update-item"
                    : `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1 || isUpdateItemPath;

                return (
                    <React.Fragment key={name}>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {isLast ? (
                            <span className="text-gray-700 font-semibold">
                                {formatPathName(name)}
                            </span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="text-blue-600 hover:text-blue-800 transition-all duration-200 group relative"
                            >
                                {formatPathName(name)}
                                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;