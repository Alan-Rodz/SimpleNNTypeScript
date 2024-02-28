'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { FC, PropsWithChildren } from 'react';

// ********************************************************************************
// == Type ========================================================================
type Props = PropsWithChildren;

// == Component ===================================================================
export const ClientProviders: FC<Props> = ({ children }) =>
  <CacheProvider>
    <ChakraProvider>
      {children}
    </ChakraProvider>
  </CacheProvider>;
