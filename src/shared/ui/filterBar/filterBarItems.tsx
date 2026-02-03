type Props = {
    children: React.ReactNode;
};

const FilterBarItem = ({ children }: Props) => {
    return (
        <div className="form-inputs">
            {children}
        </div>
    );
};

export default FilterBarItem;



