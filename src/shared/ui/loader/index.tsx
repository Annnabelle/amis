// components/GlobalLoader.tsx
import React from "react";
import { Spin } from "antd";
import './styles.sass'

interface GlobalLoaderProps {
    loading: boolean;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="global-loader-overlay">
            <Spin size="large" />
        </div>
    );
};

export default GlobalLoader;



