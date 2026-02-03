type ItemProps = {
    label: string;
    children: React.ReactNode;
};

const BatchItem = ({ label, children }: ItemProps) => {
    if (!children) return null;

    return (
        <div className="box-batch-container-items-item">
            <div className="box-batch-container-items-item-title">
                <h5 className="title">{label} :</h5>
            </div>
            <div className="box-batch-container-items-item-subtitle">
                {children}
            </div>
        </div>
    );
};

export default BatchItem


