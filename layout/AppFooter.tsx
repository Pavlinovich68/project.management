/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Image from "next/image";

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <Image src={`/layout/images/iterritoria.svg`}
                   alt="Logo"
                   width="0"
                   height="0"
                   sizes="100vw"
                   style={{ width: '120px', height: 'auto' }}
                   className="mr-2" />
        </div>
    );
};

export default AppFooter;
