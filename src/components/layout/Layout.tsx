import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';

export function Layout() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] font-satoshi text-[#080E0D] selection:bg-[#418BF5] selection:text-white pb-10">
            <div className="max-w-[1440px] mx-auto pt-10 flex flex-col gap-6">
                <NavBar />
                <Outlet />
            </div>
        </div>
    );
}
