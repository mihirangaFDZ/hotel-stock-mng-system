import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="flex items-center space-x-3 text-sm font-medium text-gray-500 bg-gray-50 py-2 px-4 rounded-md shadow-sm">
            <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
                Home
            </Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                return (
                    <React.Fragment key={name}>
                        <span className="text-gray-400">/</span>
                        {isLast ? (
                            <span className="text-gray-700">{name}</span>
                        ) : (
                            <Link
                                to={routeTo}
                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                {name}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;