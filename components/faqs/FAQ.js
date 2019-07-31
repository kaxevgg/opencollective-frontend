import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { display, minWidth } from 'styled-system';
import themeGet from '@styled-system/theme-get';
import { Box } from '@rebass/grid';

import { P } from '../Text';

/** Main FAQ's container */
const MainContainer = styled(Box)`
  ${display};
  ${minWidth};
`;

/** A simple wrapper to group entries */
const EntryContainer = styled(Box)``;

/** Main entry container */
export const Entry = styled.details`
  &[open] {
    summary::after {
      content: '−';
    }
  }

  summary {
    margin-top: ${themeGet('space.2')}px;
    margin-bottom: ${themeGet('space.2')}px;
    font-size: 13px;
    font-weight: 500;
    color: ${themeGet('colors.black.800')};
    /* Remove arrow on Firefox */
    list-style: none;

    &:hover {
      color: ${themeGet('colors.black.700')};
    }
  }

  summary:focus {
    outline: 1px dashed ${themeGet('colors.black.200')};
    outline-offset: ${themeGet('space.1')}px;
  }

  summary::after {
    content: '+';
    display: inline-block;
    padding-left: ${themeGet('space.2')}px;
    color: ${themeGet('colors.black.600')};
    font-weight: bold;
  }

  /* Remove arrow on Chrome */
  summary::-webkit-details-marker {
    display: none;
  }
`;

/** Entry title */
export const Title = styled.summary``;

/** Entry content (hidden by default) */
export const Content = styled(Box)``;
Content.defaultProps = {
  mb: 1,
  fontSize: '13px',
  color: 'black.600',
};

export const Separator = styled.hr`
  background: ${themeGet('colors.black.400')};
  width: 100%;
`;

/**
 * A small FAQ with expendable contents. You don't actually have
 */
export default class FAQ extends Component {
  static propTypes = {
    children: PropTypes.node,
    /** The title to display above entries */
    title: PropTypes.string,
    /** All properties from `Box` */
    ...Box.propTypes,
  };

  static defaultProps = {
    title: "FAQ's",
  };

  render() {
    const { title, children, ...props } = this.props;
    return (
      <MainContainer {...props}>
        <P fontWeight="bold" mb={1}>
          {title}
        </P>
        <EntryContainer>{children}</EntryContainer>
      </MainContainer>
    );
  }
}
