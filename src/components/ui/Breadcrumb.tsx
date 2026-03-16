
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import home from '../../assets/svgs/home.svg'
interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-2  py-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index === 0 && (
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 "
                        >
                            <img src={home} alt='home icon' className='h-[24px] w-[24px]' />
                        </button>
                    )}

                    {index > 0 && (
                        <>
                            <ChevronRight className="w-4 h-4 text-[#BCBCBC]" strokeWidth={2} />
                            {item.path ? (
                                <button
                                    onClick={() => navigate(item.path!)}
                                    className="font-mulish text-[18px] text-[#9B9B9B] "
                                >
                                    {item.label}
                                </button>
                            ) : (
                                <span className="font-mulish font-bold text-[18px] text-[#14B8A6]">
                                    {item.label}
                                </span>
                            )}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
