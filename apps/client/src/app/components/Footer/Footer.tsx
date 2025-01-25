import React from 'react';

import { cn } from '@lib/utils';
import { fullYear } from '@utils/date';
import Link from 'next/link';

import { wrapper } from '../wrapper';

const Footer = () => {
    return (
        <footer>
            <hr className="border-blue-dark opacity-10" />
            <div className={cn('py-4 flex items-center justify-between text-blue-dark', wrapper)}>
                <p className="text-xs font-light">© Copyright {fullYear}, All Rights Reserved by Post AI</p>
                <div className="space-x-3 text-xs font-medium">
                    <Link href={'#'} className="hover:underline">
                        Termos
                    </Link>
                    <Link href={'#'} className="hover:underline">
                        Privacidade
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
