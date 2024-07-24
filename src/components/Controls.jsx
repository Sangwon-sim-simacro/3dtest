import React, { useState } from 'react';
import { ButtonUploadCsv } from './UploadCSV';

export const LeftMenu = () => {
    return (
        <div className='left-menu'>
            <ButtonUploadCsv />
        </div>
    );
};