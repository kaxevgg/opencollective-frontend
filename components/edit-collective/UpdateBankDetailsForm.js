import React from 'react';
import PropTypes from 'prop-types';
import { startCase, toUpper } from 'lodash';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';

import Container from '../Container';
import { Box, Flex } from '../Grid';
import StyledTextarea from '../StyledTextarea';
import { P, Span } from '../Text';

const List = styled.ul`
  margin: 0;
  padding: 0;
  position: relative;
  list-style: none;
`;

class UpdateBankDetailsForm extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    profileType: PropTypes.string, // USER or ORGANIZATION
    error: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    useStructuredForm: PropTypes.bool,
    bankAccount: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { form: { instructions: props.value } };
    this.onChange = this.onChange.bind(this);
    this.messages = defineMessages({
      'bankaccount.instructions.label': {
        id: 'paymentMethods.manual.instructions',
        defaultMessage: 'Bank transfer instructions',
      },
    });
  }

  onChange(field, value) {
    const newState = this.state;
    newState.form[field] = value;
    this.setState(newState);
    this.props.onChange(newState.form);
  }

  formatAccountDetails(payoutMethodData) {
    const ignoredKeys = ['type', 'isManualBankTransfer', 'currency'];
    const labels = {
      abartn: 'Routing Number: ',
      firstLine: '',
    };

    const formatKey = s => {
      if (labels[s] !== undefined) {
        return labels[s];
      }
      if (toUpper(s) === s) {
        return `${s}: `;
      }
      return `${startCase(s)}: `;
    };

    const renderObject = (object, prefix = '') =>
      Object.entries(object)
        .sort(a => (typeof a[1] == 'object' ? 1 : -1))
        .reduce((acc, [key, value]) => {
          if (ignoredKeys.includes(key)) {
            return acc;
          }
          if (typeof value === 'object') {
            if (key === 'details') {
              return [...acc, ...renderObject(value, '')];
            }
            return [...acc, formatKey(key), ...renderObject(value, '  ')];
          }
          return [...acc, `${prefix}${formatKey(key)}${value}`];
        }, []);

    const lines = renderObject(payoutMethodData);

    return lines.join('\n');
  }

  renderInstructions() {
    const formatValues = {
      account: this.props.bankAccount ? this.formatAccountDetails(this.props.bankAccount) : '',
      reference: '76400',
      OrderId: '76400',
      amount: '$30',
      collective: 'acme',
    };
    return this.state.form.instructions.replace(/{([\s\S]+?)}/g, (match, p1) => {
      if (p1) {
        const key = p1.toLowerCase();
        if (formatValues[key] !== undefined) {
          return formatValues[key];
        }
      }
      return match;
    });
  }

  render() {
    const { intl, value, error, useStructuredForm } = this.props;
    return (
      <Flex flexDirection="column">
        <Container as="fieldset" border="none" width={1}>
          <Flex flexDirection={['column-reverse', 'row']}>
            <Box mb={3} flexGrow={1}>
              <StyledTextarea
                label={intl.formatMessage(this.messages['bankaccount.instructions.label'])}
                htmlFor="instructions"
                width="100%"
                height={400}
                onChange={e => this.onChange('instructions', e.target.value)}
                defaultValue={value}
              />
            </Box>
            <Container fontSize="1.4rem" pl={[0, 3]} width={[1, 0.5]}>
              <P>
                <FormattedMessage
                  id="bankaccount.instructions.variables"
                  defaultMessage="You can use the following variables in the instructions:"
                />
              </P>

              <List>
                {useStructuredForm && (
                  <li>
                    <code>&#123;account&#125;</code>:{' '}
                    <FormattedMessage
                      id="bankaccount.instructions.account"
                      defaultMessage="bank account details added above"
                    />
                  </li>
                )}
                <li>
                  <code>&#123;amount&#125;</code>:{' '}
                  <FormattedMessage id="bankaccount.instructions.amount" defaultMessage="total amount of the order" />
                </li>
                <li>
                  <code>&#123;collective&#125;</code>:{' '}
                  <FormattedMessage
                    id="bankaccount.instructions.collective"
                    defaultMessage="slug of the collective receiving the order"
                  />
                </li>
                <li>
                  <code>&#123;reference&#125;</code>:{' '}
                  <FormattedMessage
                    id="bankaccount.instructions.reference"
                    defaultMessage="unique id to track when the order is received"
                  />
                </li>

                <P>
                  <FormattedMessage id="bankaccount.instructions.preview" defaultMessage="Preview:" />
                </P>

                <pre style={{ whiteSpace: 'pre-wrap' }}>{this.renderInstructions()}</pre>
              </List>
            </Container>
          </Flex>
        </Container>

        {error && (
          <Span display="block" color="red.500" pt={2} fontSize="Tiny">
            {error}
          </Span>
        )}
      </Flex>
    );
  }
}

export default injectIntl(UpdateBankDetailsForm);
