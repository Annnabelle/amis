type Props = {
    children: React.ReactNode;
    className?: string;
};

const FilterBar = ({ children, className }: Props) => {
    return (
        <div className={`box-container-items-item-filters ${className ?? ""}`}>
            {children}
        </div>
    );
};

export default FilterBar;
