// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { DateTime } from 'luxon';

import ParkingServiceAvailability from './ParkingServiceAvailability.json';

const SupportedLanguages = {
  'cs-CZ': true,
  'nl-NL': true,
  'en-GB': true,
  'fr-FR': true,
  'de-DE': true,
  'hu-HU': true,
  'it-IT': true,
  'lt-LT': true,
  'pl-PL': true,
  'pt-PT': true,
  'ro-RO': true,
  'ru-RU': true,
  'es-ES': true,
  'tr-TR': true,
};

type AncestorType = {|
  +iataCode: $Keys<typeof ParkingServiceAvailability>,
  +fromDate: Date,
  +toDate: Date,
|};

export default new GraphQLObjectType({
  name: 'ParkingService',
  fields: {
    whitelabelURL: {
      type: GraphQLString,
      resolve: (
        { iataCode, fromDate, toDate }: AncestorType,
        args: void,
        context,
      ): string | null => {
        if (ParkingServiceAvailability[iataCode] !== true) {
          return null;
        }

        let language = context.locale.replace('_', '-');
        if (SupportedLanguages[language] !== true) {
          language = 'en-GB';
        }

        const DATES_FORMAT = 'yyyyLLddHHmm'; // YYYYMMDDHHMM - https://github.com/moment/luxon/blob/baf63e639b1b635f10ef54744c2def23ecfb9140/docs/formatting.md#table-of-tokens

        const fromString = DateTime.fromJSDate(fromDate, {
          zone: 'utc',
        }).toFormat(DATES_FORMAT);

        const toString = DateTime.fromJSDate(toDate, {
          zone: 'utc',
        }).toFormat(DATES_FORMAT);

        return `http://kiwi.parkcloud.com/${language}/Search/${iataCode}/${fromString}/${toString}`;
      },
    },
  },
});
