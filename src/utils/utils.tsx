import React, { FC } from 'react';

/**
 * Reduce a list of providers to a single provider
 * @param providers
 */
export const combineProviders = (providers: Array<FC<{}>>): FC => {
  return providers.reduce((Combined, Provider) => ({ children }) => (
    <Combined>
      <Provider>{children}</Provider>
    </Combined>
  ));
};
